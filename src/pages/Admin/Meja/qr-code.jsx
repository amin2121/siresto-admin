import React from 'react'
import FileQrCode from './file-qr-code'
import ReactPDF from '@react-pdf/renderer';

// component
import HeaderContent from '../../../layouts/HeaderContent'

// library
import { useNavigate, useLocation } from 'react-router-dom'

export default function QrCodeMeja() {
    const navigate = useNavigate()
    const location = useLocation()
	const data = location.state
    const breadcrumbs = [
		{ link: '/', menu: 'Home' },
		{ link: '/meja', menu: 'Meja' },
		{ link: '/meja/qr-code', menu: 'QR Code Meja' },
	]
    
    return (
        <>
            <HeaderContent linkBack="/meja" title="QR Code Meja" breadcrumbs={breadcrumbs} />
            <div className="bg-blue-50 h-screen mx-6 rounded-lg mt-8">
                <div className='bg-white p-6 rounded-lg text-center'>
                    <FileQrCode resto={data.resto.nama_resto} no_meja={data.no_meja}/>
                </div>
            </div>
            
        </>
    )
}
