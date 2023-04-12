import React, {useState, useEffect} from 'react';
import './produk.css'

// components
import HeaderContent from '../../../layouts/HeaderContent'
import { Button } from '../../../components/Button'
import { Input, InputCurrency, MessageError } from '../../../components/Input'

// icons
import { FiSave, FiXCircle } from 'react-icons/fi'

// libraries
import axios from '../../../utils/axios'
import { rupiahToNumber } from '../../../utils/strings'
import { useMutation, QueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from "react-hook-form";
import AsyncCreatableSelect from 'react-select/async-creatable';
import { toastSuccess, toastError } from '../../../utils/toast'
import { useDropzone } from 'react-dropzone';

const colourStyles = {
  control: styles => ({ ...styles, backgroundColor: 'white', height: '3rem', paddingLeft: '.5rem', paddingRight: '.5rem', borderRadius: '10px', borderWidth: '1px', borderColor: 'rgb(59 130 246 / 1)' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      cursor: isDisabled ? 'not-allowed' : 'default',
    };
  },
};

const Tambah = () => {
	const navigate = useNavigate()
	const queryClient = new QueryClient()
	const user = JSON.parse(localStorage.getItem('user'))
	const [isAction, setIsAction] = useState(false)
	const [statusDiskon, setStatusDiskon] = useState(0)
	const [errMessage, setErrMessage] = useState("")
	const [imageBase64, setImageBase64] = useState('')
	const [isLoadingSelect, setIsLoadingSelect] = useState(true)
	const breadcrumbs = [
		{ link: '/', menu: 'Home' },
		{ link: '/produk', menu: 'Produk' },
		{ link: '/produk/tambah', menu: 'Tambah Produk' },
	]

	const { register, handleSubmit, formState: { errors }, reset, clearErrors, control, setFocus } = useForm();

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

	const mutation = useMutation(async (data) => {
		data.harga_awal = rupiahToNumber(data.harga_awal)
		data.harga_jual = rupiahToNumber(data.harga_jual)
		data.diskon = rupiahToNumber(document.getElementById('input-diskon').value || 0)
		data.status_diskon = statusDiskon
		data.id_kategori_produk = data.id_kategori_produk.value
		data.gambar_produk = imageBase64

		let formData = new FormData();
		formData.append('nama_produk', data.nama_produk);
		formData.append('nomor_sku', data.nomor_sku);
		formData.append('kategori_produk', data.kategori_produk);
		formData.append('id_kategori_produk', data.id_kategori_produk);
		formData.append('gambar_produk', data.gambar_produk);
		formData.append('harga_awal', data.harga_awal);
		formData.append('harga_jual', data.harga_jual);
		formData.append('diskon', data.diskon);
		formData.append('status_diskon', data.status_diskon);

		const config = {     
		    headers: { 
		    	contentType: 'multipart/form-data',
		    	Authorization: `Bearer ${user.token}`
		    }
		}

		const response = await axios.post('produk', formData, config)
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
				queryClient.invalidateQueries('data-produk')
				reset()
				setErrMessage("")
				clearErrors()
			}

			if(error) {
				setErrMessage(error.message)
			}
		},
		onSuccess: async () => {
			navigate('/produk')
			toastSuccess('Produk Berhasil Ditambahkan')
		},
		onError: async () => {
			navigate('/produk')
			toastError('Produk Gagal Ditambahkan')
		}
	})

	const getBase64 = file => {
    return new Promise(resolve => {
      let fileInfo;
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

	const addData = async (data) => {
		await mutation.mutate(data)
	}

	const showHargaDiskon = (e) => {
		let inputHargaDiskon = document.getElementById('content-harga-diskon')

		if(e.target.checked) {
			setStatusDiskon(1)
			inputHargaDiskon.classList.add('block')
			inputHargaDiskon.classList.remove('hidden')
		} else {
			setStatusDiskon(0)
			inputHargaDiskon.classList.add('hidden')
			inputHargaDiskon.classList.remove('block')
		}
	}

	const promiseOptions = async (inputValue) => {
		setIsLoadingSelect(!isLoadingSelect)
		const response = await axios.get('kategori-produk/all?s=' + inputValue)
		const res = await response.data.data

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

	useEffect(() => {
		setFocus('nama_produk')
	}, [setFocus])

    return (
        <>
        	<HeaderContent linkBack="/produk" title="Tambah Produk" breadcrumbs={breadcrumbs}></HeaderContent>
		    	<div className="bg-white h-max px-6 rounded-lg mt-0 md:mt-4">
			    	<form onSubmit={handleSubmit(addData)}>

		      		<div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
			      		<label className="label col-span-12 md:col-span-2">
				          <span className="label-text">Produk</span>
				        </label>
			      		<div className="relative col-span-12 md:col-span-4">
			      			<Input type="text" placeholder="Nama Produk" name="nama_produk" control={control} rules={{required: true}} error={errors.nama_produk ? true : false}/>
			      			{errors?.nama_produk && <MessageError>Nama Produk Tidak Boleh Kosong</MessageError>}
			      		</div>
							</div>

			      	<div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
			      		<label className="label col-span-12 md:col-span-2">
				          <span className="label-text">Nomor SKU</span>
				        </label>
			      		<div className="relative col-span-12 md:col-span-4">
			      			<Input type="text" placeholder="Nomor SKU" name="nomor_sku" control={control} rules={{required: true}} error={errors.nomor_sku ? true : false}/>
			      			{errors?.nomor_sku && <MessageError>Nomor SKU Tidak Boleh Kosong</MessageError>}
			      		</div>
							</div>

			      	<div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
			      		<label className="label col-span-12 md:col-span-2">
				          <span className="label-text">Kategori Produk</span>
				        </label>
			      		<div className="relative col-span-12 md:col-span-4">
			      			<Controller
							      name="id_kategori_produk"
							      control={control}
							      rules={{ required: true }}
							      render={({ field }) => (
						  			<AsyncCreatableSelect styles={colourStyles} cacheOptions defaultOptions isClearable loadOptions={promiseOptions} {...field}/>
						      )}
						    />
			      			{errors?.kategori_produk && <MessageError>Kategori Produk Tidak Boleh Kosong</MessageError>}
			      		</div>
							</div>

			      	<div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
			      		<label className="label col-span-12 md:col-span-2">
				          <span className="label-text">Gambar Produk</span>
				        </label>
				        <div className="relative col-span-12 md:col-span-4">
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

							<div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
			      		<label className="label col-span-12 md:col-span-2">
				          <span className="label-text">Harga Awal</span>
				        </label>
			      		<div className="relative col-span-12 md:col-span-4">
			      			<InputCurrency placeholder="Harga Awal" required="true" name="harga_awal" control={control} error={errors.harga_awal ? true : false} />
			      			{errors?.harga_awal && <MessageError>Harga Awal Tidak Boleh Kosong</MessageError>}
			      		</div>
							</div>

							<div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
			      		<label className="label col-span-12 md:col-span-2">
				          <span className="label-text">Harga Jual</span>
				        </label>
			      		<div className="relative col-span-12 md:col-span-4">
			      			<InputCurrency placeholder="Harga Jual" required="true" name="harga_jual" control={control} error={errors.harga_jual ? true : false} />
			      			{errors?.harga_jual && <MessageError>Harga Jual Tidak Boleh Kosong</MessageError>}
			      		</div>
							</div>

							<div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
			      		<label className="label col-span-12 md:col-span-2">
				          <span className="label-text">Tambah Diskon</span>
				        </label>
			      		<div className="relative col-span-12 md:col-span-4">
					  			<label className="label cursor-pointer">
					  				<input type="checkbox" className="checkbox checkbox-secondary" value={1} onChange={(e) => showHargaDiskon(e)}/>
							  	</label>
			      		</div>
							</div>

					    <div className="grid grid-cols-8 gap-1 md:gap-4 mb-4 hidden duration-200" id="content-harga-diskon">
			      		<label className="label col-span-12 md:col-span-2">
				          <span className="label-text">Diskon</span>
				        </label>
			      		<div className="relative col-span-12 md:col-span-4">
		      			    <InputCurrency placeholder="Diskon" required="false" name="diskon" id="input-diskon"/>
			      		</div>
							</div>

							<div className="grid grid-cols-8 md:gap-4 mt-8 mb-8">
			      		<div className="relative col-span-12 gap-x-2 md:col-span-4 md:col-start-3">
			      			<Button className="text-xs mr-2 bg-custom-blue border-custom-blue" type="submit" startIcon={<FiSave size={20}/>} loading={isAction} title="Simpan" />
					        <Button className="text-xs" color="ghost" type="button" startIcon={<FiXCircle size={20}/>} loading={false} title="Kembali" onClick={() => navigate('/produk')}/>
			      		</div>
							</div>

			    	</form>

		    	</div>
  
        </>
    );
};

export default Tambah;
