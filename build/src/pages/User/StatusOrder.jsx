import React, { useState } from 'react'
import { HiOutlineChevronLeft } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import axios from '../../utils/axios'
import { useQuery } from 'react-query'
import LoadingPage from '../../components/LoadingPage'
import { rupiah, baseUrl } from '../../utils/strings'
import moment from 'moment'

export default function StatusOrder() {
  moment.locale('id');
  const navigate = useNavigate()

  // react query
  const {
    isLoading,
    data,
  } = useQuery(["data-order"], () => fetchData(), {
    staleTime: 15000, 
    refetchInterval: 15000, 
    keepPreviousData: true,
    refetchOnWindowFocus: false
  })

  const fetchData = async () => {
    let queryCode = ''
    let queryGuest = ''
    let codeLocal = localStorage.getItem('code')
    let guest = localStorage.getItem('guest')
    if(codeLocal) {
      queryCode = `?code=${codeLocal}`
      queryGuest = `&guest=${guest}`
    }

    const response = await axios.get(`order/cari-order-transaksi?${queryCode}${queryGuest}`)
    const res = response.data
    const order = res.data

    return order
  }

  const pilihWarnaStatusOrder = (status) => {
    switch(status) {
      case 'open' :
        return 'bg-blue-400'
      break;
      case 'in_progress' :
        return 'bg-yellow-400'
      break;
      case 'served' :
        return 'bg-green-400'
      break;
      case 'closed' :
        return 'bg-red-400'
      break;
    }
  }

  const layoutProduk = (item, index) => (
    <div className="order__products" key={index}>
      <div className="order__item p-3 flex bg-white">
        <img src={baseUrl + item.produk.gambar} alt="Produk Image" className="h-16 w-16 object-cover rounded-lg"/>
        <div className='ml-4 flex-1'>
          <div className="mb-2">
            <h5 className='text-sm font-semibold tracking-wide'>{item.produk.nama_produk}</h5>
            <span className="text-xs text-slate-300">{item.produk.kategori_produk.kategori_produk}</span>
          </div>
          <div className='mb-1 flex justify-between items-center'>
              <span className='inline-block mr-1 text-sm font-semibold text-blue-500'>IDR {rupiah(item.total_harga_jual)}</span>
              <p className='text-sm text-slate-400'>x{item.jumlah_beli}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className='px-4 flex-1 flex flex-col'>
        <div className='flex justify-start items-center'>
          <HiOutlineChevronLeft size="20" className="cursor-pointer" onClick={() => navigate('/')}/>
          <h5 className="font-bold text-lg text-center flex-1">Status Order</h5>
        </div>

        <div className="flex-1 flex flex-col mt-4">
          {
            isLoading
            ? <div className="col-span-2 flex flex-1 justify-center items-center flex-col space-y-3"><LoadingPage /></div> 
            : <div className='order__container w-full space-y-4'>
                <div className={`border border-slate-200 rounded mt-4 rounded-md`}>
                  <h1 className="text-sm text-black font-semibold mb-2 py-2 px-4 bg-slate-100 rounded-t-md">Informasi Order</h1>
                  <div className="py-2 px-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-2">
                        <h1 className="font-semibold">Nama</h1>
                        <p>{data != null ? data[0].nama_customer : ''}</p>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mb-2">
                        <h1 className="font-semibold">No Meja</h1>
                        <p>{data != null ? data[0].meja?.no_meja: ''}</p>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mb-2">
                        <h1 className="font-semibold">Tanggal & Waktu</h1>
                        <p>{moment(data != null ? data[0].created_at : '').format('DD-MM-YYYY HH:MM')}</p>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mb-2">
                        <h1 className="font-semibold">Total Transaksi</h1>
                        <p>IDR {rupiah(data != null ? data.reduce((accumulator, item) => accumulator + (item.nilai_transaksi), 0) : '')}</p>
                    </div>
                  </div>
                </div>
                {data?.map((item, index) => (
                  <div>
                    <div className="order__content">
                        <div>
                            <div className={`order__status text-xs py-2 ${pilihWarnaStatusOrder(item.status_order)} font-semibold px-4 text-white flex justify-between items-center rounded-t-md`}>
                              <span>{item?.no_transaksi}</span>
                              <span>{item?.status_order.replace('_', ' ').toUpperCase()}</span>
                            </div>
                            {item?.order_detail.map((item, index) => (layoutProduk(item, index)))}
                        </div>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>

      </div> 
      
    </>
  )
}
