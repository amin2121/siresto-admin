import React from 'react'
import { Button } from '../../components/Button'
import { BsCheckLg } from 'react-icons/bs'
import { useNavigate, useLocation } from 'react-router'
import { rupiah, capitalize } from '../../utils/strings'
import moment from 'moment'

export default function PembayaranBerhasil() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state
    moment.locale('id');

    return (
        <div className='px-4'>
            <div className='payment__status-icon w-12 h-12 rounded-full bg-green-500 flex justify-center items-center mx-auto'>
                <BsCheckLg size={16} className="text-white"/>
            </div>
            <h1 className='payment__status-title font-bold text-xl text-green-700 text-center mt-3 mb-2'>Pembayaran Berhasil</h1>
            <h2 className="payment__status-price text-black font-bold text-3xl text-center">IDR {rupiah(state.subtotal)}</h2>
            <h5 className='font-bold text-md mb-2 mt-8'>Detail Informasi</h5>
            <div className='space-y-2 payment__status-information'>
                <div className="flex justify-between">
                    <span className='font-semibold text-sm text-slate-400'>Metode Pembayaran</span>
                    <span className='font-semibold text-sm text-blue-400'>{capitalize(state.metode_pembayaran)}</span>
                </div>
                <div className="flex justify-between">
                    <span className='font-semibold text-sm text-slate-400'>Status</span>
                    <span className='font-semibold text-sm text-blue-400'>{capitalize(state?.status_order)}</span>
                </div>
                <div className="flex justify-between">
                    <span className='font-semibold text-sm text-slate-400'>Tanggal</span>
                    <span className='font-semibold text-sm text-blue-400'>{moment().format('LL')}</span>
                </div>
                <div className="flex justify-between">
                    <span className='font-semibold text-sm text-slate-400'>Waktu</span>
                    <span className='font-semibold text-sm text-blue-400'>{moment().format('HH:mm')}</span>
                </div>
                <div className='flex justify-between'>
                    <span className='font-semibold text-sm text-slate-400'>Diskon</span>
                    <span className='font-semibold text-sm text-blue-400'>IDR {rupiah(state.diskon)}</span>
                </div>
                {
                    state.pajak !== 0 && 
                    <div className='flex justify-between'>
                        <span className='font-semibold text-sm text-slate-400'>Pajak ({state.pajakPersen}%)</span>
                        <span className='font-semibold text-sm text-blue-400'>IDR {rupiah(state?.pajak)}</span>
                    </div>
                }
                {
                    state.serviceCharge !== 0 && 
                    <div className='flex justify-between'>
                        <span className='font-semibold text-sm text-slate-400'>Service Charge</span>
                        <span className='font-semibold text-sm text-blue-400'>IDR {rupiah(state?.serviceCharge)}</span>
                    </div>
                }
                <div className='flex justify-between text-sm text-slate-400 mt-5'>
                    <span className='font-bold text-lg'>Subtotal</span>
                    <span className='font-bold text-blue-500 text-lg'>IDR {rupiah(state.subtotal)}</span>
                </div>
            </div>
            <div className='w-full px-4 absolute !bottom-14 left-0'>
                <Button type="submit" title="Lihat Order Anda" className="font-bold w-full bg-blue-500 border-0 hover:bg-blue-400" onClick={() => navigate('/status-order')}/>
            </div>
        </div>
    )
}

