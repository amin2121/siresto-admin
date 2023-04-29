import React, {useState, useEffect} from 'react'
import { InputUserTelepon } from '../../components/InputUser'
import { MessageError } from '../../components/Input'
import { Button } from '../../components/Button'

// icons
import { BiArrowBack } from 'react-icons/bi'

// libraries
import axios from '../../utils/axios'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { toastDark } from '../../utils/toast'

export default function DaftarNoTelepon() {
  const navigate = useNavigate()
  const [noTelepon, setNoTelepon] = useState(null)

  function convertNoTelepon () {
    let valNoTelepon = noTelepon.split(' ').join('')

    if(valNoTelepon[0] === '0') {
      valNoTelepon = valNoTelepon.replace('0', '62')
    } else if(valNoTelepon[0] === '+') {
      valNoTelepon = valNoTelepon.replace('+', '')
    }

    localStorage.setItem('noTelepon', parseInt(valNoTelepon))
    navigate('/nama-pelanggan')
  }

  return (
    <>
      <div className='px-4 flex flex-col flex-1 mt-4'>
          <Link to="/keranjang">
            <BiArrowBack size="20" className="text-blue-500 mb-4"/>
          </Link>
          <div className="mb-6">
            <h3 className="font-bold mb-1">Masukkan No Telepon</h3>
            <p className="text-xs">Masukkan No Telepon agar kami bisa menghubungi Anda.</p>
          </div>
          <div className="mb-24">
            <InputUserTelepon id="input-telepon" directionIcon="left" name="no_telepon" placeholder="085xxxxxxxx" onChange={(e) => setNoTelepon(e.target.value)} error={noTelepon == '' ? true : false}/>
            {noTelepon == '' ? <MessageError>No Telepon Tidak Boleh Kosong</MessageError> : ''}
          </div>

          <div className='w-full px-4 absolute bottom-3 left-0'>
            <Button type="button" title="Lanjutkan" onClick={convertNoTelepon} className="w-full bg-blue-500 border-0 hover:bg-blue-400 mb-2"/>
          </div>

      </div>
    </>
  )
}