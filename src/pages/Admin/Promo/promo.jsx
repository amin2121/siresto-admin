import React, { useState, useEffect } from 'react'

// components
import { Button, ButtonIconOutline } from '../../../components/Button'
import HeaderContent from '../../../layouts/HeaderContent'
import LoadingTable from '../../../components/LoadingTable'
import TableContent from '../../../layouts/TableContent'
import RowTableMessage from '../../../components/RowTableMessage'
import PaginationTable from '../../../components/PaginationTable'

// icons
import { FiEdit3, FiTrash2, FiPlusCircle, FiSearch } from 'react-icons/fi'

// libraries
import axios from '../../../utils/axios'
import { Link } from 'react-router-dom'
import { rupiah, baseUrl } from '../../../utils/strings'
import { swNormal, swConfirm } from '../../../utils/sw'
import { useMutation, QueryClient, useQueryClient, useQuery } from 'react-query'
import { toastSuccess, toastError } from '../../../utils/toast'
import moment from 'moment'

const Promo = () => {
	moment.locale('id');
	const user = JSON.parse(localStorage.getItem('user'))
	const [isShowModal, setIsShowModal] = useState(false)
	const breadcrumbs = [
		{ link: '/', menu: 'Home' },
		{ link: '/promo', menu: 'Promo' },
	]

	// pagination
	const [page, setPage] = useState(1)
	const [nextPageUrl, setNextPageUrl] = useState(null)
	const [prevPageUrl, setPrevPageUrl] = useState(null)
	const [toRow, setToRow] = useState(1)
	const [fromRow, setFromRow] = useState(0)
	const [limit, setLimit] = useState(10)
	const [totalRows, setTotalRows] = useState(0)
	const [keyword, setKeyword] = useState('')

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
	} = useQuery(["data-promo", page], () => fetchData(), {
		staleTime: 15000, 
		refetchInterval: 15000, 
		keepPreviousData: true,
		refetchOnWindowFocus: false
	})

	const mutation = useMutation(async (id) => {
		axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
		const response = await axios.delete('promo/' + id)
		const res = response.data

		if(res.meta.code != 200) {
			throw new Error(res.meta.message)
		}

		return res.meta.code
	}, {
		onMutate: () => {

		},
		onSettled: async (data, error) => {
			if(data == 200) {
				queryClient.invalidateQueries('data-promo')
			}
		},
		onSuccess: async () => {
			toastSuccess('Promo Berhasil Dihapus')
		},
		onError: async () => {
			toastError('Promo Gagal Dihapus')
		}
	})

	// fetch data
	const fetchData = async () => {
		axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
		const response = await axios.get(`promo?s=${keyword}&limit=${1}&sort=DESC&page=${page}`)
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

	// pagination action
	const nextPage = () => nextPageUrl != null ? setPage(page + 1) : null
	const prevPage = () => prevPageUrl != null ? setPage(page - 1) : null

	const confirmDeleteData = (id) => {
		const confirm = swConfirm()
		confirm.then(result => {
			if (result.isConfirmed) {
			    mutation.mutate(id)
			}
		})
	}

    return (
        <>
        	<HeaderContent title="Promo" breadcrumbs={breadcrumbs}>
	        	<div className="md:flex mt-4 md:mt-0 flex-1 md:space-x-3 block space-y-3 md:space-y-0">
	        		<div className="relative flex-1 w-full">
		      			<div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
					    	<FiSearch size={20}/>
					  	</div>
	        			<input type="text" placeholder="Cari Promo" onChange={(e) => setKeyword(e.target.value)} className="input input-bordered w-full pl-10 p-2.5 col-span-2" />
		      		</div>
	        		<div className="text-right">
	        			<Link to="/promo/tambah">
	        				<Button className="text-xs bg-custom-blue border-custom-blue" type="button" startIcon={<FiPlusCircle size={20}/>} loading={false} title="Tambah Promo"/>
	        			</Link>
	        		</div>
	        	</div>
	        </HeaderContent>
		    <div className="bg-white px-6 mt-4 mb-5">
				<TableContent>
			        <thead className="text-xs text-blue-500 bg-blue-50 uppercase">
			            <tr className="border-b border-blue-200">
			                <th scope="col" className="py-3 px-6 rounded-tl-md text-center">
			                    No.
			                </th>
			                <th scope="col" className="py-3 px-6 w-60">
			                    Gambar
			                </th>
			                <th scope="col" className="py-3 px-6 text-center">
			                    Judul Promo
			                </th>
			                <th scope="col" className="py-3 px-6 text-center">
			                    Tanggal Awal
			                </th>
			                <th scope="col" className="py-3 px-6 text-center">
			                    Periode Promo
			                </th>
			                <th scope="col" className="py-3 px-6 rounded-tr-md text-center">
			                    Aksi
			                </th>
			            </tr>
			        </thead>
			        <tbody>
			        	{isLoading ? <LoadingTable colSpan="7"/> : (data.length > 0 ? data?.map((obj, key) => (
				            <tr className="bg-white border-b border-blue-200" key={key}>
				                <td className="py-4 px-6 whitespace-nowrap text-center">
				                    {++key}
				                </td>
				                <td className="py-4 px-6 text-center">
				                    <img src={baseUrl + obj.gambar} alt={baseUrl + obj.gambar} className="h-24 object-cover rounded" />
				                </td>
				                <td className="py-4 px-6 text-left">
				                    {obj.judul_promo} <br/>
				                    <span className="text-xs text-slate-400">Promo : {obj.status_promo === 'nominal' && 'Rp.'} {obj.promo} {obj.status_promo === 'persentase' && '%'}</span>
				                </td>
				                <td className="py-4 px-6 text-center">
				                    {moment(obj.tanggal_awal_promo).format('DD-MM-YYYY')}
				                </td>
				                <td className="py-4 px-6 text-center">
				                    {obj.periode_promo} Hari
				                </td>
				                <td className="py-4 px-6">
				                	<div className="space-x-3 flex w-24 items-center flex-wrap">
				                		<div className="tooltip tooltip-bottom" data-tip="Edit Promo"><Link to="/promo/edit" state={obj}><ButtonIconOutline><FiEdit3 size="16"/></ButtonIconOutline></Link></div>
										<div className="tooltip tooltip-bottom" data-tip="Hapus Promo"><ButtonIconOutline onClick={() => confirmDeleteData(obj.id)}><FiTrash2 size="16"/></ButtonIconOutline></div>
				                	</div>
				                </td>
				            </tr>
			        	)) : <RowTableMessage colSpan="7" message="Data Produk Kosong"/>)}
			        	{isError && <RowTableMessage colSpan="7" message="Gagal Mengambil Data"/>}
			        </tbody>
			    </TableContent>
			    <PaginationTable setLimit={setLimit} fromRow={fromRow} toRow={toRow} totalRows={totalRows} prevPageUrl={prevPageUrl} nextPageUrl={nextPageUrl} prevPage={prevPage} nextPage={nextPage}/>
		    </div>

        </>
    );
};

export default Promo;