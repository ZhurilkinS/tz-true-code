import { createAsyncThunk } from "@reduxjs/toolkit";
import productsServices from "../api/productsServices";
import type { ProductQueryParams } from "../types/shemas";
import type { RootState } from "../../../app/store";
import axios from "axios";

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (params: ProductQueryParams, { rejectWithValue }) => {
    try {
      const products = await productsServices.getProducts(params);
      return products;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Ошибка загрузки товаров"
        );
      }
    }
  }
);

export const getProductsWithFilters = createAsyncThunk(
  "products/getProductsWithFilters",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { pagination, filters } = state.products;

      const params: ProductQueryParams = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      if (filters.minPrice) params.minPrice = Number(filters.minPrice);
      if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);
      if (filters.search) params.search = filters.search;

      const products = await productsServices.getProducts(params);
      return products;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Ошибка загрузки товаров"
        );
      }
    }
  }
);

export const getProduct = createAsyncThunk(
  "products/getProduct",
  async (id: number, { rejectWithValue }) => {
    try {
      const product = await productsServices.getProduct(id);

      return product;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Ошибка загрузки товара"
        );
      }
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (data: FormData, { rejectWithValue }) => {
    try {
      const product = await productsServices.createProduct(data);
      return product;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Ошибка создания товара"
        );
      }
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }: { id: number; data: FormData }, { rejectWithValue }) => {
    try {
      const updatedProduct = await productsServices.updateProduct(id, data);
      return updatedProduct;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Ошибка обновления товара"
        );
      }
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: number, { rejectWithValue }) => {
    try {
      await productsServices.deleteProduct(id);
      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Ошибка удаления товара"
        );
      }
    }
  }
);
