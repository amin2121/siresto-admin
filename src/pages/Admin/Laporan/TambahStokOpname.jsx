import React, { useState, useEffect, useRef, useCallback } from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import "./laporan.css";

// components
import { Button } from "../../../components/Button";
import HeaderContent from "../../../layouts/HeaderContent";
import TableContent from "../../../layouts/TableContent";
import LoadingTable from "../../../components/LoadingTable";
import PaginationTable from "../../../components/PaginationTable";
import { LaporanTambahStokOpname } from "./Cetak/TambahStokOpname";
import { toastSuccess, toastError } from "../../../utils/toast";

// icons
import { HiPencil } from "react-icons/hi";
import {
  BsFillPlusCircleFill,
  BsFillPrinterFill,
  BsFillTrash2Fill,
  BsCheck2Circle,
  BsArrowLeftCircle,
} from "react-icons/bs";
import { MdPublishedWithChanges } from "react-icons/md";
import { FiPrinter } from "react-icons/fi";
import { BiSearch, BiPlus, BiDotsHorizontalRounded } from "react-icons/bi";
import { RiArrowLeftSFill, RiArrowRightSFill } from "react-icons/ri";

// libraries
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "../../../utils/axios";
import { swNormal, swConfirm } from "../../../utils/sw";
import { useMutation, QueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm, Controller } from "react-hook-form";
import QRCode from "react-qr-code";
import { baseUrlFrontEnd } from "../../../utils/strings";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import moment from "moment";

const TambahStokOpname = () => {
  moment.locale("id");
  const navigate = useNavigate();
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

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleShowPilihBarang = () => {
    setIsShowModal(true)
  }

  const breadcrumbs = [
    { link: "/stok-opname", menu: "Stok Opname" },
    { link: "/stok-opname/tambah", menu: "Tambah" },
  ];

  const tambahDataStokOpname = (obj) => {
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
      setValue(`id_produk.${data.length}`, obj.id)
      setIsShowModal(true)
    } else  {
      const newData = data.filter((item) => item.id_produk != obj.id)
      setData(newData)
    }
  }

  const queryClient = new QueryClient();
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
    const data = res.data;

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

  const simpanStokOpname = async (data) => {
    await simpanStokOpnameMutation.mutate(data)
  }

  const simpanStokOpnameMutation = useMutation(
    async (data) => {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const response = await axios.post("laporan/simpan-stok-opname", data, config);
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
        }

        if (error) {
          setErrMessage(error.message);
        }
      },
      onSuccess: async () => {
        toastSuccess("Stok Opname Berhasil Disimpan");
      },
      onError: async () => {
        toastError("Stok Opname Gagal Disimpan");
      },
    }
  );

  return (
    <>
      <HeaderContent title="Stok Opname" breadcrumbs={breadcrumbs} />
      <div className="bg-white h-max px-6 rounded-lg mt-4 flex gap-x-3.5 relative">
      <div className="col-span-3">
          <Link to={!isAction && "/stok-opname"}>
            <Button
              className="text-xs bg-custom-navy border-custom-navy"
              type="button"
              startIcon={<BsArrowLeftCircle size={16} />}
              loading={false}
              title="Kembali"
            />
          </Link>
        </div>
        <div className="col-span-3">
          <Button
            className="text-xs bg-custom-purple border-custom-purple"
            type="button"
            startIcon={<BsFillPlusCircleFill size={16} />}
            loading={false}
            title="Pilih Barang"
            onClick={handleShowPilihBarang}
          />
        </div>
      </div>

      <FormProvider errors={errors} control={control}>
        <form onSubmit={handleSubmit(simpanStokOpname)}>
          <LaporanTambahStokOpname
            ref={componentRef}
            tanggalAwal={tanggalAwal}
            tanggalAkhir={tanggalAkhir}
            data={data}
            onDeleteProduk={(id_produk) => {
              const newData = data.filter((item) => item.id_produk != id_produk)
              setData(newData)
            }}
          />
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
      </FormProvider>
      {isShowModal ? (
        <>
          <div className="fixed inset-0 z-30 overflow-y-auto">
            <div className="fixed inset-0 w-full h-full bg-black opacity-30"></div>
            <div className="flex items-center min-h-full px-4 py-8">
              <div className="relative w-90 max-w-lg p-4 mx-auto bg-white rounded-xl shadow-lg">
                <div className="sm:flex">
                  <div className="mx-auto">
                    <h4 className="text-lg text-left font-medium my-6 text-gray-800">
                      Pilih Barang Untuk Stok Opname
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
                          <LoadingTable colSpan="3" />
                        ) : dataProduk?.data.length > 0 ? (
                          dataProduk?.data?.map((obj, key) => (
                            <tr
                              className={`${(data.some((item) => item.id_produk == obj.id) ? "bg-red-100" : "bg-white")} border-b border-custom-purple-light cursor-pointer`} onClick={() => tambahDataStokOpname(obj)}
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

export default TambahStokOpname;
