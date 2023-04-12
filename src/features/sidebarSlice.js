import { createSlice } from '@reduxjs/toolkit'

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: {
        open: false,
    },
    reducers: {
        openSidebar: (state, action) => {
            state.open = !state.open
            console.log(state.open)
        },
    }
})

export const { openSidebar } = sidebarSlice.actions
export default sidebarSlice.reducer