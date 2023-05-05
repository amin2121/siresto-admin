import React, { useState, useEffect, useRef } from 'react'

// components
import Pagination from '../../../components/Pagination'
import HeaderContent from '../../../layouts/HeaderContent'
import TableContent from '../../../layouts/TableContent'
import LoadingTable from '../../../components/LoadingTable'
import PaginationTable from '../../../components/PaginationTable'
import { Button, ButtonIconOutline } from '../../../components/Button'

// icons
import { FiTrash2, FiEdit3, FiToggleRight, FiPlusCircle, FiSearch, FiFileText } from 'react-icons/fi'

// libraries
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import axios from '../../../utils/axios'
import { useForm } from "react-hook-form";
import { swNormal, swConfirm } from '../../../utils/sw'
import { rupiah, timestampToDate, capitalize } from '../../../utils/strings'
import { useMutation, QueryClient, useQueryClient } from 'react-query'
import moment from 'moment'
import { toastSuccess, toastError } from '../../../utils/toast'

const Order = () => {
	const user = JSON.parse(localStorage.getItem('user'))
	const [errMessage, setErrMessage] = useState('')
	const breadcrumbs = [
		{ link: '/', menu: 'Home' },
		{ link: '/order', menu: 'Order' },
	]

	moment.locale('id');
	const [showDropdownAksi, setShowDropdownAksi] = useState({id: 0, status: false})
	const elementDropdownAksi = useRef()
	const btnDropdownAksi = useRef(null)

	// pagination
	const [page, setPage] = useState(1)
	const [nextPageUrl, setNextPageUrl] = useState(null)
	const [prevPageUrl, setPrevPageUrl] = useState(null)
	const [toRow, setToRow] = useState(1)
	const [fromRow, setFromRow] = useState(1)
	const [limit, setLimit] = useState(10)
	const [keyword, setKeyword] = useState('')
	const [totalRows, setTotalRows] = useState(0)

	// react query
	const queryClient = new QueryClient()
	const {
		isLoading, 
		isError, 
		error,
		data,
		isSuccess,
		isFetching,
		refetch,
		isPreviousData, 
	} = useQuery(["data-order", page], () => fetchData(), {
		staleTime: 15000, 
		refetchInterval: 15000, 
		keepPreviousData: true,
		refetchOnWindowFocus: false
	})

	// fetch data
	const fetchData = async () => {
		axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
		const response = await axios.get(`order?s=${keyword}&limit=${limit}&sort=DESC&page=${page}`)
		const res = await response.data.data
		const data = res.data

		setTotalRows(res.total)
		setFromRow(res.from)
		setToRow(res.to)
		setNextPageUrl(res.next_page_url)
		setPrevPageUrl(res.prev_page_url)
		
		return data
	}

	// refetch after searching
	useEffect(() => {
		refetch()
	}, [keyword, limit])

	const nextPage = () => setPage(page + 1)
	const prevPage = () => setPage(page - 1)

	const mutation = useMutation(async (id) => {
		axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
		const response = await axios.delete('order/' + id)
		const res = response.data

		if(res.meta.code != 200) {
			throw new Error(res.meta.message)
		}

		return res.meta.code
	}, {
		onMutate: () => {
			// spinner
		},
		onSettled: async (data, error) => {

			if(data == 200) {
				queryClient.invalidateQueries('data-order')
				refetch()
			}
		},
		onSuccess: async () => {
			toastSuccess('Order Berhasil Dihapus')

		},
		onError: async () => {
			toastError('Order Gagal Dihapus')
		}
	})

	const confirmDeleteData = async (id) => {
		const confirm = swConfirm()
		confirm.then(result => {
			if (result.isConfirmed) {
			    mutation.mutate(id)
			}
		})
	}

    return (
        <>
        	<HeaderContent title="Order" breadcrumbs={breadcrumbs}>
        		<div className="md:flex mt-4 md:mt-0 flex-1 md:space-x-3 block space-y-3 md:space-y-0">
	        		<div className="relative flex-1 w-full">
		      			<div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
					    	<FiSearch size={20}/>
					  	</div>
	        			<input type="text" placeholder="Cari Order" onChange={(e) => setKeyword(e.target.value)} className="input input-bordered w-full pl-10 p-2.5 col-span-2" />
		      		</div>
	        		<div className="text-right">
	        			<Link to="/order/tambah">
	        				<Button className="text-xs bg-custom-blue border-custom-blue" type="button" startIcon={<FiPlusCircle size={20}/>} loading={false} title="Tambah Order"/>
	        			</Link>
	        		</div>
	        	</div>
        	</HeaderContent>
        	<div className="bg-white px-6 mt-4 mb-5">
        		<TableContent>
		        	<thead className="text-xs text-blue-500 bg-blue-50 uppercase">
			            <tr className="border-b border-blue-200">
			                <th scope="col" className="py-3 px-6 rounded-tl-md">Kode Transaksi</th>
			                <th scope="col" className="py-3 px-6">Customer</th>
			                <th scope="col" className="py-3 px-6">Nilai Transaksi</th>
			                <th scope="col" className="py-3 px-6">Metode Pembayaran</th>
			                <th scope="col" className="py-3 px-6">Tanggal Transaksi</th>
			                <th scope="col" className="py-3 px-6 rounded-tr-md">Aksi</th>
			            </tr>
			        </thead>
			        <tbody>
			        	{isLoading ? <LoadingTable colSpan="5"/> : (data.length > 0 ? data?.map((obj, key) => (
				        	<tr className="bg-white  border-b border-blue-200" key={key}>
						        <td className="py-4 px-6 text-sm w-full">{obj.no_transaksi}</td>
						        <td className="py-4 px-6 text-sm w-full">{obj.nama_pelanggan}</td>
						        <td className="py-4 px-6 text-sm w-full">Rp. {rupiah(obj.nilai_transaksi)}</td>
						        <td className="py-4 px-6 text-sm w-full">{obj.metode_pembayaran == '' ? 'Belum Membayar' : capitalize(obj.metode_pembayaran)}</td>
						        <td className="py-4 px-6 text-sm w-full">15-10-2022</td>
						        <td className="py-4 px-6 w-full">
				                	<div className="md:space-x-3 space-x-1 text-center">
										<div className="tooltip tooltip-bottom" data-tip="Detail Order"><Link to="/order/detail" state={obj}><ButtonIconOutline><FiFileText size="16"/></ButtonIconOutline></Link></div>
										<div className="tooltip tooltip-bottom" data-tip="Edit Order"><Link to="/order/edit" state={obj}><ButtonIconOutline><FiEdit3 size="16"/></ButtonIconOutline></Link></div>
										<div className="tooltip tooltip-bottom" data-tip="Hapus Order"><ButtonIconOutline onClick={() => confirmDeleteData(obj.id)}><FiTrash2 size="16"/></ButtonIconOutline></div>
									</div>
				                </td>
						    </tr>
			        	)) : <tr><td className="py-4 px-6 text-center font-medium w-max" colSpan="5">Data Meja Kosong</td></tr>)}
			        	{isError && <tr><td className="py-4 px-6 text-center font-medium w-max" colSpan="5">Gagal Mengambil Data</td></tr>}
			        </tbody>
        		</TableContent>
        		<PaginationTable setLimit={setLimit} fromRow={fromRow} toRow={toRow} totalRows={totalRows} prevPageUrl={prevPageUrl} nextPageUrl={nextPageUrl} prevPage={prevPage} nextPage={nextPage}/>
        	</div>
        </>
    );
};

export default Order;