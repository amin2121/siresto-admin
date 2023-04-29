import { createSlice } from '@reduxjs/toolkit'

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: {
        open: true,
    },
    reducers: {
        openSidebar: (state, action) => {
            state.open = !state.open
        },
    }
})

export const { openSidebar } = sidebarSlice.actions
export default sidebarSlice.reducer