import React, { useState, useEffect } from 'react'

// components
import { Button, ButtonIconOutline } from '../../../components/Button'
import HeaderContent from '../../../layouts/HeaderContent'
import TableContent from '../../../layouts/TableContent'
import LoadingTable from '../../../components/LoadingTable'

// icons
import { RiArrowLeftSFill, RiArrowRightSFill } from 'react-icons/ri'
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
        <React.Fragment>
        	<HeaderContent title="Staff" breadcrumbs={breadcrumbs}>
        		<div className="grid grid-cols-12 gap-4">
	        		<div className="relative col-span-7 col-start-3">
		      			<div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
					    	<FiSearch size={20}/>
					  	</div>
	        			<input type="text" placeholder="Cari Produk" onChange={(e) => setKeyword(e.target.value)} className="input input-bordered w-full pl-10 p-2.5 col-span-2" />
		      		</div>
	        		<div className="col-span-3">
	        			<Link to="/staff/tambah">
	        				<Button className="text-xs" color="secondary" type="button" startIcon={<FiPlusCircle size={20}/>} loading={false} title="Tambah Staff"/>
	        			</Link>
	        		</div>
	        	</div>
        	</HeaderContent>
        	<div className="bg-white h-max px-6 rounded-lg mt-4">
	        	<TableContent>
	        		<thead className="text-xs text-blue-500 bg-blue-50 uppercase">
			            <tr className="border-b border-blue-200">
			                <th scope="col" className="py-3 px-6">
			                    No
			                </th>
			                <th scope="col" className="py-3 px-6 rounded-tl-md">
			                    Nama Lengkap
			                </th>
			                <th scope="col" className="py-3 px-6">
			                    Username
			                </th>
			                <th scope="col" className="py-3 px-6">
			                    No Telepon
			                </th>
			                <th scope="col" className="py-3 px-6 rounded-tr-md">
			                    Action
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
				                	<div className="space-x-3">
										<div className="tooltip tooltip-bottom" data-tip="Reset Password"><Link to="/staff/reset-password" state={{...obj, pathFirst: 'Staff', pathSecond: 'Reset Password'}}><ButtonIconOutline><FiKey size="16"/></ButtonIconOutline></Link></div>
										<div className="tooltip tooltip-bottom" data-tip="Edit Staff"><Link to="/staff/edit" state={obj}><ButtonIconOutline><FiEdit3 size="16"/></ButtonIconOutline></Link></div>
										<div className="tooltip tooltip-bottom" data-tip="Hapus Staff"><ButtonIconOutline onClick={() => confirmDeleteData(obj.id)}><FiTrash2 size="16"/></ButtonIconOutline></div>
									</div>
				                </td>
				            </tr>
			        	)) : <tr><td className="py-4 px-6 text-center font-medium w-max" colSpan="5">Data Staff Kosong</td></tr>)}
			        	{isError && <tr><td className="py-4 px-6 text-center font-medium w-max" colSpan="5">Gagal Mengambil Data</td></tr>}
			        </tbody>
			        <tfoot>
			        	<tr className="bg-blue-50 text-blue-500">
			        		<td colSpan="6" className="text-right">
			        			<div className="flex space-x-1 justify-end">
				        		    <div>
					        			Baris Per Halaman : 
					        			<select className="select select-ghost w-24 focus:bg-opacity-0 focus:outline-0" onChange={(e) => setLimit(e.target.value)}>
										  <option defaultValue="10">10</option>
										  <option value="20">20</option>
										  <option value="50">50</option>
										  <option value="100">100</option>
										</select>
				        		    </div>
				        		    <div className="flex space-x-1 items-center">
				        		    	<span>{fromRow}-{toRow} dari {totalRows}</span>
				        		    	<div className="mr-5 flex items-center">
				        		    		<RiArrowLeftSFill size="30" className={`hover:text-blue-700 ${prevPageUrl == null ? 'text-blue-300 cursor-no-drop' : 'cursor-pointer'}`} onClick={() => prevPage()}/>
				        		    		<RiArrowRightSFill size="30" className={`hover:text-blue-700 ${nextPageUrl == null ? 'text-blue-300 cursor-no-drop' : 'cursor-pointer'}`} onClick={() => nextPage()}/>
				        		    	</div>
				        		    </div>
			        			</div>
			        		</td>
			        	</tr>
			        </tfoot>
	        	</TableContent>
        	</div>

        </React.Fragment>
    );
};

export default Staff;
