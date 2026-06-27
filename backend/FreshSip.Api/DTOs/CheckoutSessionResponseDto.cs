namespace FreshSip.Api.DTOs;

public class CheckoutSessionResponseDto
{
    public int OrderId { get; set; }

    public string SessionId { get; set; } = string.Empty;

    public string SessionUrl { get; set; } = string.Empty;
}
