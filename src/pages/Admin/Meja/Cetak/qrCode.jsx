import React, { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { useLocation } from 'react-router-dom'
import { baseUrlFrontEnd } from '../../../../utils/strings'

export const QrCode = React.forwardRef(({ uuid, guest, resto, noTelp, alamat, noMeja }, ref) => {
    // let { search } = useLocation()

    // const query = new URLSearchParams(search)
    // const uuid = query.get('code')
    // const resto = query.get('_r')
    // const noMeja = query.get('_n')

    return (
        <div className="text-black mt-5 px-4" ref={ref}>
            <div className="text-center text-[10px]">
                <div className="flex justify-center items-center">
                    {/*<img src={Logo} alt={Logo} className="w-14 h-14"/>*/}
                </div>
                <div className="font-medium mt-4 mb-4">
                    <p>No Telepon : {noTelp}</p>
                    <p>{alamat}</p>
                </div>
                <div className="mb-4">
                    <p>SELF ORDERING</p>
                    <p>No Meja : {noMeja}</p>
                </div>
                <div className="flex justify-center items-center mb-4">
                    <QRCode size={120} value={baseUrlFrontEnd + `home/${uuid}/${guest}`}/>
                </div>
                <div>
                    <p className="text-[8px]">Scan QR Code dengan Smartphone anda, setelah itu
                    akses link dari hasil QR Code Tersebut</p>
                </div>
            </div>
        </div>
    )
})