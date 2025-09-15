import axiosInstance from "../../../shared/api/axiosInstance";
import type { Product, ProductList, ProductQueryParams } from "../types/shemas";

const productsServices = {
  getProducts: async (
    params: ProductQueryParams = {}
  ): Promise<ProductList> => {
    try {
      const response = await axiosInstance.get("/products", { params });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      throw error;
    }
  },

  getProduct: async (id: number): Promise<Product> => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      throw error;
    }
  },

  createProduct: async (data: FormData): Promise<Product> => {
    try {
      const response = await axiosInstance.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      throw error;
    }
  },

  updateProduct: async (id: number, data: FormData): Promise<Product> => {
    try {
      const response = await axiosInstance.patch(`/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      throw error;
    }
  },

  deleteProduct: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/products/${id}`);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      throw error;
    }
  },
};

export default productsServices;
