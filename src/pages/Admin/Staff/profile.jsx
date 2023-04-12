import React from 'react'

// component
import UserProfile from '../../../assets/users/user-1.jpg'
import { Button } from '../../../components/Button'
import { Input, MessageError } from '../../../components/Input'

// icons
import { BsFillSave2Fill } from 'react-icons/bs'
import { MdOutlineCancel } from 'react-icons/md'

export default function Profile() {
  return (
    <>
        <div className='profile__image'>
            <img src={UserProfile} alt={UserProfile} />
        </div>

        <form>
            <div className="grid grid-cols-1 grid-rows-2 gap-4 mb-4">
                <label className="label col-span-2">
                    <span className="label-text">Nama Lengkap</span>
                </label>
                <div className="relative col-span-4">
                    <Input type="text" placeholder="Nama Lengkap" name="nama_lengkap" control={control} error={errors.nama_lengkap ? true : false}/>
                    {errors.nama_lengkap && <MessageError>Nama Lengkap Tidak Boleh Kosong</MessageError>}
                </div>
            </div>
        </form>
    </>
  )
}
