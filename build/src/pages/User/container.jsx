import React from 'react';
import { Outlet } from 'react-router-dom'
import Header from '../../layouts/HeaderUser'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Container = () => {
    const { warna } = useSelector(state => state.warnaKeranjang)

    return (
        <>
            <div className={`sm:w-full relative lg:w-1/3 h-screen mx-auto flex flex-col ${warna}`}>
                <Header/>
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
