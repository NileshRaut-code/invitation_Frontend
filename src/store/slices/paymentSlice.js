import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    payments: [],
    currentOrder: null,
    isLoading: false,
    error: null,
};

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        setPayments: (state, action) => {
            state.payments = action.payload;
            state.isLoading = false;
        },
        setCurrentOrder: (state, action) => {
            state.currentOrder = action.payload;
        },
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
        setPaymentLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setPaymentError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
});

export const {
    setPayments,
    setCurrentOrder,
    clearCurrentOrder,
    setPaymentLoading,
    setPaymentError,
} = paymentSlice.actions;

export default paymentSlice.reducer;
