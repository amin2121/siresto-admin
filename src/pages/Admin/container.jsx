import React from 'react';
import { Outlet } from 'react-router-dom'

import Sidebar from '../../layouts/Sidebar'
import Header from '../../layouts/Header'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Container = () => {
    return (
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="lg:flex bg-white drawer-content relative">
                <Sidebar/>
                <div className="flex-1">
                    <Header/>
            	    <Outlet/>
                    <ToastContainer 
                      position="top-center"
                      autoClose={3000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="light"/>
                </div>
            </div>

        </div>
    );
};

export default Container;
