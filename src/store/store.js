import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorySlice';
import templateReducer from './slices/templateSlice';
import invitationReducer from './slices/invitationSlice';
import rsvpReducer from './slices/rsvpSlice';
import paymentReducer from './slices/paymentSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        category: categoryReducer,
        template: templateReducer,
        invitation: invitationReducer,
        rsvp: rsvpReducer,
        payment: paymentReducer,
    },
    devTools: import.meta.env.DEV,
});

export default store;
