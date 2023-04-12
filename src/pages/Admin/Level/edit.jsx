import React, { useState, useEffect } from 'react';

// components
import { Button } from '../../../components/Button'
import HeaderContent from '../../../layouts/HeaderContent'
import { Input, InputCurrency, MessageError } from '../../../components/Input'

// icons
import { BsFillSave2Fill } from 'react-icons/bs'
import { MdOutlineCancel } from 'react-icons/md'
import { TiTimes } from 'react-icons/ti'

// libraries
import axios from '../../../utils/axios'
import { swNormal } from '../../../utils/sw'
import { getBase64 } from '../../../utils/image'
import { rupiahToNumber } from '../../../utils/strings'
import { useMutation, QueryClient } from 'react-query'
import { useForm, Controller } from "react-hook-form"
import { useNavigate, useLocation } from 'react-router-dom'
import AsyncCreatableSelect from 'react-select/async-creatable';

const Edit = () => {
	const location = useLocation()
	const data = location.state

	const [errMessage, setErrMessage] = useState("")
	const [imageBase64, setImageBase64] = useState("")
	const [isAction, setIsAction] = useState(false)
	const [isLoadingSelect, setIsLoadingSelect] = useState(true)
	const queryClient = new QueryClient()
	const navigate = useNavigate()
	const breadcrumbs = [
		{ link: '/', menu: 'Home' },
		{ link: '/level', menu: 'Level' },
		{ link: '/level/edit', menu: 'Edit Level' },
	]

	const { register, handleSubmit, formState: { errors }, reset, clearErrors, control, setValue } = useForm();

	useEffect(() => {
		setValue('id', data.id)
		setValue('level', data.level)
	}, [])

	const submitData = async (data) => {
		const response = await axios.put('level/' + data.id, data)
		const res = response.data

		if(res.meta.code != 200) {
			throw new Error(res.meta.message)
		}

		return res.data
	}

	const mutation = useMutation(submitData, {
		onMutate: () => {
			// spinner
			setIsAction(!isAction)
		},
		onSettled: async (data, error) => {
			setIsAction(!isAction)

			if(data) {
				queryClient.invalidateQueries('data-level')
				reset()
				setErrMessage("")
				clearErrors()
			}

			if(error) {
				setErrMessage(error.message)
			}

		},
		onSuccess: async () => {
			navigate('/level')
			swNormal('Berhasil', 'Level Berhasil Diedit', 'success')
		},
		onError: async () => {
			navigate('/level')
			swNormal('Gagal', 'Level Gagal Diedit', 'error')
		}
	})

	const editData = async (data) => {
		await mutation.mutate(data)
	}

	const convertImageToBase64 = (e) => {
		let file = e.target.files[0]

		getBase64(file)
	    .then(result => {
	      	setImageBase64(result)
	    }).catch(err => {
	    	console.log(err)
	    });
	}

    return (
        <div>
        	<HeaderContent linkBack="/level" title="Edit Level" breadcrumbs={breadcrumbs}></HeaderContent>
		    <div className="bg-white h-max px-6 rounded-lg mt-4">
		    	<form onSubmit={handleSubmit(editData)}>
		    		<input type="hidden" name="id" {...register("id")}/>

			      	<div className="grid grid-cols-8 gap-4 mb-4">
			      		<label className="label col-span-2">
				          <span className="label-text">Level</span>
				        </label>
			      		<div className="relative col-span-4">
			      			<Input type="text" placeholder="Level" name="level" control={control} rules={{ required : true }} error={errors.level ? true : false}/>
			      			{errors?.level && <MessageError>Level Tidak Boleh Kosong</MessageError>}
			      		</div>
					</div>
						
					<div className="grid grid-cols-8 gap-4 mb-4 mt-8">
			      		<div className="relative col-span-4 col-start-3">
			      			<Button className="text-xs mr-2" color="secondary" type="submit" startIcon={<BsFillSave2Fill size={16}/>} loading={isAction} title="Simpan" />
					        <Button className="text-xs" color="ghost" type="button" startIcon={<TiTimes size={16}/>} loading={false} title="Kembali" onClick={() => navigate('/level')}/>
			      		</div>
					</div>

		    	</form>

		    </div>
  
        </div>
    );
};

export default Edit;
