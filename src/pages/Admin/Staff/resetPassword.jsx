import React, { useState } from 'react'

// component
import HeaderContent from '../../../layouts/HeaderContent'
import { Button } from '../../../components/Button'
import { Input, MessageError } from '../../../components/Input'

// icons
import { FiSave, FiXCircle } from 'react-icons/fi'

// library
import axios from '../../../utils/axios'
import { slugify } from '../../../utils/strings'
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from 'react-router-dom'
import { useMutation, QueryClient } from 'react-query'
import { toastSuccess, toastError } from '../../../utils/toast'

export default function ResetPassword() {
    const user = JSON.parse(localStorage.getItem('user'))
    const [isAction, setIsAction] = useState(false)
    const [passBaru, setPassBaru] = useState('')
    const [passwordTidakSama, setPasswordTidakSama] = useState(false)
    const defaultValues = {password_baru: '', konfirmasi_password: ''}
    const location = useLocation()
    const prop = location.state

    const breadcrumbs = [
      { link: '/', menu: 'Home' },
      { link: '/' + slugify(prop.pathFirst), menu: prop.pathFirst },
      { link: '/'  + slugify(prop.pathFirst) + '/' + slugify(prop.pathSecond), menu: prop.pathSecond },
	  ]

    const queryClient = new QueryClient()
    const { register, handleSubmit, formState: { errors }, reset, clearErrors, control, watch, setError } = useForm({defaultValues});

	  const navigate = useNavigate()

	  const mutation = useMutation(async (data) => {
      data.id_staff = prop.id
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
      const response = await axios.put('staff/reset-password/' + prop.id, data)
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
      setIsAction(false)

      if(data) {
        queryClient.invalidateQueries('data-staff')
  			reset(defaultValues)
  			clearErrors()
      }

    },
		onSuccess: async () => {
      toastSuccess('Reset Password Berhasil Dilakukan')
      navigate('/staff')
		},
		onError: async () => {
      toastError('Reset Password Gagal Dilakukan')
      navigate('/staff')
		}
	})

	const addStaff = async (data) => {
		await mutation.mutate(data)
	}

  const checkPasswordTidakSama = (inputKonfirmasiPass) => {
    let konfirmasiPass = inputKonfirmasiPass.target.value
    passBaru !== konfirmasiPass ? setPasswordTidakSama(true) : setPasswordTidakSama(false)
  }

  return (
      <>
        <HeaderContent linkBack="/staff" title="Reset Password" breadcrumbs={breadcrumbs}></HeaderContent>
        <div className="bg-white h-max px-6 rounded-lg mt-0 md:mt-4">
          <form onSubmit={handleSubmit(addStaff)}>

            <div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
              <label className="label col-span-12 md:col-span-2">
                <span className="label-text">Password Baru</span>
              </label>
              <div className="relative col-span-12 md:col-span-4">
                <Input type="password" placeholder="Password Baru" name="password_baru" control={control} error={errors.password_baru ? true : false} onChange={(e) => setPassBaru(e.target.value)}/>
                {errors.password_baru && <MessageError>Password Baru Tidak Boleh Kosong</MessageError>}
              </div>
            </div>

            <div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
              <label className="label col-span-12 md:col-span-2">
                <span className="label-text">Konfirmasi Password</span>
              </label>
              <div className="relative col-span-12 md:col-span-4">
                <Input type="password" placeholder="Konfirmasi Password" name="konfirmasi_password" control={control} error={errors.konfirmasi_password || passwordTidakSama ? true : false} onChange={(e) => checkPasswordTidakSama(e)}/>
                {errors?.konfirmasi_password && <MessageError>Konfirmasi Password Tidak Boleh Kosong</MessageError>}
                {passwordTidakSama && <MessageError>Password Baru dengan Konfirmasi Password Tidak Sama</MessageError>}
              </div>
            </div>

            <div className="grid grid-cols-8 md:gap-4 mt-8 mb-8">
              <div className="relative col-span-12 gap-x-2 md:col-span-4 md:col-start-3">
                <Button className="text-xs bg-custom-blue border-custom-blue" type="submit" startIcon={<FiSave size={20}/>} loading={isAction} title="Simpan" />
                <Button className="text-xs" color="ghost" startIcon={<FiXCircle size={20}/>} type="button" loading={false} onClick={() => navigate('/staff')} title="Kembali" />
              </div>
            </div>

          </form>

        </div>

      </>
  );
}
