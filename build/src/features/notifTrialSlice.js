import { createSlice } from '@reduxjs/toolkit'

export const notifTrialSlice = createSlice({
    name: 'notifTrial',
    initialState: {
        statusNotif: false
    },
    reducers: {
        showNotif: (state, action) => {
            state.statusNotif = !action.statusNotif
        },
    }
})

export const { showNotif } = notifTrialSlice.actions
export default notifTrialSlice.reducer