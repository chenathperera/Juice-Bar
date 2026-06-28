export interface Juice {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  imageFile?: File | null;
  isMostLiked: boolean;
  likeRate?: string | null;
  categoryId: number;
  categoryName: string;
  isAvailable: boolean;
}
