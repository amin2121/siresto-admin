import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'

export default function KeranjangKosong() {
    const navigate = useNavigate()
    
    return (
        <div className='text-center mt-16'>
            <div className='h-20 w-20 mx-auto bg-slate-300 rounded-full mb-6'></div>
            <p className='mb-4 text-lg font-bold'>Keranjang kosong</p>
            <p className='mb-4 text-sm text-slate-400'>Silahkan pilih menu <br/> makanan & minuman terlebih dahulu</p>
            <Button title="Kembali Ke Home" className="bg-blue-500 hover:bg-blue-700 border-0" onClick={() => navigate('/')}/>
        </div>
    )
}
