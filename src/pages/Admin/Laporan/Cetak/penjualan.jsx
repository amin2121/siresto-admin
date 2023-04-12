import React, {useState} from 'react'
import moment from 'moment'
import { rupiah } from '../../../../utils/strings'

export const LaporanPenjualan = React.forwardRef((props, ref) => {
	moment.locale('id')

	let totalPenjualanKotor = 0
	let totalLabaKotor = 0

	return (
		<div className="text-black mt-5 px-4" ref={ref}>
			<h1 className="text-xl text-center font-bold">SiResto</h1>
			<h2 className="text-md text-center font-semibold">Laporan Penjualan</h2>

			<div className="mb-3">
				<span className="text-sm">Tanggal : </span>
				<span className="text-sm">{moment(props.tanggalAwal).format('DD-MM-YYYY')} s/d {moment(props.tanggalAkhir).format('DD-MM-YYYY')}</span>
			</div>

			<table className="w-full text-sm border-collapse border border-slate-400 table-auto">
				<thead>
					<tr className="text-sm font-semibold tracking-wide border-b border-slate-400">
						<th className="px-4 py-3 border border-slate-400">Tanggal</th>
						<th className="px-4 py-3 border border-slate-400">No Transaksi</th>
						<th className="px-4 py-3 border border-slate-400">Nama Kasir</th>
						<th className="px-4 py-3 border border-slate-400">Penjualan Kotor</th>
						<th className="px-4 py-3 border border-slate-400">Laba Kotor</th>
					</tr>
				</thead>
				<tbody>
					{props?.data.map((item, key) => {
						totalPenjualanKotor += item.nilai_transaksi
						totalLabaKotor += item.nilai_laba

						return (
							<tr key={key}>
								<td className="text-center px-4 py-3 border border-slate-400">{moment(item.created_at).format('DD-MM-YYYY')}</td>
								<td className="text-center px-4 py-3 border border-slate-400">{item.no_transaksi}</td>
								<td className="text-center px-4 py-3 border border-slate-400">Kasir</td>
								<td className="text-right px-4 py-3 border border-slate-400">Rp. {rupiah(item.nilai_transaksi)}</td>
								<td className="text-right px-4 py-3 border border-slate-400">Rp. {rupiah(item.nilai_laba)}</td>
							</tr>
						)
					})}
				</tbody>
				<tfoot>
					<tr>
						<th colSpan="3" className="text-right px-4 py-3 border border-slate-400">Total</th>
						<th className="text-right px-4 py-3 border border-slate-400">Rp. {rupiah(totalPenjualanKotor)}</th>
						<th className="text-right px-4 py-3 border border-slate-400">Rp. {rupiah(totalLabaKotor)}</th>
					</tr>
				</tfoot>
			</table>
		</div>
	)

});