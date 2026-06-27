using FreshSip.Api.DTOs;
using FreshSip.Api.Models;
using FreshSip.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;

namespace FreshSip.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly StripeSettings _stripeSettings;

    public PaymentsController(IOrderService orderService, IOptions<StripeSettings> stripeOptions)
    {
        _orderService = orderService;
        _stripeSettings = stripeOptions.Value;
    }

    [HttpPost("create-checkout-session")]
    public async Task<ActionResult<CheckoutSessionResponseDto>> CreateCheckoutSession(CreateCheckoutSessionDto checkoutDto)
    {
        if (string.IsNullOrWhiteSpace(_stripeSettings.SecretKey))
        {
            return StatusCode(500, new { message = "Stripe secret key is not configured." });
        }

        if (!IsAllowedAbsoluteUrl(checkoutDto.SuccessUrl) || !IsAllowedAbsoluteUrl(checkoutDto.CancelUrl))
        {
            return BadRequest(new { message = "SuccessUrl and CancelUrl must be valid absolute URLs." });
        }

        StripeConfiguration.ApiKey = _stripeSettings.SecretKey;

        try
        {
            var order = await _orderService.CreatePendingPaymentOrderAsync(new CreateOrderDto
            {
                CustomerName = checkoutDto.CustomerName,
                CustomerPhone = checkoutDto.CustomerPhone,
                Status = "Pending",
                Items = checkoutDto.Items
            });

            var sessionService = new SessionService();
            var session = await sessionService.CreateAsync(new SessionCreateOptions
            {
                Mode = "payment",
                SuccessUrl = checkoutDto.SuccessUrl,
                CancelUrl = checkoutDto.CancelUrl,
                LineItems = order.Items.Select(item => new SessionLineItemOptions
                {
                    Quantity = item.Quantity,
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = _stripeSettings.Currency,
                        UnitAmount = (long)Math.Round(item.UnitPrice * 100m),
                        ProductData = BuildStripeProductData(item)
                    }
                }).ToList(),
                Metadata = new Dictionary<string, string>
                {
                    ["orderId"] = order.Id.ToString()
                }
            });

            await _orderService.SetStripeSessionIdAsync(order.Id, session.Id);

            return Ok(new CheckoutSessionResponseDto
            {
                OrderId = order.Id,
                SessionId = session.Id,
                SessionUrl = session.Url ?? string.Empty
            });
        }
        catch (InvalidOperationException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
        catch (StripeException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }

    [HttpGet("success")]
    public async Task<ActionResult<OrderDto>> VerifySuccessfulPayment([FromQuery(Name = "session_id")] string sessionId)
    {
        if (string.IsNullOrWhiteSpace(_stripeSettings.SecretKey))
        {
            return StatusCode(500, new { message = "Stripe secret key is not configured." });
        }

        if (string.IsNullOrWhiteSpace(sessionId))
        {
            return BadRequest(new { message = "session_id is required." });
        }

        StripeConfiguration.ApiKey = _stripeSettings.SecretKey;

        try
        {
            var sessionService = new SessionService();
            var session = await sessionService.GetAsync(sessionId);

            if (!string.Equals(session.PaymentStatus, "paid", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new { message = "Payment has not been completed yet." });
            }

            var updatedOrder = await _orderService.MarkPaymentAsPaidAsync(sessionId);

            if (updatedOrder == null)
            {
                return NotFound();
            }

            return Ok(updatedOrder);
        }
        catch (StripeException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }

    private static SessionLineItemPriceDataProductDataOptions BuildStripeProductData(OrderItemDto item)
    {
        var productData = new SessionLineItemPriceDataProductDataOptions
        {
            Name = item.JuiceName
        };

        var stripeImages = GetStripeImages(item.ImageUrl);

        if (stripeImages.Count > 0)
        {
            productData.Images = stripeImages;
        }

        return productData;
    }

    private static List<string> GetStripeImages(string? imageUrl)
    {
        if (string.IsNullOrWhiteSpace(imageUrl))
        {
            return [];
        }

        return Uri.TryCreate(imageUrl, UriKind.Absolute, out var uri)
               && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps)
            ? [imageUrl]
            : [];
    }

    private static bool IsAllowedAbsoluteUrl(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
        {
            return false;
        }

        var normalizedUrl = url.Replace("{CHECKOUT_SESSION_ID}", "test-session-id", StringComparison.Ordinal);

        return Uri.TryCreate(normalizedUrl, UriKind.Absolute, out var uri)
               && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }
}
