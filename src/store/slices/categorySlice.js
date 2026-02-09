import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    categories: [],
    currentCategory: null,
    isLoading: false,
    error: null,
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
            state.isLoading = false;
        },
        setCurrentCategory: (state, action) => {
            state.currentCategory = action.payload;
        },
        addCategory: (state, action) => {
            state.categories.push(action.payload);
        },
        updateCategory: (state, action) => {
            const index = state.categories.findIndex(c => c._id === action.payload._id);
            if (index !== -1) {
                state.categories[index] = action.payload;
            }
        },
        removeCategory: (state, action) => {
            state.categories = state.categories.filter(c => c._id !== action.payload);
        },
        setCategoryLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setCategoryError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
});

export const {
    setCategories,
    setCurrentCategory,
    addCategory,
    updateCategory,
    removeCategory,
    setCategoryLoading,
    setCategoryError,
} = categorySlice.actions;

export default categorySlice.reducer;
