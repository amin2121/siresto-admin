import { createSlice } from '@reduxjs/toolkit'

const produkKeranjang = JSON.parse(localStorage.getItem('produkKeranjang')) || []

export const produkSlice = createSlice({
    name: 'produk',
    initialState: {
        keyword: '',
        idKategori: 0,
        kategoriProduk: 'Semua',
        produkKeranjang: [...produkKeranjang]
    },
    reducers: {
        cariProduk: (state, action) => {
            state.keyword = action.payload.keyword
        },
        cariKategoriProduk: (state, action) => {
            state.idKategori = action.payload.id
            state.kategoriProduk = action.payload.kategori_produk
        },
        tambahProduk: (state, action) => {
            let item = action.payload
            state.produkKeranjang.push({id: item.id, gambar: item.gambar, nama_produk: item.nama_produk, harga_jual: item.harga_jual, jumlah: 1, diskon: item.diskon, laba: item.harga_jual - item.harga_awal})
            localStorage.setItem('produkKeranjang', JSON.stringify(state.produkKeranjang))
        },
        tambahJumlahBeliProduk: (state, action) => {
            let indexProduk = state.produkKeranjang.findIndex(obj => obj.id === action.payload.id)
            state.produkKeranjang[indexProduk].jumlah += 1
            localStorage.setItem('produkKeranjang', JSON.stringify(state.produkKeranjang))
        },
        kurangJumlahBeliProduk: (state, action) => {
            let indexProduk = state.produkKeranjang.findIndex(obj => obj.id === action.payload.id)

            if(state.produkKeranjang[indexProduk].jumlah > 1) {
                state.produkKeranjang[indexProduk].jumlah -= 1
                localStorage.setItem('produkKeranjang', JSON.stringify(state.produkKeranjang))
            }
        },
        hapusProduk: (state, action) => {
            let dataBaru = state.produkKeranjang.filter(({id}) => id !== action.payload.id)
            localStorage.setItem('produkKeranjang', JSON.stringify(dataBaru))
            state.produkKeranjang = dataBaru
        },
        hapusSemuaProduk: (state, action) => {
            let dataBaru = []
            localStorage.setItem('produkKeranjang', JSON.stringify(dataBaru))
            state.produkKeranjang = dataBaru
        }
    }
})

export const { cariProduk, cariKategoriProduk, tambahJumlahBeliProduk, kurangJumlahBeliProduk, hapusProduk, tambahProduk, hapusSemuaProduk } = produkSlice.actions
export default produkSlice.reducer