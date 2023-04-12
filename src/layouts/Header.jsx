import React, { useEffect, useState } from 'react';
import { BiMenuAltLeft } from 'react-icons/bi'
import { IoNotificationsOutline } from 'react-icons/io5'
import { useDispatch } from 'react-redux';
import { useQuery, QueryClient } from 'react-query'
import { openSidebar } from '../features/sidebarSlice'
import DropdownHeader from '../components/DropdownHeader'
import Logo from '../assets/images/logo/SiResto.png'
import axios from '../utils/axios'

const Header = ({}) => {
	const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem('user'))

    return (
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
    );
};

export default Header;
