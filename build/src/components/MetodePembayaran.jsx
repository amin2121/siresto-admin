import React from 'react';
import { BsCashCoin, BsCreditCard2Front } from 'react-icons/bs'
import { BiTransfer } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { pilihMetodePembayaran } from '../features/pembayaranSlice';

const MetodePembayaran = () => {
    const dispatch = useDispatch()
    const { metodePembayaran } = useSelector(state => state.pembayaran)

    const ubahMetodePembayaran = (val) => {
        dispatch(pilihMetodePembayaran({metodePembayaran : val}))
    }

    return (
        <div className='grid grid-cols-3 gap-6'>
            <div className={`py-4 px-2 bg-slate-200 rounded-lg flex items-center flex-col justify-center cursor-pointer ${metodePembayaran === 'cash' ? '!bg-blue-500 text-white' : ''}`} onClick={() => ubahMetodePembayaran('cash')}>
                <BsCashCoin size="20" />
                <h5 className='mt-2 text-sm font-semibold'>Cash</h5>
            </div>
            <div className={`py-4 px-2 bg-slate-200 rounded-lg flex items-center flex-col justify-center cursor-pointer ${metodePembayaran === 'transfer' ? '!bg-blue-500 text-white' : ''}`} onClick={() => ubahMetodePembayaran('transfer')}>
                <BiTransfer size="20" />
                <h5 className='mt-2 text-sm font-semibold'>Transfer</h5>
            </div>
            <div className={`py-4 px-2 bg-slate-200 rounded-lg flex items-center flex-col justify-center cursor-pointer ${metodePembayaran === 'edc' ? '!bg-blue-500 text-white' : ''}`} onClick={() => ubahMetodePembayaran('edc')}>
                <BsCreditCard2Front size="20" />
                <h5 className='mt-2 text-sm font-semibold'>EDC</h5>
            </div>
        </div>
    );
}

export default MetodePembayaran;
