import React, { useState, useEffect, useRef } from 'react'

// components
import { Button, ButtonIconOutline } from '../../../components/Button'
import { Modal } from '../../../components/Modal'
import HeaderContent from '../../../layouts/HeaderContent'
import TableContent from '../../../layouts/TableContent'
import LoadingTable from '../../../components/LoadingTable'
import PaginationTable from '../../../components/PaginationTable'
import Badge from '../../../components/Badge'

// icons
import { RiArrowLeftSFill, RiArrowRightSFill } from 'react-icons/ri'
import { FiTrash2, FiEdit3, FiToggleRight, FiPlusCircle, FiSearch } from 'react-icons/fi'

// libraries
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import axios from '../../../utils/axios'
import { swConfirm } from '../../../utils/sw'
import { useMutation, QueryClient } from 'react-query'
import { useForm } from "react-hook-form";
import { toastSuccess, toastError } from '../../../utils/toast'

const Resto = () => {
	const user = JSON.parse(localStorage.getItem('user'))
	const { register, handleSubmit, setValue } = useForm();
	const breadcrumbs = [
		{ link: '/', menu: 'Home' },
		{ link: '/resto', menu: 'Resto' },
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
		staleTime: 15000, 
		refetchInterval: 15000,
		keepPreviousData: true,
		refetchOnWindowFocus: false
	})

	const fetchData = async () => {
		axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
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

	const mutationChangeStatus = useMutation(async(data) => {
		const response = await axios.put('resto/ubah-status/' + data.id, data)
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
			toastSuccess('Status Resto Berhasil Diubah')
		},
		onError: async () => {
			toastError('Status Resto Gagal Diubah')
		}
	})

	const changeStatus = async (data) => {
		await mutationChangeStatus.mutate(data)
		document.getElementById('btn-close-modal').click()
	}

	const checkedStatusResto = (obj) => {
		setValue('id', obj.id)
		setValue('status_resto', obj.status_resto)
	}

    return (
        <>
        	<HeaderContent title="Resto" breadcrumbs={breadcrumbs}>
        		<div className="md:flex mt-4 md:mt-0 flex-1 md:space-x-3 block space-y-3 md:space-y-0">
	        		<div className="relative flex-1 w-full">
		      			<div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
					    	<FiSearch size={20}/>
					  	</div>
	        			<input type="text" placeholder="Cari Resto" onChange={(e) => setKeyword(e.target.value)} className="input input-bordered w-full pl-10 p-2.5 col-span-2" />
		      		</div>
	        		<div className="text-right">
	        			<Link to="/resto/tambah">
	        				<Button className="text-xs bg-custom-blue border-custom-blue" type="button" startIcon={<FiPlusCircle size={20}/>} loading={false} title="Tambah Resto" />
	        			</Link>
	        		</div>
	        	</div>
        	</HeaderContent>
        	<div className="bg-white px-6 mt-4">
	        	<TableContent>
	        		<thead className="text-xs text-blue-500 bg-blue-50 uppercase">
			            <tr className="border-b border-blue-200">
			            	<th scope="col" className="py-3 px-6">
			            		No
			            	</th>
			                <th scope="col" className="py-3 px-6 rounded-tl-md">
			                    Nama Resto
			                </th>
			                <th scope="col" className="py-3 px-6">
			                    Nama Pemilik
			                </th>
			                <th scope="col" className="py-3 px-6">
			                    Bisnis
			                </th>
			                <th scope="col" className="py-3 px-6">
			                    Status Resto
			                </th>
			                <th scope="col" className="py-3 px-6 rounded-tr-md">
			                    Aksi
			                </th>
			            </tr>
			        </thead>
			        <tbody>
			        	{isFetching ? <LoadingTable colSpan="6"/> : (data.length > 0 ? data?.map((obj, key) => (
				            <tr className="bg-white border-b border-blue-200" key={key}>
				            	<td className="py-4 px-6 text-sm text-center">
				                    {++key}
				                </td>
				                <td className="py-4 px-6 whitespace-nowrap text-sm text-center">
				                    {obj.nama_resto}
				                </td>
				                <td className="py-4 px-6 text-sm text-center">
				                    {obj.nama_pemilik}
				                </td>
				                <td className="py-4 px-6 text-sm text-center">
				                    {obj?.kategori_bisnis?.kategori_bisnis}
				                </td>
				                <td className="py-4 px-6 text-center">
				                	{
				                		obj.status_resto == '1' 
				                		? <Badge title="Aktif" type="success" /> 
				                		: <Badge title="Tidak Aktif" type="error" />
				                	}
				                </td>
				                <td className="py-4 px-6 text-center">
									<div className="md:space-x-3 space-x-1">
										<div className="tooltip tooltip-bottom" data-tip="Ubah Status"><label htmlFor="modal-ubah-status"><ButtonIconOutline onClick={() => checkedStatusResto(obj)}><FiToggleRight size="16"/></ButtonIconOutline></label></div>
										<div className="tooltip tooltip-bottom" data-tip="Edit Resto"><Link to="/resto/edit" state={obj}><ButtonIconOutline><FiEdit3 size="16"/></ButtonIconOutline></Link></div>
										<div className="tooltip tooltip-bottom" data-tip="Hapus Resto"><ButtonIconOutline onClick={() => confirmDeleteData(obj.id)}><FiTrash2 size="16"/></ButtonIconOutline></div>
									</div>
				                </td>
				            </tr>
			        	)) : <tr><td className="py-4 px-6 text-center font-medium w-max" colSpan="5">Data Resto Kosong</td></tr>)}
			        	{isError && <tr><td className="py-4 px-6 text-center font-medium w-max" colSpan="5">Gagal Mengambil Data</td></tr>}
			        </tbody>
	        	</TableContent>
	        	<PaginationTable setLimit={setLimit} fromRow={fromRow} toRow={toRow} totalRows={totalRows} prevPageUrl={prevPageUrl} nextPageUrl={nextPageUrl} prevPage={prevPage} nextPage={nextPage}/>
        	</div>

			<Modal id="modal-ubah-status" showButtonConfirm={true} typeButtonConfirm="submit" titleButtonConfirm="Simpan" showButtonClose={true} titleModal="Ubah Status Resto" submitForm={handleSubmit(changeStatus)}>
			    <div className="flex mt-5 mb-3">

			    	<input type="hidden" id="id-produk" {...register('id_produk')}/>

			    	<div className="form-control flex-1 mr-4">
					  	<label className="label cursor-pointer">
						    <span className="label-text">Aktif</span> 
						    <input type="radio" id="status_resto_aktif" {...register('status_resto')} value="1" className="radio radio-secondary"/>
					    </label>
					</div>

					<div className="form-control flex-1 mr-4">
					  	<label className="label cursor-pointer">
						    <span className="label-text">Tidak Aktif</span> 
						    <input type="radio" id="status_resto_tidak_aktif" {...register('status_resto')} value="0" className="radio radio-secondary"/>
					   	</label>
					</div>

			    </div>
			</Modal>
        </>
    );
};

export default Resto;
