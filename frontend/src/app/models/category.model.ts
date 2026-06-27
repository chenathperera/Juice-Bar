export interface Category {
  id: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  imageFile?: File | null;
}
