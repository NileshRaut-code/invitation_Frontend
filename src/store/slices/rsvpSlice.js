import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    rsvps: [],
    stats: null,
    isLoading: false,
    error: null,
};

const rsvpSlice = createSlice({
    name: 'rsvp',
    initialState,
    reducers: {
        setRSVPs: (state, action) => {
            state.rsvps = action.payload.rsvps;
            state.stats = action.payload.stats;
            state.isLoading = false;
        },
        addRSVP: (state, action) => {
            state.rsvps.unshift(action.payload);
        },
        setRSVPLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setRSVPError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        clearRSVPs: (state) => {
            state.rsvps = [];
            state.stats = null;
        },
    },
});

export const {
    setRSVPs,
    addRSVP,
    setRSVPLoading,
    setRSVPError,
    clearRSVPs,
} = rsvpSlice.actions;

export default rsvpSlice.reducer;
