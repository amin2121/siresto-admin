import React, { useState, useEffect, useRef } from 'react'

// component
import UserProfile from '../../../assets/images/user/user-1.jpg'
import NoImage from '../../../assets/images/user/no-image.png'
import { Button } from '../../../components/Button'
import { Input, MessageError } from '../../../components/Input'
import HeaderContent from '../../../layouts/HeaderContent'

// icons
import { BsFillSave2Fill } from 'react-icons/bs'
import { MdOutlineClose } from 'react-icons/md'
import { HiPencil } from 'react-icons/hi'

// library
import { useForm, Controller } from "react-hook-form";
import { useMutation, QueryClient } from 'react-query'
import axios from '../../../utils/axios'
import { swNormal } from '../../../utils/sw'
import { getBase64 } from '../../../utils/image'


export default function UbahProfile() {
    const [isLoading, setIsLoading] = useState(false)
    const [imageBase64, setImageBase64] = useState('')
    const [gambar, setGambar] = useState('')
    const inputFileRef = useRef(null)
    const { register, handleSubmit, formState: { errors }, reset, clearErrors, control, setValue } = useForm({ mode: 'onBlur' });

    const queryClient = new QueryClient()

    const fetchData = async () => {
        const response = await axios.get('staff/' + '8')
        const res = response.data
        const data = res.data
        
        if(res.meta.code != 200) {
            throw new Error(res.meta.message)
        }
        
        setValue('nama_lengkap', data.nama_lengkap || '')
        setValue('email', data.email || '')
        setValue('no_telepon', data.no_telepon || '')
        setValue('alamat', data.alamat || '')
        setValue('kelurahan', data.kelurahan || '')
        setValue('kecamatan', data.kecamatan || '')
        setValue('kabupaten', data.kabupaten || '')
        setValue('kode_pos', data.kode_pos || '')
    }
    
    useEffect(() => {
        fetchData()
    }, [])

    const mutation = useMutation(async (data) => {
        data.id_resto = 3
        data.id_staff = 8
        data.gambar = imageBase64

        const response = await axios.put('staff/ubah-profile/' + '8', data)
        const res = response.data

        if(res.meta.code != 200) {
            throw new Error(res.meta.message)
        }
      
        return res.data
    }, {
        onMutate: () => {
            setIsLoading(true)
        },
        onSuccess: async () => {
            queryClient.invalidateQueries('data-staff')
            setIsLoading(false)
            clearErrors()
            swNormal('Berhasil', 'Ubah Profile Berhasil Dilakukan', 'success')
        },
        onError: async () => {
            setIsLoading(false)
            swNormal('Gagal', 'Ubah Profile Berhasil Dilakukan', 'error')
        }
    })

    const klikGambar = () => {
        inputFileRef.current.click()
    }

	const convertImageToBase64 = (e) => {
		let file = e.target.files[0]

        if (e.target.files && e.target.files[0]) {
            setGambar(URL.createObjectURL(e.target.files[0]));
        }

		getBase64(file)
	    .then(result => {
	      	setImageBase64(result)
	    }).catch(err => {
	    });
	}

    const ubahProfile = async (data) => {
		await mutation.mutate(data)
	}

    const tampilGambar = () => {
        if (gambar == '') {
            return (
                <div className='absolute bottom-0 w-40 h-40 rounded-full bg-gray-300 flex justify-center items-center'>
                    <img src={NoImage} alt={NoImage} className="w-24 h-24"/>
                </div>
            )
        }
            
        return <img src={gambar} alt={gambar} className="absolute bottom-0 w-40 h-40 rounded-full "/>
    }

    const hapusGambar = () => {
        setGambar('')
        setImageBase64('')
    }

    return (
        <div className='mb-8'>
            <HeaderContent linkBack="/profile" title="Ubah Profile"></HeaderContent>
            <div className="bg-white px-6 rounded-lg my-4 grid grid-cols-8">
                <div className='profile__image col-span-2 flex justify-center'>
                    <div className='w-40 h-44 relative'>
                        <span className='cursor-pointer'>
                            <MdOutlineClose className='absolute top-0 right-0 text-gray-400' size={20} onClick={hapusGambar}/>
                        </span>
                        {tampilGambar()}
                        <span className='inline-block absolute bottom-1 cursor-pointer right-4 w-8 h-8 rounded-full bg-blue-500 flex justify-center items-center text-white' onClick={klikGambar}>
                            <HiPencil/>
                        </span>
                        <input type="file" className='hidden' ref={inputFileRef} onChange={e => convertImageToBase64(e)}/>
                    </div>
                </div>
                <form className='col-span-4 space-y-1' onSubmit={handleSubmit(ubahProfile)}>
                    <h3 className='uppercase text-sm text-black font-semibold'>Data Personal : </h3>
                    <div className="grid grid-cols-1 grid-rows-2">
                        <label className="label col-span-2">
                            <span className="label-text">Nama Lengkap</span>
                        </label>
                        <div className="relative col-span-4">
                            <Input type="text" placeholder="Nama Lengkap" name="nama_lengkap" control={control} error={errors.nama_lengkap ? true : false}/>
                            {errors.nama_lengkap && <MessageError>Nama Lengkap Tidak Boleh Kosong</MessageError>}
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className="grid grid-cols-1 grid-rows-2">
                            <label className="label col-span-2">
                                <span className="label-text">Email</span>
                            </label>
                            <div className="relative col-span-4">
                                <Input type="text" placeholder="Email" name="email" control={control} error={errors.email ? true : false}/>
                                {errors.email && <MessageError>Email Tidak Boleh Kosong</MessageError>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 grid-rows-2">
                            <label className="label col-span-2">
                                <span className="label-text">No Telepon</span>
                            </label>
                            <div className="relative col-span-4">
                                <Input type="text" placeholder="No Telepon" name="no_telepon" control={control} error={errors.no_telepon ? true : false}/>
                                {errors.no_telepon && <MessageError>No Telepon Tidak Boleh Kosong</MessageError>}
                            </div>
                        </div>
                    </div>
                    <h3 className='uppercase !mt-4 text-sm text-black font-semibold'>Data Alamat : </h3>
                    <div className="grid grid-cols-1 grid-rows-2">
                        <label className="label col-span-2">
                            <span className="label-text">Alamat</span>
                        </label>
                        <div className="relative col-span-4">
                            <Input type="text" placeholder="Alamat" name="alamat" control={control} error={errors.alamat ? true : false}/>
                            {errors.alamat && <MessageError>Alamat Tidak Boleh Kosong</MessageError>}
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className="grid grid-cols-1 grid-rows-2">
                            <label className="label col-span-2">
                                <span className="label-text">Desa/Kelurahan</span>
                            </label>
                            <div className="relative col-span-4">
                                <Input type="text" placeholder="Kelurahan" name="kelurahan" control={control} error={errors.kelurahan ? true : false}/>
                                {errors.kelurahan && <MessageError>Desa/kelurahan Tidak Boleh Kosong</MessageError>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 grid-rows-2">
                            <label className="label col-span-2">
                                <span className="label-text">Kecamatan</span>
                            </label>
                            <div className="relative col-span-4">
                                <Input type="text" placeholder="Kecamatan" name="kecamatan" control={control} error={errors.kecamatan ? true : false}/>
                                {errors.kecamatan && <MessageError>Kecamatan Tidak Boleh Kosong</MessageError>}
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4 mb-4'>
                        <div className="grid grid-cols-1 grid-rows-2">
                            <label className="label col-span-2">
                                <span className="label-text">Kabupaten</span>
                            </label>
                            <div className="relative col-span-4">
                                <Input type="text" placeholder="Kabupaten" name="kabupaten" control={control} error={errors.kabupaten ? true : false}/>
                                {errors.kabupaten && <MessageError>Kabupaten Tidak Boleh Kosong</MessageError>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 grid-rows-2">
                            <label className="label col-span-2">
                                <span className="label-text">Kode Pos</span>
                            </label>
                            <div className="relative col-span-4">
                                <Input type="text" placeholder="Kode Pos" name="kode_pos" control={control} error={errors.kode_pos ? true : false}/>
                                {errors.kode_pos && <MessageError>Kode Pos Tidak Boleh Kosong</MessageError>}
                            </div>
                        </div>
                    </div>
                    <div className="relative !mt-6">
                        <Button className="" loading={isLoading} color="secondary" type="submit" startIcon={<BsFillSave2Fill size={16}/>} title="Simpan" />
                    </div>
                </form>
            </div>
        </div>
    )
}
