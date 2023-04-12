import { createSlice } from '@reduxjs/toolkit'

export const warnaKeranjangSlice = createSlice({
    name: 'warnaKeranjang',
    initialState: {
        warna: 'bg-white',
    },
    reducers: {
        warnaKeranjang: (state, action) => {
            state.warna = action.payload
        },
    }
})

export const { warnaKeranjang } = warnaKeranjangSlice.actions
export default warnaKeranjangSlice.reducer