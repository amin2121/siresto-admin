import { useForm, FormProvider, useFormContext } from "react-hook-form"
import React, {useState} from 'react'
import moment from 'moment'
import { rupiah } from '../../../../utils/strings'
import { Input } from "../../../../components/Input";
import { Button } from "../../../../components/Button";
import LoadingPage from "../../../../components/LoadingPage";
import TableContent from "../../../../layouts/TableContent";
import {
  BsFillTrashFill,
} from "react-icons/bs";

export const LaporanStokOpname = React.forwardRef((props, ref) => {
	moment.locale('id')
  const [isShowModalStokOpnameDetail, setIsShowModalStokOpnameDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

	return (
		<div className="text-black mt-5 px-4 mb-5" ref={ref}>
			<h1 className="text-xl text-center font-bold mt-5">Bathiku</h1>
			<h2 className="text-md text-center font-semibold mb-4">Laporan Stok Opname</h2>

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
							<th className="px-4 py-3 border border-slate-400">Waktu</th>
							<th className="px-4 py-3 border border-slate-400">Nama Staff</th>
							<th className="px-4 py-3 border border-slate-400">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{props?.data.map((item, key) => {
							return (
								<>
									<tr key={key}>
										<td className="text-center px-4 py-3 border border-slate-400">{item.created_at != null && moment(item.created_at).format('DD-MM-YYYY')}</td>
										<td className="text-center px-4 py-3 border border-slate-400">{item.created_at != null && moment(item.created_at).format('H:mm:ss')}</td>
										<td className="text-center px-4 py-3 border border-slate-400">{item.pegawai.name}</td>
										<td className="text-center px-4 py-3 border border-slate-400">
											<Button
						            className="text-xs bg-custom-purple border-custom-purple"
						            type="button"
						            loading={false}
						            title="Detail Stok Opname"
						            onClick={() => {
						            	setSelectedItem(item)
						            	setIsShowModalStokOpnameDetail(true)
						            }}
						          />
										</td>
									</tr>

									<div className={`fixed inset-0 z-30 overflow-y-auto ${!isShowModalStokOpnameDetail && 'hidden'}`}>
						      	<div className="fixed inset-0 w-full h-full bg-black opacity-10"></div>
						        <div className="flex items-center px-4 py-8">
						          <div className="relative p-4 mx-auto bg-white rounded-xl shadow-lg">
						            {selectedItem && (
						            	<div className="grid my-4">
									      		<div className="w-full flex gap-8 mb-2 justify-between">
									      			<span className="font-semibold">Waktu Stok Opname :</span>
									      			<span className="font-semibold">{moment(selectedItem.created_at).format('dddd, DD MMMM YYYY, ') + ' ' + moment(selectedItem.created_at, 'HH:mm:ss').format('HH:mm')}</span>
									      		</div>
									      		<div className="w-full flex gap-8 mb-2 justify-between">
									      			<span className="font-semibold">Nama Staff :</span>
									      			<span className="font-semibold">{selectedItem.pegawai.name}</span>
									      		</div>
									      		<table className="flex-1 mt-4">
						                  <thead className="text-xs text-custom-purple bg-custom-purple-light uppercase">
						                    <tr className="border-b border-custom-purple-light">
						                    	<th scope="col" className="py-3 px-6 hidden print:block rounded-tl-md">
						                        Tanggal
						                      </th>
						                      <th scope="col" className="py-3 px-6 hidden print:block">
						                        Waktu
						                      </th>
						                      <th scope="col" className="py-3 px-6 rounded-tl-md">
						                        Nomor SKU
						                      </th>
						                      <th scope="col" className="py-3 px-6">
						                        Nama Produk
						                      </th>
						                      <th scope="col" className="py-3 px-6">
						                        Kategori Produk
						                      </th>
						                      <th scope="col" className="py-3 px-6">
						                        Stok Sistem
						                      </th>
						                      <th scope="col" className="py-3 px-6">
						                        Stok Fisik
						                      </th>
						                      <th scope="col" className="py-3 px-6 rounded-tr-md">
						                        Selisih Stok
						                      </th>
						                    </tr>
						                  </thead>
						                  <tbody>
						                    {selectedItem.stok_opname_detail.length > 0 ? (
						                      selectedItem.stok_opname_detail?.map((obj, key) => (
						                        <tr
						                          className="border-b border-custom-purple-light bg-white"
						                          key={key}
						                        >
						                        	<td className="py-4 px-6 text-center hidden print:block">
						                            {selectedItem.created_at != null && moment(item.created_at).format('DD-MM-YYYY')}
						                          </td>
						                          <td className="py-4 px-6 text-center hidden print:block">
						                            {selectedItem.created_at != null && moment(item.created_at).format('HH:mm:ss')}
						                          </td>
						                          <td className="py-4 px-6 text-center">
						                            {obj.produk.nomor_sku ?? '-'}
						                          </td>
						                          <td className="py-4 px-6 text-center">
						                            {obj.produk.nama_produk}
						                          </td>
						                          <td className="py-4 px-6 text-center">
						                            {obj.produk.kategori_produk.kategori_produk}
						                          </td>
						                          <td className="py-4 px-6 text-center">
						                            {obj.stok_sistem}
						                          </td>
						                          <td className="py-4 px-6 text-center">
						                            {obj.stok_fisik}
						                          </td>
						                          <td className={`${obj.selisih_stok == 0 ? "text-custom-green" : "text-custom-red"} py-4 px-6 text-center`}>
						                            {obj.selisih_stok}
						                          </td>
						                        </tr>
						                      ))
						                    ) : (
						                      <tr>
						                        <td
						                          className="py-4 px-6 text-center font-medium w-max"
						                          colSpan="5"
						                        >
						                          Data Produk Kosong
						                        </td>
						                      </tr>
						                    )}
						                  </tbody>
						                </table>
									      		<div className="flex items-center gap-2 mt-4">
						                 <button
							                	type="button"
							                  className="w-full h-10 px-12 py-1 mt-2 p-2.5 flex-1 text-white bg-green-600 rounded-md outline-none ring-offset-2 ring-green-600 focus:ring-2"
							                  onClick={() => {
							                  	setIsShowModalStokOpnameDetail(false)
							                  }}
							                >
						                  	Tutup
						                	</button>
						              	</div>
						              </div>
						            )}
											</div>
						       	</div>
						      </div>
								</>
							)
						})}
					</tbody>
				</table>
			)}

    </div>
	)
});