import { createSlice } from '@reduxjs/toolkit'
import React, {useRef} from 'react'

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