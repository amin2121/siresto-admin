import React from 'react'
import { capitalize } from '../utils/strings'

// libraries
import axios from '../utils/axios'
import { useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { cariKategoriProduk } from '../features/produkSlice'

export default function CategoryProduct() {
    const { kategoriProduk } = useSelector(state => state.produk)
    const dispatch = useDispatch()

    // react query
	const {
		data,
	} = useQuery(["data-kategori-produk"], () => fetchData(), {
		staleTime: 15000, 
		refetchInterval: 15000, 
		keepPreviousData: true,
		refetchOnWindowFocus: false
	})

    const fetchData = async () => {
    	const branch = localStorage.getItem('branch')
        const response = await axios.get(`kategori-produk/menu?resto=${branch}`)
		const res = await response.data
		const data = res.data
		
		return data
    }

    return (
        <>
            <div className='mt-4 transition duration-150 ease-in-out overflow-x-hidden hover:overflow-x-scroll h-14 px-3'>
            	<div className='whitespace-nowrap space-x-3'>
	                <button className={`btn btn-sm py-2 px-6 rounded-lg h-auto text-xs capitalize btn-secondary ${kategoriProduk === 'Semua' ? 'btn-active' : 'btn-outline border-slate-300 text-slate-300'}`} onClick={() => dispatch(cariKategoriProduk({id: 0, kategori_produk: 'Semua'}))}>Semua</button>
	                {data?.map((obj, key) => (
	                    <button key={key} className={`btn btn-sm py-2 px-6 rounded-lg h-auto text-xs capitalize btn-secondary ${kategoriProduk === obj.kategori_produk ? 'btn-active' : 'btn-outline border-slate-300 text-slate-300'}`} onClick={() => dispatch(cariKategoriProduk(obj))}>{capitalize(obj.kategori_produk)}</button>
	                ))}
            	</div>
            </div>
        </>
    )
}
