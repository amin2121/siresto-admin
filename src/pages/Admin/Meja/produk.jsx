import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import axios from '../../utils/axios'
import { swNormal, swConfirm } from '../../utils/sw'
import { useMutation, QueryClient, useQueryClient } from 'react-query'

import { HiPencil } from 'react-icons/hi'
import { BsFillTrash2Fill } from 'react-icons/bs'
import { MdPublishedWithChanges } from 'react-icons/md'
import { BiSearch, BiPlus, BiDotsHorizontalRounded } from 'react-icons/bi'
import { Breadcrumbs, Table, Dropdown, Badge, Button as ButtonDaisy } from 'react-daisyui'
import { rupiah } from '../../utils/strings'
import { Button } from '../../components/Button'
import Pagination from '../../components/Pagination'
import LoadingTable from '../../components/LoadingTable'

const Produk = () => {
	const [isShowModal, setIsShowModal] = useState(false)

	// pagination
	const [page, setPage] = useState(1)
	const [totalPage, setTotalPage] = useState(0)
	const [limit, setLimit] = useState(2)
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
	} = useQuery(["data-meja", page], () => fetchData(), {
		staleTime: 15000, 
		refetchInterval: 15000, 
		keepPreviousData: true,
		refetchOnWindowFocus: false
	})

	const deleteData = async (id) => {
		const response = await axios.delete('meja/' + id)
		const res = response.data

		if(res.meta.code != 200) {
			throw new Error(res.meta.message)
		}

		return res.meta.code
	}

	const mutation = useMutation(deleteData, {
		onMutate: () => {
			// spinner
			// setIsAction(!isAction)
		},
		onSettle: async (data, error) => {
			// setIsAction(!isAction)

			if(data == 200) {
				queryClient.invalidateQueries('data-meja')
			}
		},
		onSuccess: async () => {
			swNormal('Berhasil', 'Meja Berhasil Dihapus', 'success')
		},
		onError: async () => {
			swNormal('Gagal', 'Meja Gagal Dihapus', 'error')
		}
	})

	// fetch data
	const fetchData = async () => {
		const response = await axios.get(`meja?s=${keyword}&page=${page}&limit=${2}`)
		const res = await response.data.data
		const data = res.result

		setTotalPage(res.totalPage)
		
		return res
	}

	// refetch after searching
	useEffect(() => {
		refetch()
	}, [keyword])

	// pagination action
	const nextPage = () => setPage(page + 1)
	const prevPage = () => setPage(page - 1)

	const confirmDeleteData = (id) => {
		const confirm = swConfirm()
		confirm.then(result => {
			if (result.isConfirmed) {
			    mutation.mutate(id)
			}
		})
	}

    return (
        <div>
        	<div className="flex justify-between w-full items-center">
	        	<div>
	        		<h2 className="text-lg mt-4 mb-0 font-semibold">Meja</h2>
		        	<Breadcrumbs className="text-xs">
				      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
				      <Breadcrumbs.Item href="/meja">Meja</Breadcrumbs.Item>
				    </Breadcrumbs>
	        	</div>
	        	<div>
        			<Link to="/meja/tambah">
        				<Button title="Tambah Data" icon={<BiPlus size={20}/>} onClick={() => setIsShowModal(!isShowModal)}/>
        			</Link>
	        	</div>
        	</div>
		    <div className="bg-white h-max p-8 rounded-lg mt-4">
		      	<div className="grid grid-cols-8 gap-4 mb-6">
		      		<div className="relative col-span-3">
		      			<div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
					    	<BiSearch/>
					  	</div>
					  	<input type="text" id="input-search" className={`bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 col-span-2`} placeholder="Cari Produk" onBlur={(e) => setKeyword(e.target.value)}/>
		      		</div>
				</div>
				<div className="overflow-x-auto relative">
				    <table className="w-full text-sm text-left">
				        <thead className="text-xs text-gray-400 bg-gray-50">
				            <tr>
				                <th scope="col" className="py-3 px-6">
				                    No.
				                </th>
				                <th scope="col" className="py-3 px-6">
				                    Nama Produk
				                </th>
				                <th scope="col" className="py-3 px-6">
				                    Nomor SKU
				                </th>
				                <th scope="col" className="py-3 px-6">
				                    Harga Produk
				                </th>
				                <th scope="col" className="py-3 px-6">
				                    Status Aktif
				                </th>
				                <th scope="col" className="py-3 px-6">
				                    Aksi
				                </th>
				            </tr>
				        </thead>
				        <tbody>
				        	{isFetching ? <tr className="bg-white border-b"><td colSpan="6" className="text-center py-6 px-6"><LoadingTable/></td></tr> : (data.result.length > 0 ? data.result?.map((obj, key) => (
					            <tr className="bg-white border-b" key={key}>
					                <td className="py-4 px-6 whitespace-nowrap">
					                    {++key}
					                </td>
					                <td className="py-4 px-6">
					                    {obj.nama_produk}
					                </td>
					                <td className="py-4 px-6">
					                    {obj.nomor_sku}
					                </td>
					                <td className="py-4 px-6">
					                    {rupiah(obj.harga_produk)}
					                </td>
					                <td className="py-4 px-6">
					                	{obj.is_enabled == '1' ? <Badge color="success" className="text-xs text-white">Aktif</Badge> : <Badge color="error" className="text-xs text-white">Tidak Aktif</Badge>
					                	}
					                </td>
					                <td className="py-4 px-6">
					                	<div className="grid grid-cols-2 gap-8">
						                	<Link to="/produk/edit" state={obj}>
						                		<HiPencil className="text-yellow-400 cursor-pointer"/>
						                	</Link>
						                	<BsFillTrash2Fill onClick={() => confirmDeleteData(obj.id)} className="text-red-400 cursor-pointer"/>
					                	</div>
					                </td>
					            </tr>
				        	)) : <tr><td className="py-4 px-6 text-center font-medium w-max" colSpan="5">Data Produk Kosong</td></tr>)}
				        	{isError && <tr><td className="py-4 px-6 text-center font-medium w-max" colSpan="5">Gagal Mengambil Data</td></tr>}
				        </tbody>
				    </table>
				</div>
				<Pagination
					totalPage={totalPage}
					active={page}
					onPreviousPage={prevPage}
					onNextPage={nextPage}
				/>
		    </div>

        </div>
    );
};

export default Produk;
