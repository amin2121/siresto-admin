import React, { useState, useEffect } from 'react';

// components
import CardCount from '../../../components/CardCount'
import ChartBar from '../../../components/ChartBar'
import LoadingPage from '../../../components/LoadingPage'

// icons
import { MdSpaceDashboard, MdLoyalty } from 'react-icons/md'
import { FiCoffee, FiShoppingCart } from 'react-icons/fi'
import { BiReceipt } from 'react-icons/bi'
import { BsFillPersonLinesFill } from 'react-icons/bs'

// libraries
import { useSelector } from 'react-redux'
import { useMutation, QueryClient, useQueryClient, useQuery } from 'react-query'
import { useForm, Controller } from "react-hook-form";
import AsyncCreatableSelect from 'react-select/async-creatable';
import axios from '../../../utils/axios'
import { baseUrl } from '../../../utils/strings'

const colourStyles = {
  control: styles => ({ ...styles, backgroundColor: 'white', height: '1rem', borderRadius: '5px', borderWidth: '1px', borderColor: 'rgb(59 130 246 / 1)' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      // backgroundColor: isDisabled ? 'red' : 'blue',
      // color: '#FFF',
      cursor: isDisabled ? 'not-allowed' : 'default',
    };
  },
};

const DashboardSuperadmin = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const name = user?.name
    const token = user?.token

    const [isLoadingSelect, setIsLoadingSelect] = useState(true)
    const [selectResto, setSelectResto] = useState()

    // react query
    const queryClient = new QueryClient()
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
        refetchOnWindowFocus: false
    })

    // fetch data
    const fetchData = async () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        let resto = encodeURIComponent(selectResto?.label)
        resto = resto == 'undefined' ? '' : resto

        const response = await axios.get('dashboard/superadmin?resto=' + resto)
        const res = await response.data
        const data = res.data

        setSelectResto(data.select_resto)

        return data
    }

    const promiseOptions = async (inputValue) => {
        setIsLoadingSelect(!isLoadingSelect)
        const response = await axios.get('resto/all?s=' + inputValue)
        const res = await response.data.data

        return res
    }

    const ubahSelectResto = async (choice) => {
        await setSelectResto(choice)
        refetch()
    }

    if(isLoading) {
        return <div className="flex-1 flex justify-center items-center flex-col space-y-3"><LoadingPage /></div>
    }

    return (
        <div className="px-6">
            <h2 className="text-xl mt-4 mb-6 font-semibold">Hey, {name}</h2>
            <div className="grid gap-3 grid-cols-12">
                <div className="col-span-12 md:col-span-8 mr-2 bg-white items-center rounded-3xl border border-gray-300">
                    <div className="border-b border-gray-200 mb-1 py-2 px-6">
                        <h5 className="text-sm font-semibold">Statistik Registrasi Resto</h5>
                    </div>
                    <div className="p-3 pt-3">
                        <ChartBar data={data.registrasi_resto_per_bulan} title="Registrasi Resto Per Bulan"/>
                    </div>
                </div>
                <div className="col-span-12 md:col-span-4 flex flex-col">
                    <CardCount title="Jumlah Resto" value={data.jumlah_resto} icon={<FiCoffee size={20} className="text-lg text-blue-500"/>} color="blue"/>
                    <div className="bg-white rounded-3xl border border-gray-300 mt-3 flex-1">
                        <div className="border-b border-gray-200 mb-1 py-2 px-6">
                            <h5 className="text-sm font-semibold">Data Resto</h5>
                        </div>
                        <div className="space-y-5 p-5">
                            <div className="">
                                <AsyncCreatableSelect styles={colourStyles} defaultValue={selectResto} cacheOptions defaultOptions isClearable loadOptions={promiseOptions} onChange={(choice) => ubahSelectResto(choice)}/>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex justify-center items-center">
                                        <MdLoyalty className="text-lg text-blue-500"/>
                                    </div>
                                    <p className="ml-4 text-sm">Jumlah SKU</p>
                                </div>
                                <p className="text-lg font-semibold">{data.jumlah_sku} SKU</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex justify-center items-center">
                                        <BiReceipt className="text-lg text-blue-500"/>
                                    </div>
                                    <p className="ml-4 text-sm">Jumlah Transaksi</p>
                                </div>
                                <p className="text-lg font-semibold">{data.jumlah_transaksi}/hari</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default DashboardSuperadmin;

