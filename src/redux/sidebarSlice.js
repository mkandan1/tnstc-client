import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false, // Sidebar is initially closed
};

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen; // Toggle sidebar state
    },
    openSidebar: (state) => {
      state.isOpen = true; // Open sidebar
    },
    closeSidebar: (state) => {
      state.isOpen = false; // Close sidebar
    },
  },
});

// Export actions
export const { toggleSidebar, openSidebar, closeSidebar } = sidebarSlice.actions;

// Export reducer
export default sidebarSlice.reducer;
