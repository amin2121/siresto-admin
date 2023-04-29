import React from 'react'
import QRCode from 'react-qr-code'
import Logo from '../../../../assets/images/logo/SiResto.png'

export const QrCode = React.forwardRef(({ noTelp, alamat, noMeja, slug }, ref) => {
    return (
        <div className="text-black mt-5 px-4" ref={ref}>
            <div className="text-center text-[10px]">
                <div className="flex justify-center items-center">
                    <img src={Logo} alt={Logo} className="w-14 h-14"/>
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
                    <QRCode size={120} value={process.env.REACT_APP_SIRESTO_MENU_DOMAIN + `home?source=qrcode&branch=${slug}&meja=${noMeja}`}/>
                </div>
                <div>
                    <p className="text-[8px]">Scan QR Code dengan Smartphone anda, setelah itu
                    akses link dari hasil QR Code Tersebut</p>
                </div>
            </div>
        </div>
    )
})