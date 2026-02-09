import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    templates: [],
    currentTemplate: null,
    isLoading: false,
    error: null,
};

const templateSlice = createSlice({
    name: 'template',
    initialState,
    reducers: {
        setTemplates: (state, action) => {
            state.templates = action.payload;
            state.isLoading = false;
        },
        setCurrentTemplate: (state, action) => {
            state.currentTemplate = action.payload;
        },
        addTemplate: (state, action) => {
            state.templates.push(action.payload);
        },
        updateTemplate: (state, action) => {
            const index = state.templates.findIndex(t => t._id === action.payload._id);
            if (index !== -1) {
                state.templates[index] = action.payload;
            }
        },
        removeTemplate: (state, action) => {
            state.templates = state.templates.filter(t => t._id !== action.payload);
        },
        setTemplateLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setTemplateError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
});

export const {
    setTemplates,
    setCurrentTemplate,
    addTemplate,
    updateTemplate,
    removeTemplate,
    setTemplateLoading,
    setTemplateError,
} = templateSlice.actions;

export default templateSlice.reducer;
