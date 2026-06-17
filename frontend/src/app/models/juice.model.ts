export interface Juice {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  categoryId: number;
  category: string;
  isAvailable: boolean;
}
