import React from 'react'
import './LoadingScreen.css'

export default function LoadingScreen() {
  return (
    <div className='absolute flex justify-center items-center flex-col inset-0 bg-black opacity-75 z-40'>
        <div className='custom-loader'></div>

        <h1 className='text-lg text-white font-bold mt-4 text-center'>Silahkan Tunggu</h1>
        <p className='text-sm text-white mt-3 text-center'>Pembayaran Anda Sedang Diproses</p>
    </div>
  )
}
