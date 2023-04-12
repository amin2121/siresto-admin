import React, { useState, useEffect } from 'react';

// components
import HeaderContent from '../../../layouts/HeaderContent'
import AsyncCreatableSelect from 'react-select/async-creatable'
import LoadingPage from '../../../components/LoadingPage'
import { Button } from '../../../components/Button'
import { Input, InputCurrency, MessageError, Textarea } from '../../../components/Input'

// icons
import { BsFillSave2Fill } from 'react-icons/bs'
import { MdOutlineCancel } from 'react-icons/md'
import { FiSave, FiXCircle } from 'react-icons/fi'

// libraries
import axios from '../../../utils/axios'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from "react-hook-form";
import { swNormal } from '../../../utils/sw'
import { useMutation, QueryClient, useQueryClient, useQuery } from 'react-query'
import { toastSuccess, toastError } from '../../../utils/toast'
import { useDropzone } from 'react-dropzone';

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

const KonfigurasiResto = () => {
	const [imageBase64, setImageBase64] = useState('')
	const [isLoadingSelect, setIsLoadingSelect] = useState(true)
	const user = JSON.parse(localStorage.getItem('user'))
	const [isAction, setIsAction] = useState(false)
	const { register, handleSubmit, formState: { errors }, reset, clearErrors, setValue, control, setFocus } = useForm();
	const navigate = useNavigate()
	const breadcrumbs = [
		{ link: '/', menu: 'Home' },
		{ link: '/konfigurasi-resto', menu: 'Konfigurasi Resto' },
	]

	// dropzone
	const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
		accept: {
			'image/*': []
		}
	});

	useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => acceptedFiles.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);

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
	} = useQuery(["data-konfigurasi-resto"], () => fetchData(), {
		refetchOnWindowFocus: true
	})

	const mutation = useMutation(async (data) => {
		data.logo = imageBase64
		data.kategori_bisnis = data.id_kategori_bisnis.label
		data.id_kategori_bisnis = data.id_kategori_bisnis.value

		axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
		const response = await axios.put('setting/profile', data)
		const res = response.data

		if(res.meta.code != 200) {
			throw new Error(res.meta.message)
		}

		return res.data
	}, {
		onMutate: () => {
			setIsAction(true)
		},
		onSettled : async (data, error) => {
			setIsAction(false)

			if(data) {
				clearErrors()
			}
		},
		onSuccess: async () => {
			setIsAction(false)
			toastSuccess('Konfigurasi Profile Resto Berhasil')
		},
		onError: async () => {
			setIsAction(false)
			toastError('Konfigurasi Profile Resto Gagal, Silahkan Coba Lagi')
		}
	})

	const konfigurasiResto = async (data) => {
		await mutation.mutate(data)
	}

	const promiseOptions = async (inputValue) => {
		setIsLoadingSelect(!isLoadingSelect)
		const response = await axios.get('kategori-bisnis/all?s=' + inputValue)
		const res = await response.data.data

		return res
	}

	const getBase64 = file => {
	    return new Promise(resolve => {
	      let baseURL = "";
	      // Make new FileReader
	      let reader = new FileReader();

	      // Convert the file to base64 text
	      reader.readAsDataURL(file);

	      // on reader load somthing...
	      reader.onload = () => {
	        // Make a fileInfo Object
	        baseURL = reader.result;
	        resolve(baseURL);
	      };
	    });
	};

	const convertImageToBase64 = (e) => {
		let file = e.target.files[0]

		getBase64(file)
	    .then(result => {
	      	setImageBase64(result)
	    }).catch(err => {
	    	console.log(err)
	    });
	}

	// fetch data
	const fetchData = async () => {
		axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
		const response = await axios.get(`setting/profile`)
		const res = await response.data.data

		setValue('logo_lama', res.logo_lama || "")
		setValue('nama_lengkap', res.nama_pemilik || "")
		setValue('id_kategori_bisnis', { label: res.kategori_bisnis.kategori_bisnis || "", value: res.id_kategori_bisnis || "" })
		setValue('nama_resto', res.nama_resto || "")
		setValue('nomor_telepon_aktif', res.nomor_telepon || "")
		setValue('email', res.email || "")
		setValue('jam_buka', res.jam_buka || "")
		setValue('jam_tutup', res.jam_tutup || "")
		setValue('alamat_lengkap', res.alamat_lengkap || "")
		setValue('kota', res.kota || "")
		setValue('provinsi', res.provinsi || "")

		return res
	}

	const files = acceptedFiles.map((file, key) => {
		getBase64(file)
    .then(result => {
      	setImageBase64(result)
    }).catch(err => {
    	console.log(err)
    });

		return (
			<img 
	  		key={key}
				src={URL.createObjectURL(file)} 
				alt={file} 
				// Revoke data uri after image is loaded
				onLoad={() => { URL.revokeObjectURL(file) }}
			/>
		)
	});

	if(isLoading) return <div className="flex-1 flex justify-center items-center flex-col space-y-3"><LoadingPage /></div>

  return (
      	<React.Fragment>
      		<HeaderContent title="Konfigurasi Resto" breadcrumbs={breadcrumbs} />
			    <div className="bg-white h-max px-6 rounded-lg mt-4">
			    	<h2 className="py-4 text-lg font-semibold">Profile Resto</h2>
			    	<div className="py-4">
						<form onSubmit={handleSubmit(konfigurasiResto)} encType="multipart/form-data">

							<div className="grid grid-cols-8 gap-4 mb-4">
			      		<label className="label col-span-2">
				          <span className="label-text">Logo</span>
				        </label>
				        <div className="relative col-span-4">
		      				<div {...getRootProps({className: 'dropzone'})}>
								    <div className="flex justify-center w-full h-32 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
								        {
								        	(acceptedFiles.length > 0)
								        	? files 
								        	: <span className="flex items-center space-x-2">
								            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24"
								                stroke="currentColor" strokeWidth="2">
								                <path strokeLinecap="round" strokeLinejoin="round"
								                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
								            </svg>
								            <span className="font-medium text-gray-600">
						                	Drop files to Attach, or
						                	<span className="text-blue-600 underline"> browse</span>
						            		</span>
								        	</span>
								      	}
								        <input type="file" name="file_upload" className="hidden" {...getInputProps()}/>
								    </div>
				        	</div>
								</div>
							</div>

			      	<div className="grid grid-cols-8 gap-4 mb-4">
			      		<label className="label col-span-2">
				          <span className="label-text">Nama Owner/Pemilik</span>
				        </label>
			      		<div className="relative col-span-4">
			      			<Input type="text" placeholder="Nama Lengkap" name="nama_lengkap" control={control} rules={{required: true}} error={errors.nama_lengkap ? true : false}/>
			      			{errors?.nama_lengkap && <span className="text-red-400 block mt-2">Nama Owner/Pemilik Tidak Boleh Kosong</span>}
			      		</div>
							</div>

			      	<div className="grid grid-cols-8 gap-4 mb-4">
			      		<label className="label col-span-2">
				          <span className="label-text">Nama Resto</span>
				        </label>
			      		<div className="relative col-span-4">
			      			<Input type="text" placeholder="Nama Resto" name="nama_resto" control={control} rules={{required: true}} error={errors.nama_resto ? true : false}/>
			      			{errors?.nama_resto && <span className="text-red-400 block mt-2">Nama Resto Tidak Boleh Kosong</span>}
			      		</div>
							</div>

							<div className="grid grid-cols-8 gap-4 mb-4">
			      		<label className="label col-span-2">
				          <span className="label-text">Kategori Bisnis</span>
				        </label>
			      		<div className="relative col-span-4">
									<Controller
								      name="id_kategori_bisnis"
								      control={control}
								      rules={{ required: true }}
								      render={({ field }) => (
							  			<AsyncCreatableSelect styles={colourStyles} cacheOptions defaultOptions isClearable loadOptions={promiseOptions} {...field}/>
								      )}
								    />
					      		{errors?.id_kategori_bisnis && <span className="text-red-400 block mt-2">Kategori Bisnis Tidak Boleh Kosong</span>}
			      		</div>
							</div>

			      	<div className="grid grid-cols-8 gap-4 mb-4">
			      		<label className="label col-span-2">
				          <span className="label-text">Nomor Handphone Aktif</span>
				        </label>
			      		<div className="relative col-span-4">
						  	<Input type="number" placeholder="Nomor Handphone Aktif" name="nomor_telepon_aktif" control={control} rules={{required: true}} error={errors.nomor_telepon_aktif ? true : false}/>
			      			{errors?.nomor_telepon_aktif && <span className="text-red-400 block mt-2">Nomor Telepon Aktif Tidak Boleh Kosong</span>}
			      		</div>
							</div>

			      	<div className="grid grid-cols-8 gap-4 mb-4">
			      		<label className="label col-span-2">
				          <span className="label-text">Email</span>
				        </label>
			      		<div className="relative col-span-4">
			      			<Input type="text" placeholder="Email" name="email" control={control} rules={{required: true}} error={errors.email ? true : false}/>
	      					{errors?.email && <span className="text-red-400 block mt-2">Email Tidak Boleh Kosong</span>}
			      		</div>
							</div>

			      	<div className="grid grid-cols-8 gap-4 mb-4">
			      		<label className="label col-span-2">
				          <span className="label-text">Jam Buka/Tutup</span>
				        </label>
			      		<div className="grid col-span-4 grid-cols-6 gap-4">
			      			<div className="col-span-3">
							  	<Input type="time" placeholder="08:00" name="jam_buka" control={control} rules={{required: true}} error={errors.jam_buka ? true : false}/>
		      					{errors?.jam_buka && <span className="text-red-400 block mt-2">Jam Buka Tidak Boleh Kosong</span>}
			      			</div>
			      			<div className="col-span-3">
							  	<Input type="time" placeholder="16:00" name="jam_tutup" control={control} rules={{required: true}} error={errors.jam_tutup ? true : false}/>
		      					{errors?.jam_tutup && <span className="text-red-400 block mt-2">Jam Tutup Tidak Boleh Kosong</span>}
			      			</div>
			      		</div>
							</div>

							<div className="grid grid-cols-8 gap-4 mb-4">
			      		<label className="label col-span-2">
				          <span className="label-text">Alamat Lengkap</span>
				        </label>
			      		<div className="relative col-span-4">
						  	<Textarea placeholder="Alamat Lengkap" name="alamat_lengkap" control={control} rules={{required: true}} error={errors.alamat_lengkap ? true : false}></Textarea>
	      					{errors?.alamat_lengkap && <span className="text-red-400 block mt-2">Alamat Lengkap Tidak Boleh Kosong</span>}
			      		</div>
							</div>

							<div className="grid grid-cols-8 gap-4 mb-4">
			      		<label className="label col-span-2">
				          <span className="label-text">Kota</span>
				        </label>
			      		<div className="relative col-span-4">
						  	<Input type="text" placeholder="Kota" name="kota" control={control} rules={{required: true}} error={errors.kota ? true : false}/>
			      			{errors?.kota && <span className="text-red-400 block mt-2">Kota Tidak Boleh Kosong</span>}
			      		</div>
							</div>

							<div className="grid grid-cols-8 gap-4 mb-4">
			      		<label className="label col-span-2 ">
				          <span className="label-text">Provinsi</span>
				        </label>
			      		<div className="relative col-span-4">
						  	<Input type="text" placeholder="Provinsi" name="provinsi" control={control} rules={{required: true}} error={errors.provinsi ? true : false}/>
					      	{errors?.provinsi && <span className="text-red-400 block mt-2">Provinsi Tidak Boleh Kosong</span>}
			      		</div>
							</div>

							<div className="grid grid-cols-8 gap-4 mb-4">
			      		<div className="relative col-span-4 col-start-3">
			      			<Button className="text-xs mr-2" color="secondary" type="submit" startIcon={<FiSave size={20}/>} loading={isAction} title="Simpan" />
			      		</div>
			      	</div>

						</form>
			    		
			    	</div>
			    </div>

        </React.Fragment>
    );
};

export default KonfigurasiResto;
