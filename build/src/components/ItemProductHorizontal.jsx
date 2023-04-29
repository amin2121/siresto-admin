import React from 'react'
import { baseUrl, rupiah } from '../utils/strings'
import { useDispatch } from 'react-redux'
import { tambahJumlahBeliProduk, kurangJumlahBeliProduk } from '../features/produkSlice'
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import { TiTimes } from 'react-icons/ti'

export default function ItemProductHorizontal({id, gambar, judul, harga_jual, jumlah, onDelete}) {
  const dispatch = useDispatch()
  let total_harga = jumlah * harga_jual

  return (
    <>
      <div className='p-3 rounded-lg flex shadow-md bg-white shadow-slate-200' key={id}>
          <input type="hidden" value={id}/>
          <img src={baseUrl + gambar} alt="Produk" className="h-16 w-16 object-cover rounded-lg"/>
          <div className='ml-4 flex justify-between flex-1'>
              <div>
                <h5 className='text-sm font-semibold tracking-wide'>{judul}</h5>
                <div className='flex-1 mb-1'>
                    <span className='inline-block mr-1 text-xs font-semibold text-blue-400'>IDR {rupiah(harga_jual)}</span>
                </div>
                <div className='space-x-3 flex flex-1'>
                  <button className="w-6 h-6 flex justify-center items-center rounded-md border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white duration-200" onClick={() => dispatch(kurangJumlahBeliProduk({id}))}><AiOutlineMinus size={12}/></button>
                  <p className='font-bold'>{jumlah}</p>
                  <button className="w-6 h-6 flex justify-center items-center rounded-md border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white duration-200" onClick={() => dispatch(tambahJumlahBeliProduk({id}))}><AiOutlinePlus size={12}/></button>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between items-end">
                <button className="rounded-full w-6 h-6 bg-slate-50 text-slate-800 flex justify-center items-center hover:bg-red-400 hover:text-white duration-200" onClick={onDelete}><TiTimes size={14}/></button>
                <p className="font-bold text-sm block text-blue-500">IDR {rupiah(total_harga)}</p>
              </div>
          </div>
      </div>
    </>
  )
}
