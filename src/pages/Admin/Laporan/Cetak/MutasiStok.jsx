import React, {useState} from 'react'
import moment from 'moment'
import { rupiah } from '../../../../utils/strings'
import { Button } from "../../../../components/Button";
import LoadingPage from "../../../../components/LoadingPage";

export const LaporanMutasiStok = React.forwardRef((props, ref) => {
	moment.locale('id')
  const [isShowModalRekapDetail, setIsShowModalRekapDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

	let totalMutasi = 0;

	return (
		<div className="text-black mt-5 px-4 mb-5" ref={ref}>
			<h1 className="text-xl text-center font-bold mt-5">Bathiku</h1>
			<h2 className="text-md text-center font-semibold mb-4">Laporan Mutasi Stok</h2>

			<div className="mb-3 flex justify-between">
				<span className="text-sm">Tanggal : {moment(props.tanggalAwal).format('DD-MM-YYYY')} s/d {moment(props.tanggalAkhir).format('DD-MM-YYYY')}</span>
			</div>

			{props.isAction ? (
				<LoadingPage/>
			) : (
				<table className="w-full text-sm border-collapse border border-slate-400 table-auto mb-5">
					<thead>
						<tr className="text-sm font-semibold tracking-wide border-b border-slate-400">
							<th className="px-4 py-3 border border-slate-400">Tanggal</th>
							<th className="px-4 py-3 border border-slate-400">Produk</th>
							<th className="px-4 py-3 border border-slate-400">Jumlah Stok</th>
							<th className="px-4 py-3 border border-slate-400">Nama Supplier</th>
							<th className="px-4 py-3 border border-slate-400">Tipe Stok</th>
							<th className="px-4 py-3 border border-slate-400">Nama Pegawai</th>
						</tr>
					</thead>
					<tbody>
						{props?.data.map((item, key) => {
							totalMutasi += item.jumlah_stok

							return (
								<tr key={key}>
									<td className="text-center px-4 py-3 border border-slate-400">{moment(item.created_at).format('DD-MM-YYYY') + ' ' + moment(item.created_at, 'H:mm:ss').format('H:mm:ss')}</td>
									<td className="text-center px-4 py-3 border border-slate-400">{item.produk.nama_produk ?? '-'}</td>
									<td className="text-center px-4 py-3 border border-slate-400">{item.jumlah_stok ?? '-'}</td>
									<td className="text-center px-4 py-3 border border-slate-400">{item.nama_supplier ?? '-'}</td>
									<td className="text-center px-4 py-3 border border-slate-400">Stok Masuk</td>
									<td className="text-center px-4 py-3 border border-slate-400">{item.name ?? '-'}</td>
								</tr>
							)
						})}
					</tbody>
					<tfoot>
						<tr>
							<th colSpan="2" className="text-right px-4 py-3 border border-slate-400">Total Mutasi</th>
							<th className="text-center px-4 py-3 border border-slate-400">{totalMutasi}</th>
						</tr>
					</tfoot>
				</table>
			)}

			<div className={`fixed inset-0 z-30 overflow-y-auto ${!isShowModalRekapDetail && 'hidden'}`}>
        <div className="fixed inset-0 w-full h-full bg-black opacity-10"></div>
          <div className="flex items-center min-h-screen px-4 py-8">
            <div className="relative w-90 max-w-lg p-4 mx-auto bg-white rounded-xl shadow-lg">
              {selectedItem && (
              	<div className="grid my-4">
				      		<div className="w-full flex gap-8 mb-2 justify-between">
				      			<span className="font-semibold">Waktu Mulai</span>
				      			<span className="font-semibold">{moment(selectedItem.tgl_buka).format('dddd, DD MMMM YYYY, ') + ' ' + moment(selectedItem.waktu_buka, 'HH:mm:ss').format('HH:mm')}</span>
				      		</div>
				      		<div className="w-full flex gap-8 mb-4 justify-between">
				      			<span className="font-semibold">Waktu Berakhir</span>
				      			<span className="font-semibold">{selectedItem.tgl_tutup != null && moment(selectedItem.tgl_tutup).format('dddd, DD MMMM YYYY, ') + ' ' + moment(selectedItem.waktu_tutup, 'HH:mm:ss').format('HH:mm')}</span>
				      		</div>
				      		<div className="w-full flex gap-8 justify-between">
				      			<span className="font-normal">Penjualan</span>
				      			<span className="font-normal">{selectedItem.rekapkasdetail.total_penjualan ?? 0}</span>
				      		</div>
				      		<div className="w-full flex gap-8 mt-2 justify-between">
				      			<span className="font-normal">Modal Awal</span>
				      			<span className="font-normal">Rp. {rupiah(selectedItem.rekapkasdetail.total_modalawal)}</span>
				      		</div>
				      		<div className="w-full flex gap-8 mt-2 justify-between">
				      			<span className="font-normal">Kas Keluar</span>
				      			<span className="font-normal">Rp. {rupiah(selectedItem.rekapkasdetail.total_kaskeluar ?? 0)}</span>
				      		</div>
				      		<div className="w-full flex gap-8 mt-4 justify-between">
				      			<span className="font-bold">Penerimaan Sistem</span>
				      			<span className="font-normal">Rp. {rupiah(selectedItem.rekapkasdetail.penerimaan_sistem ?? 0)}</span>
				      		</div>
				      		<span className="font-bold mt-4 mb-2">Penerimaan Aktual</span>
				      		<div className="w-full flex gap-8 justify-between">
				      			<span className="font-normal ml-4 my-2">Tunai</span>
				      			<span className="font-normal">Rp. {rupiah(selectedItem.rekapkasdetail.penerimaan_tunai ?? 0)}</span>
				      		</div>
				      		<div className="w-full flex gap-8 justify-between">
				      			<span className="font-normal ml-4 my-2">Non Tunai</span>
				      			<span className="font-normal">Rp. {rupiah(selectedItem.rekapkasdetail.penerimaan_non_tunai ?? 0)}</span>
				      		</div>
				      		<div className="w-full flex gap-8 mt-4 justify-between">
				      			<span className="font-bold">Selisih</span>
				      		<span className="font-normal">Rp. {rupiah(selectedItem.rekapkasdetail.selisih ?? 0)}</span>
				      		</div>
				      		<div className="flex items-center gap-2 mt-4">
	                 <button
		                	type="button"
		                  className="w-full h-10 px-12 py-1 mt-2 p-2.5 flex-1 text-white bg-green-600 rounded-md outline-none ring-offset-2 ring-green-600 focus:ring-2"
		                  onClick={() => {
		                  	setIsShowModalRekapDetail(false)
		                  }}
		                >
	                  	OK
	                	</button>
	              	</div>
	              </div>
              )}
						</div>
         	</div>
        </div>
      </div>
	)

});