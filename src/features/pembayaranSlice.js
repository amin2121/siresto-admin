import { createSlice } from '@reduxjs/toolkit'

export const pembayaranSlice = createSlice({
    name: 'pembayaran',
    initialState: {
        metodePembayaran: 'cash',
    },
    reducers: {
        pilihMetodePembayaran: (state, action) => {
            state.metodePembayaran = action.payload.metodePembayaran
        },
    }
})

export const { pilihMetodePembayaran } = pembayaranSlice.actions
export default pembayaranSlice.reducer