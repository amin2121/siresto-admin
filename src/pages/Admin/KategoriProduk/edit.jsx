import React, { useState, useEffect } from 'react';

// components
import { Button } from '../../../components/Button'
import HeaderContent from '../../../layouts/HeaderContent'
import { InputGroup, Input, MessageError } from '../../../components/Input'

// icons
import { FiSave, FiXCircle } from 'react-icons/fi'

// libraries
import axios from '../../../utils/axios'
import { swNormal } from '../../../utils/sw'
import { useMutation, QueryClient } from 'react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { toastSuccess, toastError } from '../../../utils/toast'

const Edit = () => {
	const [isAction, setIsAction] = useState(false)
	const [errMessage, setErrMessage] = useState("")
	const user = JSON.parse(localStorage.getItem('user'))
	const queryClient = new QueryClient()
	const navigate = useNavigate()
	const location = useLocation()
	const data = location.state
	const breadcrumbs = [
		{ link: '/', menu: 'Home' },
		{ link: '/kategori-produk', menu: 'Kategori Produk' },
		{ link: '/kategori-produk/edit', menu: 'Edit Kategori Produk' },
	]

	const { register, handleSubmit, formState: { errors }, reset, clearErrors, control, setValue } = useForm();

	useEffect(() => {
		setValue('id', data.id)
		setValue('kategori_produk', data.kategori_produk)
	}, [])

	const submitData = async (data) => {
		const config = {     
		    headers: {
		    	Authorization: `Bearer ${user.token}`
		    }
		}

		const response = await axios.put('kategori-produk/' + data.id, data, config)
		const res = response.data

		if(res.meta.code != 200) {
			throw new Error(res.meta.message)
		}

		return res.data
	}

	const mutation = useMutation(submitData, {
		onMutate: () => {
			// spinner
			setIsAction(true)
		},
		onSettled: async (data, error) => {
			setIsAction(false)

			if(data) {
				queryClient.invalidateQueries('data-kategori-produk')
				reset()
				clearErrors()
			}
		},
		onSuccess: async () => {
			navigate('/kategori-produk')
			toastSuccess('Kategori Produk Berhasil Diedit')
		},
		onError: async () => {
			navigate('/kategori-produk')
			toastError('Kategori Produk Gagal Diedit')
		}
	})

	const editData = async (data) => {
		await mutation.mutate(data)
	}

    return (
        <>
        	<HeaderContent linkBack="/kategori-produk" title="Edit Kategori Produk" breadcrumbs={breadcrumbs} />
		    <div className="bg-white h-max px-6 rounded-lg mt-0 md:mt-4">
		    	<form onSubmit={handleSubmit(editData)}>
		    		<input type="hidden" name="id" {...register("id")}/>
		    		
			      	<div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
			      		<label className="label col-span-12 md:col-span-2">
				          <span className="label-text">Kategori Produk</span>
				        </label>
			      		<div className="relative col-span-12 md:col-span-4">
			      			<Input type="text" placeholder="Kategori Produk" name="kategori_produk" control={control} rules={{ required: true }} error={errors.kategori_produk ? true : false}/>
							{errors.kategori_produk && <MessageError>Kategori Produk Tidak Boleh Kosong</MessageError>}
			      		</div>
					</div>

					<div className="grid grid-cols-8 md:gap-4 mt-8 mb-8">
			      		<div className="relative col-span-12 gap-x-2 md:col-span-4 md:col-start-3">
			      			<Button className="text-xs mr-2 bg-custom-blue border-custom-blue" type="submit" startIcon={<FiSave size={20}/>} loading={isAction} title="Simpan" />
					        <Button className="text-xs" color="ghost" type="button" startIcon={<FiXCircle size={20}/>} loading={false} title="Kembali" onClick={() => navigate('/kategori-produk')}/>
			      		</div>
					</div>

		    	</form>

		    </div>
  
        </>
    );
};

export default Edit;
