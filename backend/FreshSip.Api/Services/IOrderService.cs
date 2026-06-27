using FreshSip.Api.DTOs;

namespace FreshSip.Api.Services;

public interface IOrderService
{
    Task<IEnumerable<OrderDto>> GetAllAsync();

    Task<OrderDto?> GetByIdAsync(int id);

    Task<OrderDto> CreateAsync(CreateOrderDto createOrderDto);

    Task<OrderDto> CreatePendingPaymentOrderAsync(CreateOrderDto createOrderDto);

    Task<bool> SetStripeSessionIdAsync(int orderId, string sessionId);

    Task<OrderDto?> MarkPaymentAsPaidAsync(string sessionId);

    Task<OrderDto?> UpdateStatusAsync(int id, UpdateOrderStatusDto updateOrderStatusDto);
}
