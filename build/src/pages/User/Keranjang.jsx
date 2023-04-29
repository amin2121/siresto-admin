import React, { useEffect } from 'react'
import ItemProductHorizontal from '../../components/ItemProductHorizontal'
import KeranjangKosong from '../../layouts/KeranjangKosong'
import { useDispatch, useSelector } from 'react-redux'
import { HiOutlineChevronLeft } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { swNormal } from '../../utils/sw'
import axios from '../../utils/axios'
import { useQuery } from 'react-query'
import { Button } from '../../components/Button'
import { rupiah } from '../../utils/strings'
import { hapusProduk, hapusSemuaProduk } from '../../features/produkSlice'
import { warnaKeranjang } from '../../features/warnaKeranjangSlice'

export default function Keranjang() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const keranjang = useSelector(state => state.produk.produkKeranjang)
  
  // react query
  const {
    data,
  } = useQuery(["data-setting"], () => fetchSetting(), {
    staleTime: 15000, 
    refetchInterval: 60000, 
    keepPreviousData: true,
    refetchOnWindowFocus: false
  })
  
  let subtotal = keranjang !== null && keranjang.reduce((accumulator, item) => accumulator + (item.harga_jual * item.jumlah), 0)
  let serviceCharge = data?.status_charge_service === 1 ? data?.charge_service : 0
  let pajak = data?.status_pajak === 1 ? (data?.pajak * subtotal) / 100 : 0
  let pajakPersen = data?.status_pajak === 1 ? data?.pajak : 0

  let diskon = keranjang !== null && keranjang.reduce((accumulator, item) => accumulator + item.diskon, 0);
  let labaTotal = keranjang !== null && keranjang.reduce((accumulator, item) => accumulator + item.laba, 0) - diskon;
  let totalSemua = subtotal - diskon
  
  labaTotal = labaTotal - diskon
  totalSemua = (+subtotal + +pajak + +serviceCharge) - diskon
  
  const layoutProduk = (item, index) => (
    <ItemProductHorizontal key={index} id={item.id} gambar={item.gambar} judul={item.nama_produk} harga_jual={item.harga_jual} jumlah={item.jumlah} onDelete={() => dispatch(hapusProduk({id: item.id}))}/>
  )

  useEffect(() => {
    dispatch(warnaKeranjang('bg-slate-200'))

    return () => {
      dispatch(warnaKeranjang('bg-white'))
    }
  }, [])

  const fetchSetting = async () => {
    let resto = localStorage.getItem('branch')
    const response = await axios.get(`resto/setting-resto?resto=${resto}`)
    const res = response.data.data

    return res
  }

  const mutation = useMutation(async () => {
    let produk = keranjang
    let code = localStorage.getItem('code')
    let guest = localStorage.getItem('guest')
    let no_transaksi = localStorage.getItem('no_transaksi')

    let dataForm = {
      produk : produk,
      subtotal : totalSemua,
      diskon : diskon,
      code : code,
      code_user : guest,
      no_transaksi : no_transaksi,
      nilai_laba : labaTotal,
      pajak : pajak,
      service_charge : serviceCharge,
    }

    const response = await axios.post('order/simpan-order-konsumen', dataForm)
    const res = response.data

    if(res.meta.code !== 200) {
      throw new Error(res.meta.message)
    }

    return res.data
  }, {
    onMutate: () => {
      // spinner
      // setIsAction(!isAction)
    },
    onSettled: async (data, error) => {
      // setIsAction(!isAction)
      if(data) {
        dispatch(hapusSemuaProduk())
        navigate('/status-order')
      }

      if(error) {
        
      }
    },
    onSuccess: async () => {
      swNormal('Berhasil', 'Order Berhasil Disimpan', 'success')
    },
    onError: async () => {
      swNormal('Gagal', 'Order Gagal Disimpan', 'error')
    }
  })

  const simpanOrder = async () => {
    navigate('/nomor-telepon')
    // () => navigate('/pembayaran', { state: { subtotal: totalSemua, diskon: diskon, total: subtotal, laba: labaTotal, pajak: pajak, serviceCharge: serviceCharge, pajakPersen: pajakPersen } })
    // await mutation.mutate()
  }

  return (
    <>
      <div className='flex justify-start items-center bg-white px-4 py-2'>
        <HiOutlineChevronLeft size="20" className="cursor-pointer" onClick={() => navigate('/')}/>
        <h5 className="font-bold text-md text-center flex-1">Keranjang</h5>
      </div>
      <div className='flex flex-col justify-between flex-1'>
        <div className='w-full mt-4 space-y-3 px-4 overflow-y-auto h-[30rem] scrollbar-hide'>
            {keranjang.length > 0 ? keranjang?.map((item, index) => (layoutProduk(item, index))) : <KeranjangKosong />}
        </div>
        
        {keranjang.length > 0 ? <div className='bg-white w-full px-6 pt-8 pb-8 text-xs fixed lg:w-1/3 rounded-t-[30px] drop-shadow-2xl bottom-0'>
          <div className="flex justify-between mb-2">
            <span className='font-semibold'>Total</span>
            <span className='font-semibold text-blue-400'>IDR {rupiah(subtotal)}</span>
          </div>
          <div className='flex justify-between mb-2'>
            <span className='font-semibold'>Diskon</span>
            <span className='font-semibold text-blue-400'>IDR {rupiah(diskon)}</span>
          </div>
          {
            data?.status_pajak === 1 ?
            <div className='flex justify-between mb-2'>
                <span className='font-bold'>Pajak ({data?.pajak}%)</span>
                <span className='font-bold text-blue-400'>IDR {rupiah(pajak)}</span>
            </div> : ''
          }
          {
            data?.status_charge_service === 1 ?
            <div className='flex justify-between mb-2'>
                <span className='font-bold'>Service Charge</span>
                <span className='font-bold text-blue-400'>IDR {rupiah(serviceCharge)}</span>
            </div> : ''
          }
          <hr className='mt-2 mb-2 bg-slate-400'/>
          <div className='flex justify-between text-sm mb-4'>
            <span className='font-bold'>Subtotal</span>
            <span className='font-bold text-blue-500'>IDR {rupiah(totalSemua)}</span>
          </div>
          <Button title="Pilih Menu Lain" type="button" className="w-full mb-2 bg-white text-blue-500 border-blue-500 border hover:bg-blue-700 hover:border-blue-700 hover:text-white text-xs" onClick={() => navigate('/')}/>
          <Button title="Order Sekarang" type="button" className="w-full bg-blue-500 border-0 hover:bg-blue-700 text-xs" onClick={simpanOrder}/>
        </div> : ''}
      </div>

    </>
  )
}
