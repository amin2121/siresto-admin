import React, { useState, useEffect } from 'react'

// components
import { Button, ButtonIconOutline } from '../../../components/Button'
import HeaderContent from '../../../layouts/HeaderContent'
import TableContent from '../../../layouts/TableContent'
import LoadingTable from '../../../components/LoadingTable'
import PaginationTable from '../../../components/PaginationTable'

// icons
import { FiTrash2, FiEdit3, FiToggleRight, FiPlusCircle, FiSearch, FiKey } from 'react-icons/fi'

// libraries
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import axios from '../../../utils/axios'
import { swConfirm } from '../../../utils/sw'
import { useMutation, QueryClient, useQueryClient } from 'react-query'
import { useForm } from "react-hook-form";
import { toastSuccess, toastError } from '../../../utils/toast'

const Staff = () => {
	const [errMessage, setErrMessage] = useState('')
	const user = JSON.parse(localStorage.getItem('user'))
	const breadcrumbs = [
		{ link: '/', menu: 'Home' },
		{ link: '/staff', menu: 'Staff' },
	]

	// pagination
	const [page, setPage] = useState(1)
	const [nextPageUrl, setNextPageUrl] = useState(null)
	const [prevPageUrl, setPrevPageUrl] = useState(null)
	const [toRow, setToRow] = useState(1)
	const [fromRow, setFromRow] = useState(1)
	const [limit, setLimit] = useState(10)
	const [keyword, setKeyword] = useState('')
	const [totalRows, setTotalRows] = useState(0)
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
	} = useQuery(["data-staff", page], () => fetchData(), {
		staleTime: 150000, 
		refetchInterval: 150000,
		keepPreviousData: true,
		refetchOnWindowFocus: false
	})

	const fetchData = async () => {
		axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
		const response = await axios.get(`staff?s=${keyword}&limit=${limit}&sort=DESC&page=${page}`)
		const res = await response.data.data
		const data = res.data

		setTotalRows(res.total)
		setFromRow(res.from)
		setToRow(res.to)
		setNextPageUrl(res.next_page_url)
		setPrevPageUrl(res.prev_page_url)
		
		return data
	}

	useEffect(() => {
		refetch()
	}, [keyword, limit])

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

	const mutation = useMutation(async(id) => {
		axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
		const response = await axios.delete('staff/' + id)
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
				refetch()
			}

		},
		onSuccess: async () => {
			toastSuccess('Staff Berhasil Dihapus')
		},
		onError: async () => {
			toastError('Staff Gagal Dihapus')
		}
	})

    return (
        <>
        	<HeaderContent title="Staff" breadcrumbs={breadcrumbs}>
        		<div className="md:flex mt-4 md:mt-0 flex-1 md:space-x-3 block space-y-3 md:space-y-0">
	        		<div className="relative flex-1 w-full">
		      			<div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
					    	<FiSearch size={20}/>
					  	</div>
	        			<input type="text" placeholder="Cari Produk" onChange={(e) => setKeyword(e.target.value)} className="input input-bordered w-full pl-10 p-2.5 col-span-2" />
		      		</div>
	        		<div className="text-right">
	        			<Link to="/staff/tambah">
	        				<Button className="text-xs bg-custom-blue border-custom-blue" type="button" startIcon={<FiPlusCircle size={20}/>} loading={false} title="Tambah Staff"/>
	        			</Link>
	        		</div>
	        	</div>
        	</HeaderContent>
        	<div className="bg-white px-6 mt-4 mb-5">
	        	<TableContent>
	        		<thead className="text-xs text-blue-500 bg-blue-50 uppercase">
			            <tr className="border-b border-blue-200">
			                <th scope="col" className="py-3 px-6 rounded-tl-md">
			                    No
			                </th>
			                <th scope="col" className="py-3 px-6">
			                    Nama Lengkap
			                </th>
			                <th scope="col" className="py-3 px-6">
			                    Username
			                </th>
			                <th scope="col" className="py-3 px-6">
			                    No Telepon
			                </th>
			                <th scope="col" className="py-3 px-6 rounded-tr-md">
								Aksi
			                </th>
			            </tr>
			        </thead>
			        <tbody>
			        	{isFetching ? <LoadingTable colSpan="7"/> : (data.length > 0 ? data?.map((obj, key) => (
				            <tr className="bg-white border-b border-blue-200" key={key}>
				            	<td className="py-4 px-6 text-sm">
				            		{++key}
				            	</td>
				                <td className="py-4 px-6 whitespace-nowrap text-sm">
				                    {obj.name}
				                </td>
				                <td className="py-4 px-6 text-sm">
				                    {obj.username}
				                </td>
				                <td className="py-4 px-6 text-sm">
				                    {obj.no_telepon}
				                </td>
				                <td className="py-4 px-6">
				                	<div className="md:space-x-3 space-x-1 text-center">
										<div className="tooltip tooltip-bottom" data-tip="Reset Password"><Link to="/staff/reset-password" state={{...obj, pathFirst: 'Staff', pathSecond: 'Reset Password'}}><ButtonIconOutline><FiKey size="16"/></ButtonIconOutline></Link></div>
										<div className="tooltip tooltip-bottom" data-tip="Edit Staff"><Link to="/staff/edit" state={obj}><ButtonIconOutline><FiEdit3 size="16"/></ButtonIconOutline></Link></div>
										<div className="tooltip tooltip-bottom" data-tip="Hapus Staff"><ButtonIconOutline onClick={() => confirmDeleteData(obj.id)}><FiTrash2 size="16"/></ButtonIconOutline></div>
									</div>
				                </td>
				            </tr>
			        	)) : <tr><td className="py-4 px-6 text-center font-medium w-max" colSpan="5">Data Staff Kosong</td></tr>)}
			        	{isError && <tr><td className="py-4 px-6 text-center font-medium w-max" colSpan="5">Gagal Mengambil Data</td></tr>}
			        </tbody>
	        	</TableContent>
				<PaginationTable setLimit={setLimit} fromRow={fromRow} toRow={toRow} totalRows={totalRows} prevPageUrl={prevPageUrl} nextPageUrl={nextPageUrl} prevPage={prevPage} nextPage={nextPage}/>
        	</div>

        </>
    );
};

export default Staff;
