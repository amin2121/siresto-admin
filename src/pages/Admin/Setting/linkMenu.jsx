import React, { useState, useEffect, useRef } from "react";
import "./setting.css";

// components
import HeaderContent from "../../../layouts/HeaderContent";
import LoadingPage from "../../../components/LoadingPage";
import { Button } from "../../../components/Button";
import { InputGroup, InputGroupCurrency } from "../../../components/Input";
import axios from "../../../utils/axios";

// icons
import { HiOutlineReceiptTax } from "react-icons/hi";
import { BiGitBranch } from "react-icons/bi";
import { FiSave } from "react-icons/fi";

import { useQuery } from "react-query";

const LinkMenu = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const breadcrumbs = [
    { link: "/", menu: "Home" },
    { link: "/setting", menu: "Setting" },
    { link: "/setting/pembayaran", menu: "Link" },
  ];

  const {
    isLoading,
    isError,
    error,
    data,
    isSuccess,
    isFetching,
    refetch,
    isPreviousData,
  } = useQuery(["data-resto"], () => fetchData(), {
    refetchOnWindowFocus: true,
  });

  const fetchData = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    const response = await axios.get(`setting/profile`);
    const res = await response.data.data;

    return res;
  };

  console.log(data?.slug);

  return (
    <>
      <HeaderContent title="Setting" breadcrumbs={breadcrumbs} />
      <div className="bg-white rounded-lg shadow-md mx-6">
        <div className="px-4 py-3 bg-gray-100 rounded-lg text-blue-900">
          <h2 className="text-lg font-semibold">Panduan Pelanggan</h2>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-4 py-3 bg-gray-100 rounded-lg text-blue-900">
              <h2 className="text-lg font-semibold">
                Link Pesanan Online Siresto Menu
              </h2>
            </div>
            <div className="p-4">
              <p>
                Pelanggan dapat mengakses alamat web dibawah ini untuk melakukan
                pemesanan online di resto anda. Alamat web dibawah ini bisa
                tempatkan di website, Instagram, sosial media, dan channel
                informasi Institusi Anda lainnya.
              </p>
              <a
                href={
                  process.env.REACT_APP_SIRESTO_MENU_DOMAIN +
                  `home?source=webonline&branch=${data?.slug}`
                }
                target="_blank"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                {process.env.REACT_APP_SIRESTO_MENU_DOMAIN}
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="bg-white h-max px-6 rounded-lg h-96 mt-4 grid grid-cols-8 gap-4 relative">
        <div className="md:col-span-3 col-span-12 shadow-lg shadow-blue-100 rounded gap-4 px-6 py-5 text-sm rounded">
          <div className="h-max px-6 rounded-lg h-96 mt-4 gap-4 relative">
            <div className="md:col-span-3 col-span-12 shadow-lg shadow-blue-100 rounded gap-4 px-6 py-5 text-sm rounded">
              <h1 className="font-bold">Ambil antrian melalui Web Portal</h1>
              <p className="my-4">
                Pelanggan dapat mengakses alamat web dibawah ini untuk mengambil
                antrian onsite/appointement/booking layanan Anda. Alamat web
                dibawah ini bisa tempatkan di website, Instagram, sosial media,
                dan channel informasi Institusi Anda lainnya.
              </p>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default LinkMenu;
