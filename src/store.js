import { configureStore, createSlice } from '@reduxjs/toolkit'

const categorySearchSlice = createSlice({
    name: 'categorySearch',
    initialState: { category: '' },
    reducers: {
        categorySearch: (state, action) => {
            state.category = action.payload
        },
    },
})

export const store = configureStore({})