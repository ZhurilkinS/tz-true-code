import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FilterState, Product } from "../types/shemas";
import { getProduct, getProductsWithFilters } from "./productsThunks";

interface ProductState {
  items: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: FilterState;
}

const initialState: ProductState = {
  items: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
  filters: {
    sortBy: "createdAt",
    sortOrder: "DESC",
    minPrice: "",
    maxPrice: "",
    search: "",
  },
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Для getProductsWithFilters
      .addCase(getProductsWithFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductsWithFilters.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items = action.payload.items || [];
          state.pagination = {
            page: state.pagination.page,
            limit: action.payload.limit || state.pagination.limit,
            total: action.payload.total || 0,
            totalPages:
              action.payload.totalPages ||
              Math.ceil((action.payload.total || 0) / state.pagination.limit),
          };
        }
      })
      .addCase(getProductsWithFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentProduct = null;
      })
      .addCase(
        getProduct.fulfilled,
        (state, action: PayloadAction<Product | undefined>) => {
          state.loading = false;
          if (action.payload) {
            state.currentProduct = action.payload;
          } else {
            state.error = "Product not found";
            state.currentProduct = null;
          }
        }
      )
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentProduct = null;
      });
  },
});

export const {
  setCurrentProduct,
  clearError,
  setPage,
  setLimit,
  setFilters,
  resetFilters,
} = productSlice.actions;
export default productSlice.reducer;
