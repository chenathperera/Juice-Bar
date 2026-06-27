export interface CreateOrderItem {
  juiceId: number;
  quantity: number;
}

export interface CreateOrder {
  customerName: string;
  customerPhone: string;
  status: string;
  items: CreateOrderItem[];
}

export interface CreateCheckoutSessionRequest {
  customerName: string;
  customerPhone: string;
  items: CreateOrderItem[];
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResponse {
  orderId: number;
  sessionId: string;
  sessionUrl: string;
}

export interface OrderItem {
  id: number;
  juiceId: number;
  juiceName: string;
  imageUrl?: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  orderDate: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  items: OrderItem[];
}
