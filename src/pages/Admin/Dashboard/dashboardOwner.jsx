import React, { useState, useEffect } from "react";

// components
import CardCount from "../../../components/CardCount";
import ChartBar from "../../../components/ChartBar";
import LoadingPage from "../../../components/LoadingPage";

// icons
import { MdSpaceDashboard, MdLoyalty } from "react-icons/md";
import { FiCoffee, FiShoppingCart } from "react-icons/fi";
import { BiReceipt } from "react-icons/bi";
import { BsFillPersonLinesFill } from "react-icons/bs";

// libraries
import { useSelector } from "react-redux";
import {
  useMutation,
  QueryClient,
  useQueryClient,
  useQuery,
} from "react-query";
import { useForm, Controller } from "react-hook-form";
import AsyncCreatableSelect from "react-select/async-creatable";
import axios from "../../../utils/axios";
import { baseUrl } from "../../../utils/strings";

const colourStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    height: "1rem",
    borderRadius: "5px",
    borderWidth: "1px",
    borderColor: "rgb(59 130 246 / 1)",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      // backgroundColor: isDisabled ? 'red' : 'blue',
      // color: '#FFF',
      cursor: isDisabled ? "not-allowed" : "default",
    };
  },
};

const DashboardOwner = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user?.name;
  const token = user?.token;

  // react query
  const queryClient = new QueryClient();
  const {
    isLoading,
    isError,
    error,
    data,
    isSuccess,
    isFetching,
    refetch,
    isPreviousData,
  } = useQuery(["data-dashboard"], () => fetchData(), {
    staleTime: 15000,
    refetchInterval: 15000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  // fetch data
  const fetchData = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get("dashboard/owner");
    const res = await response.data;
    const data = res.data;
    return data;
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center flex-col space-y-3">
        <LoadingPage />
      </div>
    );
  }

  return (
    <div className="px-6 pb-6">
      <h2 className="text-xl mt-4 mb-6 font-semibold">Hey, {name}</h2>
      <div className="grid gap-6 md:grid-cols-4 grid-cols-1 grid-rows-1">
        <CardCount
          title="Penjualan Hari Ini"
          value={data.penjualan_hari_ini}
          icon={<BiReceipt size={20} className="text-lg text-blue-500" />}
          color="blue"
        />
        <CardCount
          title="Jumlah Produk"
          value={data.jumlah_produk}
          icon={<MdLoyalty size={20} className="text-lg text-blue-500" />}
          color="blue"
        />
        <CardCount
          title="Pendapatan Hari Ini"
          value={data.pendapatan_hari_ini}
          icon={<FiShoppingCart size={20} className="text-lg text-blue-500" />}
          color="blue"
        />
        <CardCount
          title="Total Staff"
          value={data.total_staff}
          icon={
            <BsFillPersonLinesFill
              size={20}
              className="text-lg text-blue-500"
            />
          }
          color="blue"
        />
      </div>
      <h3 className="text-md mt-6 font-semibold">Monitoring</h3>
      <div className="grid grid-cols-12 mt-5 gap-4 md:mb-4">
        <div className="md:col-span-8 col-span-12 bg-white items-center rounded-3xl border border-gray-300">
          <div className="border-b border-gray-200 mb-1 py-2 px-6">
            <h5 className="text-sm font-semibold">Statistik Pendapatan</h5>
          </div>
          <div className="p-3 pt-3">
            <ChartBar
              data={data.penjualan_per_bulan}
              title="Pendapatan Per Bulan"
            />
          </div>
        </div>
        <div className="md:col-span-4 col-span-12 bg-white items-center rounded-3xl border border-gray-300">
          <div className="border-b border-gray-200 mb-1 py-2 px-6">
            <h5 className="text-sm font-semibold">Produk Populer</h5>
          </div>
          <div className="p-5 pt-3">
            <table className="w-full text-sm text-left">
              <thead>
                <tr>
                  <th className="text-xs"></th>
                  <th className="text-xs">Nama</th>
                  <th className="text-xs">Total</th>
                </tr>
              </thead>
              <tbody>
                {isSuccess
                  ? data.produk_populer.map((item, index) => (
                      <tr className="border-b border-gray-200" key={index}>
                        <td className="py-2">
                          <img
                            src={baseUrl + item.gambar}
                            alt="image"
                            className="w-10 h-10 object-cover rounded-md"
                          />
                        </td>
                        <td className="py-2">{item.nama_produk}</td>
                        <td className="py-2">{item.jumlah_terjual}</td>
                      </tr>
                    ))
                  : ""}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOwner;
