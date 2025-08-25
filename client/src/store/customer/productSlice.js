// client/src/store/customer/productSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { getCategories, getProducts, getFeaturedProducts } from "../../services_hooks/customer/productService";

const initialState = {
  items: [],
  categories: [],
  featuredProducts: [],
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
    sort: 'price',
  },
  loading: false,
  featuredLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFeaturedLoading: (state, action) => {
      state.featuredLoading = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    setFeaturedProducts: (state, action) => {
      state.featuredProducts = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFilter,
  resetFilters,
  setLoading,
  setFeaturedLoading,
  setCategories,
  setProducts,
  setFeaturedProducts,
  setError,
} = productSlice.actions;

// ✅ Custom async dispatch function (instead of createAsyncThunk)
export const fetchCategories = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const data = await getCategories();
    dispatch(setCategories(data));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchProducts = (filters) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const data = await getProducts(filters);
    dispatch(setProducts(data));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchFeaturedProducts = (limit = 8) => async (dispatch) => {
  dispatch(setFeaturedLoading(true));
  try {
    const data = await getFeaturedProducts(limit);
    dispatch(setFeaturedProducts(data));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setFeaturedLoading(false));
  }
};

export default productSlice.reducer;
