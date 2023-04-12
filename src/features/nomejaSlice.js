import { createSlice } from '@reduxjs/toolkit'

export const nomejaSlice = createSlice({
    name: 'nomeja',
    initialState: {
        no_meja: 0,
    },
    reducers: {
        settingNoMeja: (state, action) => {
            state.no_meja = action.payload
        },
    }
})

export const { settingNoMeja } = nomejaSlice.actions
export default nomejaSlice.reducer