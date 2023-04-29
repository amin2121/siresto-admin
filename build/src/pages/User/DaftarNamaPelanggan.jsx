import React, {useState, useEffect} from 'react'
import { InputUserWithIcon } from '../../components/InputUser'
import { MessageError } from '../../components/Input'
import { Button } from '../../components/Button'

// icons
import { BiArrowBack } from 'react-icons/bi'
import { FiUser } from 'react-icons/fi'

// libraries
import axios from '../../utils/axios'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom'
import { toastDark } from '../../utils/toast'

export default function DaftarNamaPelanggan() {
  const navigate = useNavigate()
  const [namaPelanggan, setNamaPelanggan] = useState(null)

  function settingLocalStorage () {
    localStorage.setItem('namaPelanggan', namaPelanggan)
    navigate('/keranjang')
  }

  return (
    <>
      <div className='px-4 flex flex-col flex-1 mt-4'>
        <Link to="/nomor-telepon">
          <BiArrowBack size="20" className="text-blue-500 mb-4"/>
        </Link>
        <div className="mb-6">
          <h3 className="font-bold mb-1">Masukkan Nama Pelanggan</h3>
          <p className="text-xs">Masukkan Nama Pelanggan agar kami bisa menghubungi Anda.</p>
        </div>
        <div className="mb-24">
          <InputUserWithIcon title="Nama Pelanggan" directionIcon="left" type="text" icon={<FiUser size="20"/>} name="nama_pelanggan" id="input-nama-pelanggan" onChange={(e) => setNamaPelanggan(e.target.value)} error={namaPelanggan == '' ? true : false}/>
          {namaPelanggan == '' ? <MessageError>Nama Pelanggan Tidak Boleh Kosong</MessageError> : ''}
        </div>
        <Button type="button" title="Lanjutkan" className="w-full bg-blue-500 border-0 hover:bg-blue-400 mb-2" onClick={settingLocalStorage}/>
      </div>
    </>
  )
}