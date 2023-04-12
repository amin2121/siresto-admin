import { configureStore } from '@reduxjs/toolkit'
import produkReducer from '../features/produkSlice'
import sidebarReducer from '../features/sidebarSlice'
import pembayaranReducer from '../features/pembayaranSlice'
import nomejaReducer from '../features/nomejaSlice'
import warnaKeranjangReducer from '../features/warnaKeranjangSlice'
import loginReducer from '../features/loginSlice'
import notifTrialReducer from '../features/notifTrialSlice'

export const store = configureStore({
    reducer: {
        produk: produkReducer,
        sidebar: sidebarReducer,
        pembayaran: pembayaranReducer,
        nomeja: nomejaReducer,
        warnaKeranjang: warnaKeranjangReducer,
        login: loginReducer,
        notifTrial: notifTrialReducer
    }
})

