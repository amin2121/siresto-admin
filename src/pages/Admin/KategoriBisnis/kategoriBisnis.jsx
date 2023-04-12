import React, { useState, useEffect, useRef } from 'react'

// components
import { Button, ButtonIconOutline } from '../../../components/Button'
import { InputGroup } from '../../../components/Input'
import Pagination from '../../../components/Pagination'
import LoadingTable from '../../../components/LoadingTable'
import HeaderContent from '../../../layouts/HeaderContent'
import TableContent from '../../../layouts/TableContent'

// icons
import { RiArrowLeftSFill, RiArrowRightSFill } from 'react-icons/ri'
import { FiTrash2, FiEdit3, FiToggleRight, FiPlusCircle, FiSearch } from 'react-icons/fi'

// libraries
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import axios from '../../../utils/axios'
import { swNormal, swConfirm } from '../../../utils/sw'
import { useMutation, QueryClient, useQueryClient } from 'react-query'
import { useForm } from "react-hook-form";
import { toastSuccess, toastError } from '../../../utils/toast'

const KategoriBisnis = () => {
	const user = JSON.parse(localStorage.getItem('user'))
	const [isShowModal, setIsShowModal] = useState(false)
	const breadcrumbs = [
		{ link: '/', menu: 'Home' },
		{ link: '/kategori-bisnis', menu: 'Kategori Bisnis' },
	]

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
	} = useQuery(["data-kategori-bisnis", page], () => fetchData(), {
		staleTime: 15000, 
		refetchInterval: 15000, 
		keepPreviousData: true,
		refetchOnWindowFocus: false
	})

	const mutation = useMutation(async(id) => {
		axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
		const response = await axios.delete('kategori-bisnis/' + id)
		const res = response.data

		if(res.meta.code != 200) {
			throw new Error(res.meta.message)
		}

		return res.meta.code
	}, {
		onMutate: () => {
			// spinner
			// setIsAction(!isAction)
		},
		onSettled: async (data, error) => {

			if(data == 200) {
				refetch()
			}

		},
		onSuccess: async () => {
			toastSuccess('Resto Berhasil Dihapus')
		},
		onError: async () => {
			toastError('Resto Gagal Dihapus')
		}
	})

	// fetch data
	const fetchData = async () => {
		axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
		const response = await axios.get(`kategori-bisnis?s=${keyword}&limit=${limit}&sort=DESC&page=${page}`)
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
        	<HeaderContent title="Kategori Bisnis" breadcrumbs={breadcrumbs}>
	        	<div className="md:flex mt-4 md:mt-0 flex-1 md:space-x-3 block space-y-3 md:space-y-0">
	        		<div className="relative flex-1 w-full">
		        		<div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
					    	<FiSearch size={20}/>
					  	</div>
	        			<input type="text" placeholder="Cari Kategori Bisnis" onChange={(e) => setKeyword(e.target.value)} className="input input-bordered w-full pl-10 p-2.5 col-span-2" />
	        		</div>
	        		<div className="text-right">
	        			<Link to="/kategori-bisnis/tambah">
	        				<Button className="text-xs btn-block" color="secondary" type="button" startIcon={<FiPlusCircle size={20}/>} loading={false} title="Kategori Bisnis" />
	        			</Link>
	        		</div>
	        	</div>
        	</HeaderContent>
		    <div className="bg-white mt-4 px-6">
		    	<TableContent>
		    		<thead className="text-xs text-blue-500 bg-blue-50 uppercase">
			            <tr className="border-b border-blue-200">
			                <th scope="col" className="py-3 px-6 rounded-tl-md">
			                    No.
			                </th>
			                <th scope="col" className="py-3 px-6">
			                    Kategori Bisnis
			                </th>
			                <th scope="col" className="py-3 px-6 rounded-tr-md">
			                    
			                </th>
			            </tr>
			        </thead>
			        <tbody>
			        	{isFetching ? <LoadingTable colSpan="3"/> : (data.length > 0 ? data?.map((obj, key) => (
				            <tr className="bg-white border-b" key={key}>
				                <td className="py-4 px-6 whitespace-nowrap text-sm">
				                    {++key}
				                </td>
				                <td className="py-4 px-6">
				                    {obj.kategori_bisnis}
				                </td>
				                <td className="py-4 px-6">
									<div className="md:space-x-3 space-x-0">
										<div className="tooltip tooltip-bottom" data-tip="Edit Kategori Bisnis"><Link to="/kategori-bisnis/edit" state={obj}><ButtonIconOutline><FiEdit3 size="16"/></ButtonIconOutline></Link></div>
										<div className="tooltip tooltip-bottom" data-tip="Hapus Kategori Bisnis"><ButtonIconOutline onClick={() => confirmDeleteData(obj.id)}><FiTrash2 size="16"/></ButtonIconOutline></div>
									</div>
				                </td>
				            </tr>
			        	)) : <tr><td className="py-4 px-6 text-center font-medium w-max" colSpan="5">Data Kategori Bisnis Kosong</td></tr>)}
			        	{isError && <tr><td className="py-4 px-6 text-center font-medium w-max" colSpan="5">Gagal Mengambil Data</td></tr>}
			        </tbody>
			        <tfoot>
			        	<tr className="bg-blue-50 text-blue-500">
			        		<td colSpan="6" className="text-right">
			        			<div className="flex space-x-1 justify-end">
				        		    <div>
					        			Baris Per Halaman : 
					        			<select className="select select-ghost w-24 focus:bg-opacity-0 focus:outline-0"  onChange={(e) => setLimit(e.target.value)} defaultValue="10">
										  <option value="10">10</option>
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

        </>
    );
};

export default KategoriBisnis;
