// Location: client/src/store/customer/productSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCategories, getProducts } from '../../services_hooks/customer/productService';

export const fetchCategories = createAsyncThunk('product/fetchCategories', async () => {
  const res = await getCategories();
  return res.data;
});

export const fetchProducts = createAsyncThunk('product/fetchProducts', async (filters) => {
  const res = await getProducts(filters);
  return res.data;
});

const productSlice = createSlice({
  name: 'product',
  initialState: {
    items: [],
    categories: [],
    filters: {
      page: 1,
      limit: 12,
      category: null,
      minPrice: 0,
      maxPrice: 0,
      brand: '',
      inStock: false,
      featured: false,
      onSale: false,
      minRating: 0,
      sort: 'price'
    },
    loading: false,
    error: null
  },
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 12,
        category: null,
        minPrice: 0,
        maxPrice: 0,
        brand: '',
        inStock: false,
        featured: false,
        onSale: false,
        minRating: 0,
        sort: 'price'
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.loading = false; state.categories = action.payload; })
      .addCase(fetchCategories.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  }
});

export const { setFilter, resetFilters } = productSlice.actions;
export default productSlice.reducer;
