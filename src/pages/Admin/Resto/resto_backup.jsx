import React, { useState, useEffect, useRef } from 'react'

// components
import { Button } from '../../../components/Button'
import HeaderContent from '../../../layouts/HeaderContent'
import TableContent from '../../../layouts/TableContent'
import Pagination from '../../../components/Pagination'
import LoadingTable from '../../../components/LoadingTable'

// icons
import { HiPencil } from 'react-icons/hi'
import { BsFillTrash2Fill, BsFillPlusCircleFill } from 'react-icons/bs'
import { MdPublishedWithChanges } from 'react-icons/md'
import { BiSearch, BiPlus, BiDotsHorizontalRounded } from 'react-icons/bi'
import { RiArrowLeftSFill, RiArrowRightSFill } from 'react-icons/ri'
import { BsThreeDots } from 'react-icons/bs'

// libraries
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import axios from '../../../utils/axios'
import { swNormal, swConfirm } from '../../../utils/sw'
import { useMutation, QueryClient, useQueryClient } from 'react-query'
import { useForm } from "react-hook-form";

const Resto = () => {
	const [isShowModal, setIsShowModal] = useState(false)
	const [statusResto, setStatusResto] = useState(0)
	const [errMessage, setErrMessage] = useState('')
	const [idResto, setIdResto] = useState(0)
	const { register, handleSubmit, errors, reset, clearErrors, setValue } = useForm();
	const breadcrumbs = [
		{ link: '/', menu: 'Home' },
		{ link: '/resto', menu: 'Resto' },
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
	} = useQuery(["data-resto", page], () => fetchData(), {
		staleTime: 200000, 
		refetchInterval: 200000,
		keepPreviousData: true,
		refetchOnWindowFocus: false
	})

	const fetchData = async () => {
		const response = await axios.get(`resto?s=${keyword}&limit=${limit}&sort=DESC&page=${page}`)
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

	const confirmDeleteResto = (id) => {
		const confirm = swConfirm()
		confirm.then(result => {
			if (result.isConfirmed) {
			    mutation.mutate(id)
			}
		})
	}

	const mutation = useMutation(async(id) => {
		const response = await axios.delete('resto/' + id)
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
				queryClient.invalidateQueries('data-resto')
			}
		},
		onSuccess: async () => {
			swNormal('Berhasil', 'Resto Berhasil Dihapus', 'success')
		},
		onError: async () => {
			swNormal('Gagal', 'Resto Gagal Dihapus', 'error')
		}
	})

	const mutationChangeStatus = useMutation(async(data) => {
		const response = await axios.put('resto/change-status/' + data.id, data)
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
				queryClient.invalidateQueries('data-resto')
			}
		},
		onSuccess: async () => {
			swNormal('Berhasil', 'Status Resto Berhasil Diubah', 'success')
		},
		onError: async () => {
			swNormal('Gagal', 'Status Resto Gagal Diubah', 'error')
		}
	})

	const changeStatus = async (data) => {
		await mutationChangeStatus.mutate(data)
		toggleVisible()
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
        	<HeaderContent title="Resto" breadcrumbs={breadcrumbs}>
        		<div class="grid grid-cols-12 gap-4">
	        		<div className="relative col-span-7 col-start-3">
		      			<div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
					    	<BiSearch/>
					  	</div>
	        			<input type="text" placeholder="Cari Resto" onChange={(e) => setKeyword(e.target.value)} className="input input-bordered w-full pl-10 p-2.5 col-span-2" />
		      		</div>
	        		<div className="col-span-3">
	        			<Link to="/admin/resto/tambah">
	        				<Button className="text-xs" color="secondary" type="button" startIcon={<BsFillPlusCircleFill size={16}/>} loading={false} title="Tambah Resto" />
	        			</Link>
	        		</div>
	        	</div>
        	</HeaderContent>
        	<div className="bg-white h-max px-6 rounded-lg mt-4">
	        	<TableContent>

			        <tbody>
			        	{isFetching ? <LoadingTable colSpan="6"/> : (data.length > 0 ? data?.map((obj, key) => (
				            <tr className="bg-white border-b border-blue-200" key={key}>
				                <td className="py-4 px-6 whitespace-nowrap text-sm">
				                    {obj.nama_resto}
				                </td>
				                <td className="py-4 px-6 text-sm">
				                    {obj.nama_pemilik}
				                </td>
				                <td className="py-4 px-6 text-sm">
				                    {obj.kategori_bisnis.kategori_bisnis}
				                </td>
				                <td className="py-4 px-6">
				                	{
				                		obj.is_enabled == '1' 
				                		? <div className="badge badge-primary text-xs">Tersedia</div> 
				                		: <div className="badge badge-error text-xs">Tidak Tersedia</div>
				                	}
				                </td>
				                <td className="py-4 px-6">
				                	<div className="grid grid-cols-2">
										<div className="dropdown dropdown-end">
											<Button tabIndex={0} type="button" color="ghost" size="sm" startIcon={<BsThreeDots size={16}/>} loading={false} onClick={() => menuAksiRow(obj.id)} ref={btnDropdownAksi} />
											<ul tabIndex={0} id={`dropdown-aksi-${obj.id}`} ref={elementDropdownAksi} className={`dropdown-content !fixed menu p-2 shadow bg-base-100 rounded-box w-52 ${showDropdownAksi.status == false ? 'hidden' : ''}`} style={{zIndex: '100000000000 !important'}}>
											    <li><a onClick={() => { setIsShowModal() setValue('id', obj.id); setValue('is_enabled', obj.status_resto); }}>Ganti Status</a></li>
												<li><Link to="/admin/resto/edit" state={obj}>Edit</Link></li>
												<li><a onClick={() => confirmDeleteResto(obj.id)}>Hapus</a></li>
											</ul>
										</div>
				                	</div>
				                </td>
				            </tr>
			        	)) : <tr><td className="py-4 px-6 text-center font-medium w-max" colSpan="5">Data Resto Kosong</td></tr>)}
			        	{isError && <tr><td className="py-4 px-6 text-center font-medium w-max" colSpan="5">Gagal Mengambil Data</td></tr>}
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
	        	</TableContent>
        	</div>

        	<div className="modal" id="modal-ubah-status">
			  	<div className="modal-box">
			    	<h3 className="font-bold text-lg">Ubah Status Resto</h3>
		        	<form onSubmit={handleSubmit(changeStatus)}>
			        	<div className="flex justify-around mt-4">

					        <div className="mb-3 flex">
					          	<input 
					          		type="radio" 
					          		id="status_resto_aktif"
					          		{...register('status_resto')}
					          		value="1"
					          		className="radio radio-primary mr-2"
					          	/>
					          	<label htmlFor="status_resto_aktif">Aktif</label>
					        </div>

					        <div className="flex">
					          	<input 
					          		type="radio" 
					          		id="status_resto_tidak_aktif"
					          		{...register('status_resto')}
					          		value="0"
					          		className="radio radio-primary mr-2" 
					          	/>
					          	<label htmlFor="status_resto_tidak_aktif">Tidak Aktif</label>
					        </div>

			        	</div>
		        		
		        		<input type="hidden" name="id" {...register("id")} />

					    <div className="modal-action">
				          	<Button type="submit" color="primary" title="Simpan" />
					    	<a href="#">
					    		<Button type="button" color="ghost" title="Batal"/>
					    	</a>
					    </div>
		        	</form>
			  	</div>
			</div>

        </React.Fragment>
    );
};

export default Resto;
