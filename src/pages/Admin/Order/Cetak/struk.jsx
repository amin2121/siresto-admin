import React, {useState} from 'react'
import moment from 'moment'
import { rupiah } from '../../../../utils/strings'

export const Struk = React.forwardRef(({ data, subtotal, bayar, kembali, resto, diskon, pajak, statusPajak, statusChargeService, chargeService, totalSemua }, ref) => {
	moment.locale('id')

	return (
		<div className="text-black mt-5 px-4" ref={ref}>
			<h1 className="text-md text-center font-bold">{resto.nama_resto}</h1>
			<h2 className="text-center font-semibold text-[10px]">{resto.alamat_lengkap}</h2>
			<h2 className="text-center font-semibold text-[10px]">{resto.nomor_telepon}</h2>

			<div className="order__information mt-2 mb-4 text-[10px]">
				<p>{moment().format('DD-MM-YYYY')}</p>
				<p>{moment().format('HH:mm:ss')}</p>
			</div>

			<div className="order__list mb-4 text-[10px]">
				{data?.map((obj, key) => (
					<div className="mb-1 order__item">
						<h5>{obj.nama_produk}</h5>
						<div className="flex justify-between">
							<p>{obj.jumlah_produk} X {rupiah(obj.harga_jual)}</p>
							<p>{rupiah(obj.harga_total)}</p>
						</div>
					</div>
				))}
			</div>

			<div className="order__payment text-[10px]">
				<div className="flex justify-between">
                    <p className="font-medium">Subtotal :</p>
                    <p className="font-medium">{rupiah(subtotal)}</p>
                </div>
                <div className="flex justify-between">
                    <p className="font-medium">Diskon :</p>
                    <p className="font-medium">{rupiah(diskon)}</p>
                </div>
                {
                    statusPajak === 1
                    ? <div className="flex justify-between">
                        <p className="font-medium">Pajak :</p>
                        <p className="font-medium">{rupiah(pajak)}</p>
                    </div> : ''
                }
                {
                    statusChargeService === 1
                    ? <div className="flex justify-between">
                        <p className="font-medium">Service Charge :</p>
                        <p className="font-medium">{rupiah(chargeService)}</p>
                    </div> : ''
                }
				<div className="flex justify-between pt-2 border-t border-dashed border-slate-400">
                    <p className="font-bold">Total :</p>
                    <p className="font-bold">{rupiah(totalSemua)}</p>
                </div>
				<div className="flex justify-between">
                    <p className="font-bold">Bayar (Cash) :</p>
                    <p className="font-bold">{rupiah(bayar)}</p>
                </div>
                <div className="flex justify-between">
                    <p className="font-bold">Kembali :</p>
                    <p className="font-bold">{rupiah(kembali)}</p>
                </div>
			</div>

		</div>
	)

});