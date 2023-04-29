import React, {useState} from 'react'
import MetodePembayaran from '../../components/MetodePembayaran'
import { Button } from '../../components/Button' 
import { MessageError } from '../../components/Input'
import { InputUserRupiah, InputUser } from '../../components/InputUser'
import { useLocation, useNavigate } from 'react-router-dom'
import { rupiah, rupiahToNumber } from '../../utils/strings'
import { useSelector } from 'react-redux'
import { useForm } from "react-hook-form";
import { useMutation } from 'react-query'
import { HiOutlineChevronLeft } from 'react-icons/hi'
import axios from '../../utils/axios'
import LoadingScreen from '../../components/LoadingScreen'

export default function Pembayaran() {
  const namaPelanggan = localStorage.getItem('nama-pelanggan')
  const location = useLocation()
  const navigate = useNavigate()
	const state = location.state
  const [isLoading, setLoading] = useState(false)
  const { metodePembayaran } = useSelector(state => state.pembayaran)

	const { handleSubmit, formState: { errors }, reset, clearErrors, control, setValue } = useForm();

  const hitungKembalian = () => {
    let jumlah_bayar = document.getElementById('input-jumlah-bayar')
    let kembalian = rupiahToNumber(jumlah_bayar.value) - state.subtotal

    setValue("kembalian", kembalian)
  }

  const mutation = useMutation(async (data) => {
    const produkKeranjang = JSON.parse(localStorage.getItem('produkKeranjang'))
    const guest = localStorage.getItem('guest')
    const code = localStorage.getItem('code')

    if(namaPelanggan === null || namaPelanggan === undefined) {
      localStorage.setItem('nama-pelanggan', data.nama_customer)
    }

    if(data.nama_customer === null || data.nama_customer === undefined) {
      data.nama_customer = namaPelanggan
    }

    data.nilai_transaksi = state.subtotal
    data.nilai_laba = state.laba
    data.diskon = state.diskon
    data.code_user = guest
    data.jumlah_bayar = rupiahToNumber(data.jumlah_bayar)
    data.kembalian = data.kembalian
    data.produk = produkKeranjang
    data.metode_pembayaran = metodePembayaran
    data.pajak = state.pajak
    data.service_charge = state.serviceCharge
    data.code = code

		const response = await axios.post('pembayaran', data)
		const res = response.data

		if(res.meta.code !== 200) {
			throw new Error(res.meta.message)
		}

		return res.data
	}, {
		onMutate: () => {
			// spinner
			setLoading(!isLoading)
		},
		onSettled: async (data, error) => {
			setLoading(!isLoading)
			
      if(data) {
        localStorage.removeItem('produkKeranjang')
				reset()
				clearErrors()
			}

			if(error) {
			}
		},
		onSuccess: async (data) => {
      let sendState = { 
        subtotal: state.subtotal, 
        diskon: state.diskon,
        nama_customer: data.nama_customer,
        metode_pembayaran: metodePembayaran, 
        jumlah_bayar: data.nilai_transaksi, 
        kembalian: data.kembali, 
        pajak: state.pajak,
        pajakPersen: state.pajakPersen,
        serviceCharge: state.serviceCharge, 
        status_order: data.status_order
      }

			navigate('/pembayaran-berhasil', { state : sendState })
		},
		onError: async () => {
		}
	})

  const aksiPembayaran = async (submitData) => {
    await mutation.mutate(submitData)
  }

  return (
    <>
      {isLoading ? <LoadingScreen/> : ''}
      <div className='px-4'>
        <div className='flex justify-start items-center bg-white px-4 py-4'>
          <HiOutlineChevronLeft size="20" className="cursor-pointer" onClick={() => navigate('/keranjang')}/>
          <h5 className="font-bold text-lg text-center flex-1">Pembayaran</h5>
        </div>
        <div className='mt-4'>
          <h5 className='text-sm font-bold mb-2'>Pembayaran Detail :</h5>
          <div className='space-y-2'>
            <div className="flex justify-between">
              <span className='font-semibold text-xs'>Total</span>
              <span className='font-semibold text-xs text-blue-400'>IDR {rupiah(state.total)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-semibold text-xs'>Diskon</span>
              <span className='font-semibold text-xs text-blue-400'>IDR {rupiah(state.diskon)}</span>
            </div>
            {
              state.pajak !== 0 &&
              <div className='flex justify-between'>
                  <span className='font-bold text-xs'>Pajak ({state.pajakPersen}%)</span>
                  <span className='font-bold text-xs text-blue-400'>IDR {rupiah(state.pajak)}</span>
              </div>
            }
            {
              state.serviceCharge !== 0 && 
                <div className='flex justify-between'>
                    <span className='font-bold text-xs'>Service Charge</span>
                    <span className='font-bold text-xs text-blue-400'>IDR {rupiah(state.serviceCharge)}</span>
                </div>
            }
            <div className='flex justify-between text-sm'>
              <span className='font-bold'>Subtotal</span>
              <span className='font-bold text-blue-500 text-lg'>IDR {rupiah(state.subtotal)}</span>
            </div>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit(aksiPembayaran)} className="space-y-2 mt-3">
            {
              namaPelanggan !== null || namaPelanggan !== undefined 
              && <div>
                <InputUser title="Nama Customer" control={control} name="nama_customer" rules={{ required: true }} id="input-nama-customer" error={errors.nama_customer ? true : false}/>
              {errors?.nama_customer && <MessageError>Customer Tidak Boleh Kosong</MessageError>}
              </div>
            }

            <div>
              <h5 className='text-xs font-bold mb-2'>Metode Pembayaran :</h5>
              <MetodePembayaran />
            </div>
            <div>
              <InputUserRupiah title="Jumlah Bayar" control={control} name="jumlah_bayar" rules={{ required: true }} onChange={hitungKembalian} id="input-jumlah-bayar" error={errors.jumlah_bayar ? true : false}/>
              {errors?.jumlah_bayar && <MessageError>Jumlah Bayar Tidak Boleh Kosong</MessageError>}
            </div>

            <div>
              <InputUserRupiah title="Kembalian" control={control} name="kembalian" rules={{ required: true }} id="input-kembalian" error={errors.kembalian ? true : false}/>
              {errors?.kembalian && <MessageError>Kembalian Tidak Boleh Kosong</MessageError>}
            </div>

            <div className='w-full px-4 absolute bottom-3 left-0'>
              <Button type="submit" title="Bayar Sekarang" className="w-full bg-blue-500 border-0 hover:bg-blue-400 mb-2"/>
            </div>
          </form>

        </div>
      </div>
    </>
  )
}
