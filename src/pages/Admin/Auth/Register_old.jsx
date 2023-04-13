import React, { useState, useEffect } from 'react';

// component
import { ButtonAuth } from '../../../components/Button'

// assets
import { BsFillSave2Fill } from 'react-icons/bs'
import { MdOutlineCancel } from 'react-icons/md'

// library
import axios from '../../../utils/axios'
import { swNormal } from '../../../utils/sw'
import { useMutation, QueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form";

const Register = () => {
	const navigate = useNavigate()
	const queryClient = new QueryClient()
	const [isAction, setIsAction] = useState(false)
	const [errMessage, setErrMessage] = useState("")
	const [isDisabledInput, setIsDisabledInput] = useState(false)

	const { register, handleSubmit, errors, reset, clearErrors } = useForm();

	const submitRegisterUser = async (data) => {
		const response = await axios.post('auth/register', data)
		const res = response.data

		if(res.meta.code != 200) {
			throw new Error(res.meta.message)
		}

		return res.data
	}

	const mutation = useMutation(submitRegisterUser, {
		onMutate: () => {
			// spinner
			setIsDisabledInput(!isDisabledInput)
			setIsAction(!isAction)
		},
		onSuccess: async () => {
			reset()
			clearErrors()
			navigate('/login')
			swNormal('Berhasil', 'Register Berhasil Dilakukan', 'success')
		},
		onError: async () => {
			navigate('/login')
			swNormal('Gagal', 'Register Gagal Dilakukan', 'error')
		}
	})

	const registerUser = async (data) => {
		await mutation.mutate(data)
	}

    return (
        <div className="h-screen flex md:h-max">
            <div className="basis-3/5">
        		{/*<img src={BgAuth} alt={BgAuth} className="w-full h-screen object-cover object-center flex-col"/>*/}
        	</div>
		    <div className="basis-2/5 bg-white p-4 flex items-center justify-center flex-col">
		    	<div className='mb-1'>
			    	{/*<img src={IconAplikasi} alt="logo" className={`cursor-pointer duration-500 w-30`}/>*/}
			    	<p className="font-medium mt-2">Register</p>
		    	</div>
		    	<form onSubmit={handleSubmit(registerUser)} className="w-full px-16">

      	      		<div className="relative mb-3">
      	      			<label className="label mb-1 px-0">
				        	<span className="label-text font-medium">Email</span>
				        </label>
		      			<div className="relative">
						  	<input type='text' className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email" {...register("email", { required: true })} disabled={isDisabledInput ? 'disabled' : ''}/>
		      				{errors?.email && <span className="text-red-400 block mt-2">Email Tidak Boleh Kosong</span>}
						</div>
					</div>

		      		<div className="relative mb-3">
      	      			<label className="label mb-1 px-0">
				        	<span className="label-text font-medium">Nama Lengkap</span>
				        </label>
		      			<div className="relative">
						  	<input type='text' className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nama Lengkap" {...register("name", { required: true })} disabled={isDisabledInput ? 'disabled' : ''}/>
	      					{errors?.name && <span className="text-red-400 block mt-2">Nama Lengkap Tidak Boleh Kosong</span>}
						</div>
					</div>

		      		<div className="relative mb-3">
		      			<label className="label mb-1 px-0">
				        	<span className="label-text font-medium">Password</span>
				        </label>
		      			<div className="relative">
						  	<input type='password' className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="******" {...register("password", { required: true })} disabled={isDisabledInput ? 'disabled' : ''}/>
		      				{errors?.password && <span className="text-red-400 block mt-2">Password Tidak Boleh Kosong</span>}
						</div>
					</div>

		      		<div className="relative mb-3">
	      				<label className="label mb-1 px-0">
				        	<span className="label-text font-medium">Password Konfirmasi</span>
				        </label>
		      			<div className="relative">
						  	<input type='password' className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="******" {...register("konfirmasi_password", { required: true })} disabled={isDisabledInput ? 'disabled' : ''}/>
	      					{errors?.konfirmasi_password && <span className="text-red-400 block mt-2">Nama Lengkap Tidak Boleh Kosong</span>}
						</div>
					</div>
					
	      			<ButtonAuth className="mb-3 mt-2" type="submit" loading={isAction} fullWidth="true">Register</ButtonAuth>

	      			<span className="label-text font-medium text-xs">Sudah Memiliki Akun?</span> <span className="label-text font-bold text-blue-500 hover:text-blue-700 cursor-pointer text-xs duration-200" onClick={() => navigate('/login')}>Login</span>
		    	</form>

		    </div>
  
        </div>
    );
};

export default Register;