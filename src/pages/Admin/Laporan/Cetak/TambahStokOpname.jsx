import { useForm, FormProvider, useFormContext } from "react-hook-form"
import React, {useState} from 'react'
import moment from 'moment'
import { rupiah } from '../../../../utils/strings'
import { Input } from "../../../../components/Input";
import { Button } from "../../../../components/Button";
import LoadingPage from "../../../../components/LoadingPage";
import {
  BsFillTrashFill,
} from "react-icons/bs";

export const LaporanTambahStokOpname = React.forwardRef((props, ref) => {
	moment.locale('id')
  const [isShowModalRekapDetail, setIsShowModalRekapDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { errors, control } = useFormContext();

	return (
		<div className="text-black mt-5 px-4 mb-5" ref={ref}>
			<h1 className="text-xl text-center font-bold mt-5">Bathiku</h1>
			<h2 className="text-md text-center font-semibold mb-4">Tambah Stok Opname</h2>

			<div className="mb-3 flex justify-between">
				<span className="text-sm">Tanggal : {moment(props.tanggalAwal).format('DD-MM-YYYY')} s/d {moment(props.tanggalAkhir).format('DD-MM-YYYY')}</span>
			</div>

			{props.isAction ? (
				<LoadingPage/>
			) : (
				<table className="w-full text-sm border-collapse border border-slate-400 table-auto mb-5">
					<thead>
						<tr className="text-sm font-semibold tracking-wide border-b border-slate-400">
							<th className="px-4 py-3 border border-slate-400">Nomor SKU</th>
							<th className="px-4 py-3 border border-slate-400">Nama Produk</th>
							<th className="px-4 py-3 border border-slate-400">Kategori Produk</th>
							<th className="px-4 py-3 border border-slate-400">Stok Sistem</th>
							<th className="px-4 py-3 border border-slate-400">Stok Fisik</th>
							<th className="px-4 py-3 border border-slate-400">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{props?.data.map((item, key) => {
							return (
								<tr key={item.id}>
									<td className="text-center px-4 py-3 border border-slate-400">{item.sku ?? '-'}</td>
									<td className="text-center px-4 py-3 border border-slate-400">{item.nama_produk}</td>
									<td className="text-center px-4 py-3 border border-slate-400">{item.kategori_produk.kategori_produk}</td>
									<td className="text-center px-4 py-3 border border-slate-400">{item.stok}</td>
									<td className="text-center px-4 py-3 border border-slate-400">
										<div className="w-full flex flex-col justify-center items-center gap-2">
											<Input
		                    type="hidden"
		                    name={`id_produk.${key}`}
		                    control={control}
		                  />
											<Input
	                      type="number"
	                      className="text-center py-2 !w-20"
	                      name={`stok_fisik.${key}`}
		                    control={control}
		                    rules={{required: true}}
		                    error={errors[`stok_fisik.${key}`] ? true : false}
	                    />
										</div>
									</td>
									<td className="text-center px-4 py-3 border border-slate-400">
										<div className="w-full flex justify-center">
											<button className="rounded-full w-10 h-10 flex justify-center items-center bg-custom-red hover:bg-custom-navy text-white duration-200"
											onClick={() => props.onDeleteProduk(item.id)}><BsFillTrashFill color="#000000" size={18}/></button>
										</div>
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			)}
		</div>
	)

});