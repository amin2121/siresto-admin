import React from 'react'
import CategoryProduct from '../../components/CategoryProduct'
import { SearchProduct } from '../../components/Input'
import LoadingPage from '../../components/LoadingPage'

// libraries
import axios from '../../utils/axios'
import { useQuery } from 'react-query'
import ItemProduct from '../../components/ItemProduct'
import { useDispatch, useSelector } from 'react-redux'
import { toastDark } from '../../utils/toast'
import { cariProduk, tambahJumlahBeliProduk, tambahProduk } from '../../features/produkSlice'

export default function Home() {
  const {idKategori, kategoriProduk, keyword, produkKeranjang} = useSelector(state => state.produk)
  const noTelepon = localStorage.getItem('noTelepon') == 'null' ? 'Kosong' : localStorage.getItem('noTelepon')
  const namaPelanggan = localStorage.getItem('namaPelanggan') == 'null' ? 'Kosong' : localStorage.getItem('namaPelanggan')
  const dispatch = useDispatch()

  // react query
	const {
		isLoading,
		data,
	} = useQuery(["data-produk", kategoriProduk, keyword], () => fetchData(), {
		staleTime: 15000, 
		refetchInterval: 15000, 
		keepPreviousData: true,
		refetchOnWindowFocus: false
	})

  const layoutProduk = (item, index) => (
    <ItemProduct key={index} gambar={item.gambar} judul={item.nama_produk} harga_jual={item.harga_jual} clickAction={() => tambahProdukKeranjang(item)}/>
  )

  const fetchData = async () => {
    let branch = localStorage.getItem('branch')
    const response = await axios.get(`produk/produk-home?sort=DESC&id_kategori=${idKategori}&s=${keyword}&resto=${branch}`)
    const res = response.data
    const produk = res.data.data
    
    return produk
  }

  const tambahProdukKeranjang = (item) => {
    let dataProdukKeranjang = produkKeranjang || []
    
    toastDark(`${item.nama_produk} Sudah Ditambahkan ke Keranjang`)
    if(dataProdukKeranjang.length > 0) {
      let cariDataProduk = dataProdukKeranjang.find(({id}) => id === item.id)
      if(cariDataProduk) {
        dispatch(tambahJumlahBeliProduk({id: item.id}))
      } else {
        dispatch(tambahProduk(item))
      }
    } else {
      dispatch(tambahProduk(item))
    }
  }

  const handleCariProduk = (e) => {
    dispatch(cariProduk({keyword: e.target.value}))
  }

  return (
    <>
      <div className='px-4 flex flex-col flex-1'>
        <SearchProduct placeholder='Search a good' onChange={handleCariProduk}/>
        <CategoryProduct />
        {
          isLoading
          ? <div className="col-span-2 flex flex-1 justify-center items-center flex-col space-y-3"><LoadingPage /></div> 
          : <div className='container-produk grid grid-cols-2 gap-4 mt-2'>{data?.map((item, index) => (layoutProduk(item, index)))}</div>
        }

        <div className="mt-10 text-center">{noTelepon} - {namaPelanggan}</div>
      </div>
    </>
  )
}