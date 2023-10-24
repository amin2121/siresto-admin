import React, { useState, useEffect, useRef } from "react";

// components
import { Button, ButtonIconOutline } from "../../../components/Button";
import HeaderContent from "../../../layouts/HeaderContent";
import TableContent from "../../../layouts/TableContent";
import LoadingTable from "../../../components/LoadingTable";
import PaginationTable from "../../../components/PaginationTable";
import { Menu } from "@headlessui/react";
import { Input, InputCurrency } from "../../../components/Input";

// icons
import { FiEdit3, FiTrash2, FiPlusCircle, FiSearch } from "react-icons/fi";
import { RiArrowLeftSFill, RiArrowRightSFill } from "react-icons/ri";
import {
  BsFillTrashFill,
  BsCheck2Circle,
} from "react-icons/bs";

// libraries
import axios from "../../../utils/axios";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { swNormal, swConfirm } from "../../../utils/sw";
import { rupiahToNumber } from "../../../utils/strings";
import { useMutation, QueryClient, useQueryClient } from "react-query";
import { useForm, Controller } from "react-hook-form"
import { toastSuccess, toastError } from "../../../utils/toast";
import AsyncCreatableSelect from "react-select/async-creatable";
import DropdownTable from "../../../components/DropdownTable";
import moment from "moment";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const StokMasuk = () => {
  moment.locale("id");
  const user = JSON.parse(localStorage.getItem("user"));
  const [errMessage, setErrMessage] = useState("");
  const [tanggalAwal, setTanggalAwal] = useState(new Date());
  const [tanggalAkhir, setTanggalAkhir] = useState(new Date());
  const [isShowModal, setIsShowModal] = useState(false);
  const [isAction, setIsAction] = useState(false);
  const [data, setData] = useState([]);

  // pagination
  const [page, setPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [toRow, setToRow] = useState(1);
  const [fromRow, setFromRow] = useState(0);
  const [limit, setLimit] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const breadcrumbs = [
    { link: "/", menu: "Home" },
    { link: "/stok/stok-masuk", menu: "Stok Masuk" },
  ];

  const handleShowPilihBarang = () => {
    setIsShowModal(true)
  }

  const {
    isLoading,
    isError,
    error,
    data: dataProduk,
    isSuccess,
    isFetching,
    refetch,
    isPreviousData,
  } = useQuery(["data-produk", page], () => fetchDataProduk(), {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const fetchDataProduk = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    const response = await axios.get(
      `produk?s=${keyword}&limit=${limit}&sort=DESC&page=${page}`
    );
    const res = await response.data.data;
    const data = res.data.data;

    setTotalRows(res.total);
    setFromRow(res.from);
    setToRow(res.to);
    setNextPageUrl(res.next_page_url);
    setPrevPageUrl(res.prev_page_url);

    return data;
  };

  // pagination action
  const nextPage = () => (nextPageUrl != null ? setPage(page + 1) : null);
  const prevPage = () => (prevPageUrl != null ? setPage(page - 1) : null);

  const tambahDataStokMasuk = (obj) => {
    const index = data.findIndex((item) => item.id_produk === obj.id);

    if (index === -1) {
      setData([
        ...data,
        {
          id_produk: obj.id,
          sku: obj.nomor_sku,
          nama_produk: obj.nama_produk,
          kategori_produk: obj.kategori_produk,
          harga_beli: obj.harga_beli,
          harga_jual: obj.harga_jual,
          stok: obj.stok,
          nilai_transaksi: obj.nilai_transaksi,
        }
      ])
      setValue(`produk.${data.length}.id_produk`, obj.id)
      setIsShowModal(true)
    } else  {
      const newData = data.filter((item) => item.id_produk != obj.id)
      setData(newData)
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    control,
    setValue,
    getValues,
  } = useForm();

  const simpanStokMasuk = async (data) => {
    await simpanStokMasukMutation.mutate(data)
  }

  const simpanStokMasukMutation = useMutation(
    async (data) => {
      data.id_supplier = data.id_supplier.value

      data.produk = data.produk.map((item) => {
        return {
          'id_produk': item.id_produk,
          'jumlah_stok': item.jumlah_stok,
          'harga_beli': rupiahToNumber(item.harga_beli),
          'harga_jual': rupiahToNumber(item.harga_jual),
        }
      })

      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const response = await axios.post("stok/stok-masuk", data, config);
      const res = response.data;

      if (res.meta.code != 200) {
        throw new Error(res.meta.message);
      }

      return res.data;
    },
    {
      onMutate: () => {
        setIsAction(true);
      },
      onSettled: async (data, error) => {
        setIsAction(false);

        if (data) {
          reset();
          setErrMessage("");
          clearErrors();
          setData([]);
          setValue('id_supplier', null);
        }

        if (error) {
          setErrMessage(error.message);
        }
      },
      onSuccess: async () => {
        toastSuccess("Stok Masuk Berhasil Disimpan");
      },
      onError: async () => {
        toastError("Stok Masuk Gagal Disimpan");
      },
    }
  );

  const promiseSupplierOptions = async (inputValue) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    const response = await axios.get(
      "stok/supplier/all?s=" + inputValue
    );
    const res = await response.data.data;

    return res;
  };

  return (
    <>
      <HeaderContent title="Stok Masuk" breadcrumbs={breadcrumbs}/>
      <form onSubmit={handleSubmit(simpanStokMasuk)}>
        <div className="bg-white px-6 mt-4 mb-5">
          <div className="flex justify-between mb-2">
            <div className="w-1/3 self-end">
              <Controller
                name="id_supplier"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <AsyncCreatableSelect
                    // styles={colourStyles}
                    cacheOptions
                    defaultOptions
                    isClearable
                    placeholder="Pilih Supplier..."
                    loadOptions={promiseSupplierOptions}
                    isValidNewOption={() => false}
                    noOptionsMessage={() => 'Supplier tidak ditemukan.'}
                    {...field}
                  />
                )}
              />
            </div>
            <Button
              className="text-xs bg-custom-blue border-custom-blue"
              type="button"
              startIcon={<FiPlusCircle size={20} />}
              loading={false}
              title="Pilih Barang"
              onClick={handleShowPilihBarang}
            />
          </div>
          <TableContent>
            <thead className="text-xs text-custom-purple bg-custom-purple-light uppercase">
              <tr className="border-b border-custom-purple-light">
                <th scope="col" className="py-3 px-6 rounded-tl-md">
                  No.
                </th>
                <th scope="col" className="py-3 px-6">
                  Nomor SKU
                </th>
                <th scope="col" className="py-3 px-6">
                  Nama Produk
                </th>
                <th scope="col" className="py-3 px-6">
                  Kategori Produk
                </th>
                <th scope="col" className="py-3 px-6">
                  Stok
                </th>
                <th scope="col" className="py-3 px-6">
                  Harga Awal
                </th>
                <th scope="col" className="py-3 px-6">
                  Harga Jual
                </th>
                <th scope="col" className="py-3 px-6 rounded-tr-md">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingTable colSpan="6" />
              ) : data.length > 0 ? (
                data?.map((obj, key) => (
                  <tr
                    className="bg-white border-b border-custom-purple-light"
                    key={obj.id}
                  >
                    <td className="py-4 px-6 whitespace-nowrap text-center">
                      {key + 1}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {obj.sku ?? '-'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {obj.nama_produk}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {obj.kategori_produk.kategori_produk}
                    </td>
                    <td className="text-center px-4 py-3">
                      <Input
                        type="hidden"
                        name={`produk.${key}.id_produk`}
                        control={control}
                      />
                      <div className="w-full flex flex-col justify-center items-center gap-2">
                        <Input
                          type="number"
                          className="text-center py-2 !w-20"
                          name={`produk.${key}.jumlah_stok`}
                          control={control}
                          rules={{required: true}}
                          error={errors[`produk.${key}.jumlah_stok`] ? true : false}
                        />
                      </div>
                    </td>
                    <td className="text-center px-4 py-3">
                      <div className="w-full flex flex-col justify-center items-center gap-2">
                        <InputCurrency
                          className="text-center py-2"
                          name={`produk.${key}.harga_beli`}
                          control={control}
                          rules={{required: true}}
                          error={errors[`produk.${key}.harga_beli`] ? true : false}
                        />
                      </div>
                    </td>
                    <td className="text-center px-4 py-3">
                      <div className="w-full flex flex-col justify-center items-center gap-2">
                        <InputCurrency
                          className="text-center py-2"
                          name={`produk.${key}.harga_jual`}
                          control={control}
                          rules={{required: true}}
                          error={errors[`produk.${key}.harga_jual`] ? true : false}
                        />
                      </div>
                    </td>
                    <td className="text-center px-4 py-3">
                      <div className="w-full flex justify-center">
                        <button className="rounded-full w-10 h-10 flex justify-center items-center bg-custom-red hover:bg-custom-navy duration-200"
                        onClick={() => {
                          const newData = data.filter((item) => item.id_produk != obj.id)
                          setData(newData)
                        }}><BsFillTrashFill size={18}/></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-custom-purple-light">
                  <td
                    className="py-4 px-6 text-center font-medium w-max"
                    colSpan="8"
                  >
                    Data Stok Masuk Akan Muncul Disini
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td
                    className="py-4 px-6 text-center font-medium w-max"
                    colSpan="5"
                  >
                    Gagal Mengambil Data
                  </td>
                </tr>
              )}
            </tbody>
          </TableContent>
        </div>
        <div className="bg-white h-max px-6 rounded-lg mt-4 flex gap-x-3.5 relative justify-end">
          <div className="col-span-3">
            <Button
              className="text-xs bg-custom-green border-custom-green"
              type="submit"
              startIcon={<BsCheck2Circle size={16} />}
              loading={isAction}
              title="Selesai"
            />
          </div>
        </div>
      </form>
      {isShowModal ? (
        <>
          <div className="fixed inset-0 z-30 overflow-y-auto">
            <div className="fixed inset-0 w-full h-full bg-black opacity-30"></div>
            <div className="flex items-center min-h-full px-4 py-8">
              <div className="relative w-90 max-w-lg p-4 mx-auto bg-white rounded-xl shadow-lg">
                <div className="sm:flex">
                  <div className="mx-auto">
                    <h4 className="text-lg text-left font-medium my-6 text-gray-800">
                      Pilih Barang Untuk Stok Masuk
                    </h4>
                    <TableContent>
                      <thead className="text-xs uppercase">
                        <tr className="border-b border-custom-purple-light">
                          <th scope="col" className="py-3 px-6 rounded-tl-md">
                            Nomor SKU
                          </th>
                          <th scope="col" className="py-3 px-6">
                            Nama Produk
                          </th>
                          <th scope="col" className="py-3 px-6 rounded-tr-md">
                            Kategori Produk
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <LoadingTable colSpan="8" />
                        ) : dataProduk.length > 0 ? (
                          dataProduk?.map((obj, key) => (
                            <tr
                              className={`${(data.some((item) => item.id_produk == obj.id) ? "bg-red-100" : "bg-white")} border-b border-custom-purple-light cursor-pointer`} onClick={() => tambahDataStokMasuk(obj)}
                              key={key}
                            >
                              <td className="py-4 px-6 text-center">
                                {obj.nomor_sku ?? '-'}
                              </td>
                              <td className="py-4 px-6 text-center">
                                {obj.nama_produk}
                              </td>
                              <td className="py-4 px-6 text-center">
                                {obj.kategori_produk.kategori_produk}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              className="py-4 px-6 text-center font-medium w-max"
                              colSpan="5"
                            >
                              Data Produk Kosong
                            </td>
                          </tr>
                        )}
                        {isError && (
                          <tr>
                            <td
                              className="py-4 px-6 text-center font-medium w-max"
                              colSpan="5"
                            >
                              Gagal Mengambil Data
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </TableContent>
                    <div className="flex md:justify-end justify-between px-4 mt-4 space-x-3 rounded-bl-md rounded-br-md">
                      <div className="flex space-x-1 items-center justify-end">
                        <span>
                          {fromRow}-{toRow} dari {totalRows}
                        </span>
                        <div className="mr-5 flex items-center">
                          <RiArrowLeftSFill
                            size="30"
                            className={`hover:text-custom-navy ${
                              prevPageUrl == null
                                ? "text-purple cursor-no-drop"
                                : "cursor-pointer"
                            }`}
                            onClick={() => prevPage()}
                          />
                          <RiArrowRightSFill
                            size="30"
                            className={`hover:text-custom-navy ${
                              nextPageUrl == null
                                ? "text-purple cursor-no-drop"
                                : "cursor-pointer"
                            }`}
                            onClick={() => nextPage()}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="items-center gap-2 mt-4 sm:flex">
                      <Button
                        className="w-full mt-2 text-xs bg-custom-purple border-custom-purple"
                        type="button"
                        title="Tutup"
                        onClick={() => setIsShowModal(false)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default StokMasuk;
