import { createSlice } from '@reduxjs/toolkit'

export const loginSlice = createSlice({
    name: 'login',
    initialState: {
        token: '',
        level: '',
    },
    reducers: {
        setDataLogin: (state, action) => {
            // console.log(action.payload)
            state.token = action.payload.token
            state.level = action.payload.level
        },
    }
})

export const { setDataLogin } = loginSlice.actions
export default loginSlice.reducer