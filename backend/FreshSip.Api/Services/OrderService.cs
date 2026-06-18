using FreshSip.Api.Data;
using FreshSip.Api.DTOs;
using FreshSip.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FreshSip.Api.Services;

public class OrderService : IOrderService
{
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

        var order = new Order
        {
            CustomerName = createOrderDto.CustomerName.Trim(),
            CustomerPhone = createOrderDto.CustomerPhone.Trim(),
            OrderDate = DateTime.UtcNow,
            Status = createOrderDto.Status.Trim()
        };

        foreach (var itemDto in createOrderDto.Items)
        {
            var juice = juiceLookup[itemDto.JuiceId];
            var subtotal = juice.Price * itemDto.Quantity;

            order.OrderItems.Add(new OrderItem
            {
                JuiceId = juice.Id,
                Quantity = itemDto.Quantity,
                UnitPrice = juice.Price,
                Subtotal = subtotal
            });
        }

        order.TotalAmount = order.OrderItems.Sum(item => item.Subtotal);

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        var createdOrder = await _context.Orders
            .Include(savedOrder => savedOrder.OrderItems)
            .ThenInclude(savedOrderItem => savedOrderItem.Juice)
            .FirstAsync(savedOrder => savedOrder.Id == order.Id);

        return MapToOrderDto(createdOrder);
    }

    private static OrderDto MapToOrderDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            CustomerName = order.CustomerName,
            CustomerPhone = order.CustomerPhone,
            OrderDate = order.OrderDate,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            Items = order.OrderItems
                .Select(orderItem => new OrderItemDto
                {
                    Id = orderItem.Id,
                    JuiceId = orderItem.JuiceId,
                    JuiceName = orderItem.Juice.Name,
                    Quantity = orderItem.Quantity,
                    UnitPrice = orderItem.UnitPrice,
                    Subtotal = orderItem.Subtotal
                })
                .ToList()
        };
    }
}
