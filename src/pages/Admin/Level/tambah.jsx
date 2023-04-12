import React, {useState} from 'react';

// components
import HeaderContent from '../../../layouts/HeaderContent'
import { Button } from '../../../components/Button'
import { Input, InputCurrency, MessageError } from '../../../components/Input'

// icons
import { BsFillSave2Fill } from 'react-icons/bs'
import { MdOutlineCancel } from 'react-icons/md'
import { TiTimes } from 'react-icons/ti'

// libraries
import axios from '../../../utils/axios'
import { swNormal } from '../../../utils/sw'
import { rupiahToNumber } from '../../../utils/strings'
import { useMutation, QueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from "react-hook-form";
import AsyncCreatableSelect from 'react-select/async-creatable';

const Tambah = () => {
	const navigate = useNavigate()
	const queryClient = new QueryClient()
	const [isAction, setIsAction] = useState(false)
	const [statusDiskon, setStatusDiskon] = useState(0)
	const [errMessage, setErrMessage] = useState("")
	const [imageBase64, setImageBase64] = useState('')
	const [isLoadingSelect, setIsLoadingSelect] = useState(true)
	const breadcrumbs = [
		{ link: '/', menu: 'Home' },
		{ link: '/level', menu: 'Level' },
		{ link: '/level/tambah-level', menu: 'Tambah Level' },
	]

	const { register, handleSubmit, formState: { errors }, reset, clearErrors, control } = useForm();

	const mutation = useMutation(async (data) => {
		const response = await axios.post('level', data)
		const res = response.data

		if(res.meta.code != 200) {
			throw new Error(res.meta.message)
		}

		return res.data
	}, {
		onMutate: () => {
			// spinner
			setIsAction(!isAction)
		},
		onSettled : async (data, error) => {
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
			swNormal('Berhasil', 'Level Berhasil Ditambahkan', 'success')
		},
		onError: async () => {
			navigate('/level')
			swNormal('Gagal', 'Level Gagal Ditambahkan', 'error')
		}
	})

	const addData = async (data) => {
		await mutation.mutate(data)
	}

    return (
        <React.Fragment>
        	<HeaderContent linkBack="/level" title="Tambah Level" breadcrumbs={breadcrumbs}></HeaderContent>
		    <div className="bg-white h-max px-6 rounded-lg mt-4">
		    	<form onSubmit={handleSubmit(addData)}>

			      	<div className="grid grid-cols-8 gap-4 mb-4">
			      		<label className="label col-span-2">
				          <span className="label-text">Level</span>
				        </label>
			      		<div className="relative col-span-4">
			      			<Input type="text" placeholder="Level" name="level" control={control} rules={{required: true}} error={errors.level ? true : false}/>
			      			{errors?.level && <MessageError>Level Tidak Boleh Kosong</MessageError>}
			      		</div>
					</div>
					
					<div className="grid grid-cols-8 gap-4 mb-4">
			      		<div className="relative col-span-4 col-start-3">
			      			<Button className="text-xs mr-2" color="secondary" type="submit" startIcon={<BsFillSave2Fill size={16}/>} loading={isAction} title="Simpan" />
					        <Button className="text-xs" color="ghost" type="button" startIcon={<TiTimes size={16}/>} loading={false} title="Kembali" onClick={() => navigate('/level')}/>
			      		</div>
					</div>

		    	</form>

		    </div>
  
        </React.Fragment>
    );
};

export default Tambah;
