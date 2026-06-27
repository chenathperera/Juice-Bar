using FreshSip.Api.Data;
using FreshSip.Api.DTOs;
using FreshSip.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FreshSip.Api.Services;

public class OrderService : IOrderService
{
    private static readonly Dictionary<string, string> AllowedStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        ["Pending"] = "Pending",
        ["Preparing"] = "Preparing",
        ["Ready"] = "Ready",
        ["Completed"] = "Completed",
        ["Cancelled"] = "Cancelled"
    };

    private readonly ApplicationDbContext _context;

    public OrderService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<OrderDto>> GetAllAsync()
    {
        var orders = await _context.Orders
            .Include(order => order.OrderItems)
            .ThenInclude(orderItem => orderItem.Juice)
            .OrderByDescending(order => order.OrderDate)
            .ToListAsync();

        return orders.Select(order => MapToOrderDto(order));
    }

    public async Task<OrderDto?> GetByIdAsync(int id)
    {
        var order = await _context.Orders
            .Include(order => order.OrderItems)
            .ThenInclude(orderItem => orderItem.Juice)
            .FirstOrDefaultAsync(order => order.Id == id);

        if (order == null)
        {
            return null;
        }

        return MapToOrderDto(order);
    }

    public async Task<OrderDto> CreateAsync(CreateOrderDto createOrderDto)
    {
        var order = await BuildOrderAsync(createOrderDto, "Unpaid");

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        var createdOrder = await LoadOrderAsync(order.Id);
        return MapToOrderDto(createdOrder);
    }

    public async Task<OrderDto> CreatePendingPaymentOrderAsync(CreateOrderDto createOrderDto)
    {
        var order = await BuildOrderAsync(createOrderDto, "Unpaid");

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        var createdOrder = await LoadOrderAsync(order.Id);
        return MapToOrderDto(createdOrder);
    }

    public async Task<bool> SetStripeSessionIdAsync(int orderId, string sessionId)
    {
        var order = await _context.Orders.FindAsync(orderId);

        if (order == null)
        {
            return false;
        }

        order.StripeSessionId = sessionId;
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<OrderDto?> MarkPaymentAsPaidAsync(string sessionId)
    {
        var order = await _context.Orders
            .Include(existingOrder => existingOrder.OrderItems)
            .ThenInclude(existingOrderItem => existingOrderItem.Juice)
            .FirstOrDefaultAsync(existingOrder => existingOrder.StripeSessionId == sessionId);

        if (order == null)
        {
            return null;
        }

        order.PaymentStatus = "Paid";
        await _context.SaveChangesAsync();

        return MapToOrderDto(order);
    }

    public async Task<OrderDto?> UpdateStatusAsync(int id, UpdateOrderStatusDto updateOrderStatusDto)
    {
        if (!TryGetValidStatus(updateOrderStatusDto.Status, out var validStatus))
        {
            throw new ArgumentException("Status must be Pending, Preparing, Ready, Completed, or Cancelled.");
        }

        var order = await _context.Orders
            .Include(existingOrder => existingOrder.OrderItems)
            .ThenInclude(existingOrderItem => existingOrderItem.Juice)
            .FirstOrDefaultAsync(existingOrder => existingOrder.Id == id);

        if (order == null)
        {
            return null;
        }

        order.Status = validStatus;
        await _context.SaveChangesAsync();

        return MapToOrderDto(order);
    }

    private async Task<Order> BuildOrderAsync(CreateOrderDto createOrderDto, string paymentStatus)
    {
        var juiceIds = createOrderDto.Items
            .Select(item => item.JuiceId)
            .Distinct()
            .ToList();

        var juices = await _context.Juices
            .Where(juice => juiceIds.Contains(juice.Id))
            .ToListAsync();

        if (juices.Count != juiceIds.Count)
        {
            throw new InvalidOperationException("One or more ordered juices do not exist.");
        }

        var juiceLookup = juices.ToDictionary(juice => juice.Id);
        var createdAt = DateTime.UtcNow;

        var order = new Order
        {
            CustomerName = createOrderDto.CustomerName.Trim(),
            CustomerPhone = createOrderDto.CustomerPhone.Trim(),
            CreatedAt = createdAt,
            OrderDate = createdAt,
            Status = createOrderDto.Status.Trim(),
            PaymentStatus = paymentStatus
        };

        foreach (var itemDto in createOrderDto.Items)
        {
            var juice = juiceLookup[itemDto.JuiceId];
            var subtotal = juice.Price * itemDto.Quantity;

            order.OrderItems.Add(new OrderItem
            {
                JuiceId = juice.Id,
                ProductName = juice.Name,
                ImageUrl = juice.ImageUrl,
                Quantity = itemDto.Quantity,
                UnitPrice = juice.Price,
                Subtotal = subtotal
            });
        }

        order.TotalAmount = order.OrderItems.Sum(item => item.Subtotal);

        return order;
    }

    private async Task<Order> LoadOrderAsync(int orderId)
    {
        return await _context.Orders
            .Include(savedOrder => savedOrder.OrderItems)
            .ThenInclude(savedOrderItem => savedOrderItem.Juice)
            .FirstAsync(savedOrder => savedOrder.Id == orderId);
    }

    private static bool TryGetValidStatus(string status, out string validStatus)
    {
        return AllowedStatuses.TryGetValue(status.Trim(), out validStatus!);
    }

    private static OrderDto MapToOrderDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            CustomerName = order.CustomerName,
            CustomerPhone = order.CustomerPhone,
            OrderDate = order.OrderDate,
            CreatedAt = order.CreatedAt,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            PaymentStatus = order.PaymentStatus,
            Items = order.OrderItems
                .Select(orderItem => new OrderItemDto
                {
                    Id = orderItem.Id,
                    JuiceId = orderItem.JuiceId,
                    JuiceName = orderItem.ProductName,
                    ImageUrl = orderItem.ImageUrl,
                    Quantity = orderItem.Quantity,
                    UnitPrice = orderItem.UnitPrice,
                    Subtotal = orderItem.Subtotal
                })
                .ToList()
        };
    }
}
