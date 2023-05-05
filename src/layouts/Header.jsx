import React, { useEffect, useState } from 'react';
import { BiMenuAltLeft } from 'react-icons/bi'
import { IoNotificationsOutline } from 'react-icons/io5'
import { useDispatch } from 'react-redux';
import { useQuery, QueryClient } from 'react-query'
import { openSidebar } from '../features/sidebarSlice'
import DropdownHeader from '../components/DropdownHeader'
import Logo from '../assets/images/logo/SiResto.png'
import axios from '../utils/axios'
import moment from 'moment'

const Header = ({}) => {
	const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem('user'))
    const [sisaHari, setSisaHari] = useState(0)
    const [showBanner, setShowbanner] = useState(false)

    useEffect(() => {
        cek_lisence()
    }, [])

    const cek_lisence = () => {
        // cek jika lisence trial lebih dari 30 hari
        if(user.lisence == 'Trial') {
            let endDate = moment(user.tanggal)
            let startDate = moment()
            let _30hari = moment(endDate).add(30, 'days')

            let diff = moment.duration(endDate.diff(startDate)).asDays()
            let rentangHari = Math.abs(Math.round(diff))
            setSisaHari(rentangHari)
            setShowbanner(true)
        } else {
            setShowbanner(false)
        }

    }

    return (
        <>
            <div className="bg-white w-full h-16 flex items-center justify-between px-6">
            	<div className="flex items-center space-x-2">
            		<BiMenuAltLeft className="text-2xl cursor-pointer" onClick={() => dispatch(openSidebar())}/>
                    <img src={Logo} alt={Logo} className="w-24 block block lg:hidden"/>
            	</div>
            	<div className="flex items-center space-x-6">
            		<div className="relative">
            			<IoNotificationsOutline className="text-2xl"/>
            			<span className="animate-ping block absolute top-0 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
            		</div>
                    <DropdownHeader name={user?.name} image={user?.gambar}/>
            	</div>
            </div>
            {
                showBanner == true 
                ? <div className="w-full px-6 mt-2 mb-4">
                    <div class="alert bg-yellow-500 text-white shadow-sm !rounded-md !w-full py-2">
                      <div className="w-full flex justify-between flex-wrap">
                        <span>Masa percobaan Anda akan berakhir dalam {sisaHari} hari. Upgrage akun Anda agar dapat kembali menikmati layanan SiResto </span>
                        <button type="button" className="btn w-full md:w-fit bg-transparent border-white text-white px-10 hover:bg-yellow-600 hover:border-yellow-600 mt-4 lg:mt-0">Upgrade</button>
                      </div>
                    </div>
                </div>
                : ''
            }
        </>
    );
};

export default Header;
