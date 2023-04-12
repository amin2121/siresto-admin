import React, { useState, useEffect, useRef } from 'react'

// components
import { Button, ButtonIconOutline } from '../../../components/Button'
import HeaderContent from '../../../layouts/HeaderContent'
import TableContent from '../../../layouts/TableContent'
import LoadingTable from '../../../components/LoadingTable'
import PaginationTable from '../../../components/PaginationTable'
import { Menu } from '@headlessui/react'

// icons
import { FiEdit3, FiTrash2, FiPlusCircle, FiSearch } from 'react-icons/fi'

// libraries
import axios from '../../../utils/axios'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { swNormal, swConfirm } from '../../../utils/sw'
import { useMutation, QueryClient, useQueryClient } from 'react-query'
import { toastSuccess, toastError } from '../../../utils/toast'
import DropdownTable from '../../../components/DropdownTable'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const KategoriProduk = () => {
	const [isShowModal, setIsShowModal] = useState(false)
	const user = JSON.parse(localStorage.getItem('user'))
	const breadcrumbs = [
		{ link: '/', menu: 'Home' },
		{ link: '/kategori-produk', menu: 'Kategori Produk' },
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
	} = useQuery(["data-kategori-produk", page], () => fetchData(), {
		staleTime: 15000, 
		refetchInterval: 15000, 
		keepPreviousData: true,
		refetchOnWindowFocus: false
	})

	const mutation = useMutation(async (id) => {
		axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
		const response = await axios.delete('kategori-produk/' + id)
		const res = response.data

		if(res.meta.code != 200) {
			throw new Error(res.meta.message)
		}

		return res.meta.code
	}, {
		onSettled: async (data, error) => {
			if(data == 200) {
				refetch()
			}
		},
		onSuccess: async () => {
			toastSuccess('Kategori Produk Berhasil Dihapus')
		},
		onError: async () => {
			toastError('Kategori Produk Gagal Dihapus')
		}
	})

	// fetch data
	const fetchData = async () => {
		axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
		const response = await axios.get(`kategori-produk?s=${keyword}&limit=${limit}&sort=DESC&page=${page}`)
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
        	<HeaderContent title="Kategori Produk" breadcrumbs={breadcrumbs}>
        		<div class="md:flex mt-4 md:mt-0 flex-1 md:space-x-3 block space-y-3 md:space-y-0">
	        		<div className="relative flex-1 w-full">
        				<div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
					    		<FiSearch size={20}/>
					  		</div>
	        			<input type="text" placeholder="Cari Kategori Produk" onBlur={(e) => setKeyword(e.target.value)} className="input input-bordered w-full pl-10 p-2.5 col-span-2" />
		      		</div>
	        		<div className="text-right">
	        			<Link to="/kategori-produk/tambah">
	        				<Button className="text-xs bg-custom-blue border-custom-blue" type="button" startIcon={<FiPlusCircle size={20}/>} loading={false} title="Tambah Kategori Produk"/>
	        			</Link>
	        		</div>
	        	</div>
        	</HeaderContent>
			    <div className="bg-white px-6 mt-4 mb-5">
			    	<TableContent>
				        <thead className="text-xs text-blue-500 bg-blue-50 uppercase">
				            <tr className="border-b border-blue-200">
				                <th scope="col" className="py-3 px-6 rounded-tl-md">
				                    No.
				                </th>
				                <th scope="col" className="py-3 px-6">
				                    Kategori Produk
				                </th>
				                <th scope="col" className="py-3 px-6 rounded-tr-md">
				                    Aksi
				                </th>
				            </tr>
				        </thead>
				        <tbody>
				        	{isLoading ? <LoadingTable colSpan="3"/> : (data.length > 0 ? data?.map((obj, key) => (
					            <tr className="bg-white border-b border-blue-200" key={key}>
					                <td className="py-4 px-6 whitespace-nowrap text-center">
					                    {++key}
					                </td>
					                <td className="py-4 px-6 text-center">
					                    {obj.kategori_produk}
					                </td>
					                <td className="py-4 px-6">
														<div className="md:space-x-3 space-x-1 text-center">
															<div className="tooltip tooltip-bottom" data-tip="Edit Kategori Produk"><Link to="/kategori-produk/edit" state={obj}><ButtonIconOutline><FiEdit3 size="16"/></ButtonIconOutline></Link></div>
															<div className="tooltip tooltip-bottom" data-tip="Hapus Kategori Produk"><ButtonIconOutline onClick={() => confirmDeleteData(obj.id)}><FiTrash2 size="16"/></ButtonIconOutline></div>
														</div>
					                </td>
					            </tr>
				        	)) : <tr><td className="py-4 px-6 text-center font-medium w-max" colSpan="5">Data Kategori Produk Kosong</td></tr>)}
				        	{isError && <tr><td className="py-4 px-6 text-center font-medium w-max" colSpan="5">Gagal Mengambil Data</td></tr>}
				        </tbody>
			    	</TableContent>
			    	<PaginationTable setLimit={setLimit} fromRow={fromRow} toRow={toRow} totalRows={totalRows} prevPageUrl={prevPageUrl} nextPageUrl={nextPageUrl} prevPage={prevPage} nextPage={nextPage}/>
			    </div>
        </>
    );
};

export default KategoriProduk;
