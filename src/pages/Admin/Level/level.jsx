import React, { useState, useEffect, useRef } from 'react'

// components
import { Button } from '../../../components/Button'
import HeaderContent from '../../../layouts/HeaderContent'
import LoadingTable from '../../../components/LoadingTable'

// icons
import { BsFillTrash2Fill, BsFillPlusCircleFill, BsThreeDots, BsFillSave2Fill } from 'react-icons/bs'
import { BiSearch, BiPlus, BiDotsHorizontalRounded } from 'react-icons/bi'
import { RiArrowLeftSFill, RiArrowRightSFill } from 'react-icons/ri'

// libraries
import { Link } from 'react-router-dom'
import { useForm } from "react-hook-form"
import axios from '../../../utils/axios'
import { rupiah } from '../../../utils/strings'
import { swNormal, swConfirm } from '../../../utils/sw'
import { useMutation, QueryClient, useQueryClient, useQuery } from 'react-query'

const Produk = () => {
	const [isShowModal, setIsShowModal] = useState(false)
	const breadcrumbs = [
		{ link: '/', menu: 'Home' },
		{ link: '/level', menu: 'Level' },
	]

	const [showDropdownAksi, setShowDropdownAksi] = useState({id: 0, status: false})
	const elementDropdownAksi = useRef()
	const btnDropdownAksi = useRef(null)

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
	} = useQuery(["data-level", page], () => fetchData(), {
		staleTime: 1500000, 
		refetchInterval: 1500000,
		keepPreviousData: true,
		refetchOnWindowFocus: false
	})

	const { register, handleSubmit, formState: { errors }, reset, clearErrors, setValue } = useForm();

	const mutation = useMutation(async (id) => {
		const response = await axios.delete('level/' + id)
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
			swNormal('Berhasil', 'Level Berhasil Dihapus', 'success')
		},
		onError: async () => {
			swNormal('Gagal', 'Level Gagal Dihapus', 'error')
		}
	})

	// fetch data
	const fetchData = async () => {
		const response = await axios.get(`level?s=${keyword}&limit=${limit}&sort=DESC&page=${page}`)
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

	// dropdown
	const menuAksiRow = (id) => {
		if(id !== showDropdownAksi.id) {
			setShowDropdownAksi({id, status: true})
		} else {
			setShowDropdownAksi({id, status: !showDropdownAksi.status})
		}
	}

	const handleOutside = (e) => {
		if(btnDropdownAksi?.current?.contains(e.target) != null) {
			if(!btnDropdownAksi?.current?.contains(e.target)) {
				setShowDropdownAksi({...showDropdownAksi, status: !showDropdownAksi.status})
			}
		}
	}

	useEffect(() => {
		document.addEventListener("click", handleOutside, true)
	}, [btnDropdownAksi])

	// endropdown

    return (
        <React.Fragment>
        	<HeaderContent title="Level" breadcrumbs={breadcrumbs}>
	        	<div class="grid grid-cols-12 gap-4">
	        		<div className="relative col-span-7 col-start-3">
		      			<div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
					    	<BiSearch/>
					  	</div>
	        			<input type="text" placeholder="Cari Level" onChange={(e) => setKeyword(e.target.value)} className="input input-bordered w-full pl-10 p-2.5 col-span-2" />
		      		</div>
	        		<div className="col-span-3">
	        			<Link to="/level/tambah">
	        				<Button className="text-xs" color="secondary" type="button" startIcon={<BsFillPlusCircleFill size={16}/>} loading={false} title="Tambah Level"/>
	        			</Link>
	        		</div>
	        	</div>
	        </HeaderContent>
		    <div className="bg-white h-max px-6 rounded-lg mt-4">
				<div className="overflow-x-auto shadow-md overflow-y-hidden">
				    <table className="w-full text-sm text-left">
				        <thead className="text-xs text-blue-500 bg-blue-50 uppercase">
				            <tr className="border-b border-blue-200">
				                <th scope="col" className="py-3 px-6 rounded-tl-md">
				                    No.
				                </th>
				                <th scope="col" className="py-3 px-6">
				                    Level
				                </th>
				                <th scope="col" className="py-3 px-6 rounded-tr-md">
				                    
				                </th>
				            </tr>
				        </thead>
				        <tbody>
				        	{isFetching ? <LoadingTable colSpan="6"/> : (data.length > 0 ? data?.map((obj, key) => (
					            <tr className="bg-white border-b border-blue-200" key={key}>
					                <td className="py-4 px-6 whitespace-nowrap">
					                    {++key}
					                </td>
					                <td className="py-4 px-6">
					                    {obj.level}
					                </td>
					                <td className="py-4 px-6">
					                	<div className="grid grid-cols-2 gap-4">
					                		<div className="dropdown dropdown-end">
											  <Button tabIndex={0} type="button" color="ghost" size="sm" startIcon={<BsThreeDots size={16}/>} loading={false} onClick={() => menuAksiRow(obj.id)} ref={btnDropdownAksi} />
											  <ul tabIndex={0} id={`dropdown-aksi-${obj.id}`} ref={elementDropdownAksi} className={`dropdown-content !fixed menu p-2 shadow bg-base-100 rounded-box w-52 ${showDropdownAksi.status == false ? 'hidden' : ''}`} style={{zIndex: '100000000000 !important'}}>
											    <li><Link to="/level/edit" state={obj}>Edit</Link></li>
											    <li><a onClick={() => confirmDeleteData(obj.id)}>Hapus</a></li>
											  </ul>
											</div>
					                	</div>
					                </td>
					            </tr>
				        	)) : <tr><td className="py-4 px-6 text-center font-medium w-max" colSpan="6">Data Level Kosong</td></tr>)}
				        	{isError && <tr><td className="py-4 px-6 text-center font-medium w-max" colSpan="6">Gagal Mengambil Data</td></tr>}
				        </tbody>
				        <tfoot>
				        	<tr className="bg-blue-50 text-blue-500">
				        		<td colSpan="6" className="text-right">
				        			<div className="flex space-x-1 justify-end">
					        		    <div>
						        			Baris Per Halaman : 
						        			<select className="select select-ghost w-24 focus:bg-opacity-0 focus:outline-0" onChange={(e) => setLimit(e.target.value)}>
											  <option value="10" selected>10</option>
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
				    </table>
				</div>
		    </div>

        </React.Fragment>
    );
};

export default Produk;