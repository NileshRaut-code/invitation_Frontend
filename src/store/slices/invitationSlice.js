import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    invitations: [],
    currentInvitation: null,
    isLoading: false,
    error: null,
};

const invitationSlice = createSlice({
    name: 'invitation',
    initialState,
    reducers: {
        setInvitations: (state, action) => {
            state.invitations = action.payload;
            state.isLoading = false;
        },
        setCurrentInvitation: (state, action) => {
            state.currentInvitation = action.payload;
        },
        addInvitation: (state, action) => {
            state.invitations.unshift(action.payload);
        },
        updateInvitation: (state, action) => {
            const index = state.invitations.findIndex(i => i._id === action.payload._id);
            if (index !== -1) {
                state.invitations[index] = action.payload;
            }
        },
        removeInvitation: (state, action) => {
            state.invitations = state.invitations.filter(i => i._id !== action.payload);
        },
        setInvitationLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setInvitationError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
});

export const {
    setInvitations,
    setCurrentInvitation,
    addInvitation,
    updateInvitation,
    removeInvitation,
    setInvitationLoading,
    setInvitationError,
} = invitationSlice.actions;

export default invitationSlice.reducer;
