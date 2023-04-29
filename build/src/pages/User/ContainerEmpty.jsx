import React from 'react';
import Logo from '../../assets/logo/SiResto.png'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Container = () => {
    return (
        <>
            <div className={`sm:w-full relative lg:w-1/3 h-screen mx-auto flex flex-col`}>
                <div className='header-user px-4 py-2 flex justify-between bg-white'>
                    <div className='header-user__logo flex justify-start items-center'>
                      <img src={Logo} alt={Logo} className="w-24"/>
                    </div>
                </div>
                <Outlet/>
                <ToastContainer
                    position="bottom-center"
                    autoClose={1500}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover={false}
                    theme="dark"
                />
            </div>
        </>
    );
};

export default Container;
