export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number | null;
  article: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductList {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface FilterState {
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  minPrice: number | "";
  maxPrice: number | "";
  search: string;
}

export interface ProductCreateDto {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  article: string;
  image?: File;
}
