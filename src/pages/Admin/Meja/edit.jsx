import React, { useState, useEffect } from 'react';

// components
import { Button } from '../../../components/Button'
import HeaderContent from '../../../layouts/HeaderContent'
import { Input, InputCurrency, MessageError } from '../../../components/Input'

// icons
import { FiSave, FiXCircle } from 'react-icons/fi'

// libraries
import axios from '../../../utils/axios'
import { swNormal } from '../../../utils/sw'
import { getBase64 } from '../../../utils/image'
import { rupiahToNumber } from '../../../utils/strings'	
import { useMutation, QueryClient } from 'react-query'
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLocation } from 'react-router-dom'
import AsyncCreatableSelect from 'react-select/async-creatable';
import { toastSuccess, toastError } from '../../../utils/toast'

const colourStyles = {
  control: styles => ({ ...styles, backgroundColor: 'white', height: '3rem', paddingLeft: '1rem', paddingRight: '1rem', borderRadius: '10px', borderWidth: '1px', borderColor: 'rgb(59 130 246 / 1)' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      // backgroundColor: isDisabled ? 'red' : 'blue',
      // color: '#FFF',
      cursor: isDisabled ? 'not-allowed' : 'default',
    };
  },
};

const Edit = () => {
	const [isAction, setIsAction] = useState(false)
	const user = JSON.parse(localStorage.getItem('user'))
	const [errMessage, setErrMessage] = useState("")
	const queryClient = new QueryClient()
	const navigate = useNavigate()
	const location = useLocation()
	const data = location.state
	const breadcrumbs = [
		{ link: '/', menu: 'Home' },
		{ link: '/meja', menu: 'Meja' },
		{ link: '/meja/edit', menu: 'Edit Meja' },
	]

	const { register, handleSubmit, formState: { errors }, reset, clearErrors, control, setValue } = useForm();

	useEffect(() => {
		setValue('id', data.id)
		setValue('id_resto', { label: data.resto.nama_resto, value: data.id_resto })
		setValue('no_meja', data.no_meja)
	}, [])

	const mutation = useMutation(async(data) => {
		const config = {     
		    headers: {
		    	Authorization: `Bearer ${user.token}`
		    }
		}

		const response = await axios.put('meja/' + data.id, data, config)
		const res = response.data

		if(res.meta.code != 200) {
			throw new Error(res.meta.message)
		}

		return res.data
	}, {
		onMutate: () => {
			// spinner
			setIsAction(true)
		},
		onSettled: async (data, error) => {
			setIsAction(false)

			if(data) {
				queryClient.invalidateQueries('data-meja')
				reset()
				clearErrors()
			}

		},
		onSuccess: async () => {
			navigate('/meja')
			toastSuccess('Meja Berhasil Diedit')
		},
		onError: async () => {
			navigate('/meja')
			toastError('Meja Gagal Diedit')
		}
	})

	const editData = async (data) => {
		await mutation.mutate(data)
	}

    return (
        <>
	    		<HeaderContent linkBack="/meja" title="Edit Meja" breadcrumbs={breadcrumbs} />
			    <div className="bg-white h-max px-6 rounded-lg mt-0 md:mt-4">
			    	<form onSubmit={handleSubmit(editData)}>
			    		<input type="hidden" name="id" {...register("id")}/>

			      	<div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
			      		<label className="label col-span-12 md:col-span-2">
				          <span className="label-text">No Meja</span>
				        </label>
			      		<div className="relative col-span-12 md:col-span-4">
						  	<Input type="text" placeholder="Nomor Meja" name="no_meja" control={control} rules={{required: true}} error={errors.no_meja ? true : false}/>
			      			{errors?.no_meja && <MessageError>Nomor Meja Tidak Boleh Kosong</MessageError>}
			      		</div>
							</div>

							<div className="grid grid-cols-8 md:gap-4 mt-8 mb-8">
			      		<div className="relative col-span-12 gap-x-2 md:col-span-4 md:col-start-3">
			      			<Button className="text-xs mr-2 bg-custom-blue border-custom-blue" type="submit" startIcon={<FiSave size={20}/>} loading={isAction} title="Simpan" />
					        <Button className="text-xs" color="ghost" type="button" startIcon={<FiXCircle size={20}/>} loading={false} title="Kembali" onClick={() => navigate('/meja')}/>
			      		</div>
							</div>

			    	</form>

			    </div>
  
        </>
    );
};

export default Edit;
