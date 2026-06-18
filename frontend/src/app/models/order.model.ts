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

export interface OrderItem {
  id: number;
  juiceId: number;
  juiceName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}
