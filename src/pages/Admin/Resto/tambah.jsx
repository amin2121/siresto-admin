import React, {useState, useEffect} from 'react';

// component
import HeaderContent from '../../../layouts/HeaderContent'
import { Button } from '../../../components/Button'
import { Input, MessageError } from '../../../components/Input'

// icons
import { BsFillSave2Fill } from 'react-icons/bs'
import { MdOutlineCancel } from 'react-icons/md'
import { TiTimes } from 'react-icons/ti'

// library
import axios from '../../../utils/axios'
import { swNormal } from '../../../utils/sw'
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from 'react-router-dom'
import { useMutation, QueryClient } from 'react-query'
import AsyncCreatableSelect from 'react-select/async-creatable';
import { toastSuccess, toastError } from '../../../utils/toast'

const colourStyles = {
  control: styles => ({ ...styles, backgroundColor: 'white', height: '3rem', paddingLeft: '.5rem', paddingRight: '.5rem', borderRadius: '10px', borderWidth: '1px', borderColor: 'rgb(59 130 246 / 1)' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      // backgroundColor: isDisabled ? 'red' : 'blue',
      // color: '#FFF',
      cursor: isDisabled ? 'not-allowed' : 'default',
    };
  },
};

const Tambah = () => {
	const [isAction, setIsAction] = useState(false)
	const [isLoadingSelect, setIsLoadingSelect] = useState(true)
	const [isLoadingInsertKategoriBisnis, setIsLoadingInsertKategoriBisnis] = useState(false)
	const [isSuccessInsertKategoriBisnis, setIsSuccessInsertKategoriBisnis] = useState(false)
	const [isShowModal, setIsShowModal] = useState(false)
	const [valueInsertSelect, setValueInsertSelect] = useState('')
	const breadcrumbs = [
		{ link: '/', menu: 'Home' },
		{ link: '/resto', menu: 'Resto' },
		{ link: '/resto/tambah', menu: 'Tambah Resto' },
	]

	// show modal tambah kategori bisnis
	const queryClient = new QueryClient()
	const { register, handleSubmit, formState: { errors }, reset, clearErrors, control } = useForm()
	const navigate = useNavigate()

	const mutation = useMutation(async (data) => {
		data.kategori_bisnis = data.id_kategori_bisnis.label
		data.id_kategori_bisnis = data.id_kategori_bisnis.value

		const response = await axios.post('resto', data)
		const res = response.data

		if(res.meta.code != 200) {
			throw new Error(res.meta.message)
		}

		return res.data
	}, {
		onMutate: () => {
			setIsAction(!isAction)
		},
		onSettled : async (data, error) => {
			setIsAction(!isAction)

			if(data) {
				queryClient.invalidateQueries('data-resto')
				reset()
				clearErrors()
			}
		},
		onSuccess: async () => {
			navigate('/resto')
			toastSuccess('Resto Berhasil Ditambahkan')
		},
		onError: async () => {
			navigate('/resto')
			toastError('Resto Gagal Ditambahkan')
		}
	})

	const promiseOptions = async (inputValue) => {
		setIsLoadingSelect(!isLoadingSelect)
		const response = await axios.get('kategori-bisnis/all?s=' + inputValue)
		const res = await response.data.data

		return res
	}

	const addResto = async (data) => {
		await mutation.mutate(data)
	}

    return (
        <>
        	<HeaderContent linkBack="/resto" title="Tambah Resto" breadcrumbs={breadcrumbs}></HeaderContent>
		    	<div className="bg-white h-max px-6 rounded-lg mt-0 md:mt-4">
			    	<form onSubmit={handleSubmit(addResto)}>

				      	<div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
				      		<label className="label col-span-12 md:col-span-2">
					          <span className="label-text">Nama Pemilik</span>
					        </label>
				      		<div className="relative col-span-12 md:col-span-4">
										<Input type="text" placeholder="Nama Pemilik" name="nama_pemilik" control={control} required error={errors.nama_pemilik ? true : false}/>
										{errors.nama_pemilik && <MessageError>Nama Pemilik Tidak Boleh Kosong</MessageError>}
				      		</div>
								</div>

								<div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
				      		<label className="label col-span-12 md:col-span-2">
					          <span className="label-text">Nama Resto</span>
					        </label>
				      		<div className="relative col-span-12 md:col-span-4">
				      			<Input type="text" placeholder="Nama Resto" name="nama_resto" control={control} required error={errors.nama_resto ? true : false}/>
				      			{errors?.nama_resto && <MessageError>Nama Resto Tidak Boleh Kosong</MessageError>}
				      		</div>
								</div>

								<div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
				      		<label className="label col-span-12 md:col-span-2">
					          <span className="label-text">Kategori Bisnis</span>
					        </label>
				      		<div className="relative col-span-12 md:col-span-4">
				      			<Controller
							      name="id_kategori_bisnis"
							      control={control}
							      rules={{ required: true }}
							      render={({ field }) => (
							  		<AsyncCreatableSelect styles={colourStyles} cacheOptions defaultOptions isClearable loadOptions={promiseOptions} {...field}/>
							      )}
							    />
							    {errors?.id_kategori_bisnis && <MessageError>Kategori Bisnis Tidak Boleh Kosong</MessageError>}
				      		</div>
								</div>

								<div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
				      		<label className="label col-span-12 md:col-span-2">
					          <span className="label-text">Nomor Telepon</span>
					        </label>
				      		<div className="relative col-span-12 md:col-span-4">
				      			<Input type="number" placeholder="Nomor Telepon" name="nomor_telepon" control={control} required error={errors.nomor_telepon ? true : false}/>
				      			{errors?.nomor_telepon && <MessageError>Nomor Telepon Tidak Boleh Kosong</MessageError>}
				      		</div>
								</div>

								<div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
				      		<label className="label col-span-12 md:col-span-2">
					          <span className="label-text">Provinsi</span>
					        </label>
				      		<div className="relative col-span-12 md:col-span-4">
				      			<Input type="text" placeholder="Provinsi" name="provinsi" control={control} required error={errors.provinsi ? true : false}/>
				      			{errors?.provinsi && <MessageError>Provinsi Tidak Boleh Kosong</MessageError>}
				      		</div>
								</div>

								<div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
				      		<label className="label col-span-12 md:col-span-2">
					          <span className="label-text">Kota Asal</span>
					        </label>
				      		<div className="relative col-span-12 md:col-span-4">
				      			<Input type="text" placeholder="Kota Asal" name="kota" control={control} required error={errors.kota ? true : false}/>
				      			{errors?.kota && <MessageError>Kota Tidak Boleh Kosong</MessageError>}
				      		</div>
								</div>
						
								<div className="grid grid-cols-8 md:gap-4 mt-8 mb-8">
				      		<div className="relative col-span-12 gap-x-2 md:col-span-4 md:col-start-3">
				      			<Button className="text-xs" color="secondary" type="submit" startIcon={<BsFillSave2Fill size={16}/>} loading={isAction} title="Simpan" />
						        <Button className="text-xs" color="ghost" type="button" startIcon={<TiTimes size={16}/>} loading={false} title="Kembali" onClick={() => navigate('/resto')}/>
				      		</div>
								</div>

			    	</form>

		    	</div>

        </>
    );
};

export default Tambah;
