import { configureStore } from '@reduxjs/toolkit'
import sidebarReducer from '../redux/sidebarSlice'
import userSlice from '../redux/userSlice'

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    user: userSlice
  },
})