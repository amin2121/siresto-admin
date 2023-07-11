import React, { useState, useRef, useEffect } from "react";
import "./order.css";

// components
import { Button } from "../../../components/Button";
import HeaderContent from "../../../layouts/HeaderContent";
import { Input, InputGroupCurrency, Textarea } from "../../../components/Input";
import Badge from "../../../components/Badge";

// icons
import { BiSearch } from "react-icons/bi";
import { BsFillTrash2Fill } from "react-icons/bs";
import { RiBankCardLine } from "react-icons/ri";
import { HiArrowRight } from "react-icons/hi";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";

// libraries
import axios from "../../../utils/axios";
import { swNormal, swConfirm } from "../../../utils/sw";
import {
  rupiahToNumber,
  rupiah,
  baseUrl,
  capitalize,
} from "../../../utils/strings";
import { useMutation, QueryClient, useQuery } from "react-query";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import AsyncCreatableSelect from "react-select/async-creatable";
import MetodePembayaran from "../../../components/MetodePembayaran";
import { toastSuccess, toastError } from "../../../utils/toast";

export default function Detail() {
  const location = useLocation();
  const state = location.state;

  const user = JSON.parse(localStorage.getItem("user"));
  const [produk, setProduk] = useState(state.order_detail);
  const [kembalian, setKembalian] = useState("");
  const { metodePembayaran } = useSelector((state) => state.pembayaran);
  const [statusOrder, setStatusOrder] = useState(state.status_order);
  const [statusBayar, setStatusBayar] = useState(state.status_bayar);
  const [loading, setLoading] = useState(false);
  const [diskon, setDiskon] = useState(state.diskon);
  const [subtotal, setSubtotal] = useState(state.nilai_transaksi);
  const [errMessage, setErrMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const navigate = useNavigate();

  const breadcrumbs = [
    { link: "/", menu: "Home" },
    { link: "/order", menu: "Order" },
    { link: "/order/detail", menu: "Detail Order" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    control,
    setValue,
  } = useForm();

  useEffect(() => {
    if (state == null) {
      navigate("/order");
    }
  }, []);

  const hitungKembalian = () => {
    let pembayaran = document.getElementById("input-nilai-pembayaran");
    let kembalian = rupiahToNumber(pembayaran.value) - subtotal;

    setValue("kembalian", kembalian);
  };

  const mutation = useMutation(
    async (data) => {
      data.diskon = diskon;
      data.subtotal = subtotal;
      data.metode_pembayaran = metodePembayaran;
      data.pembayaran = rupiahToNumber(data.pembayaran);
      data.kembalian = data.kembalian;
      data.status_order = "in_progress";
      data.status_bayar = "already_paid";

      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const response = await axios.put("order/" + state.id, data, config);
      const res = response.data;

      if (res.meta.code != 200) {
        throw new Error(res.meta.message);
      }

      return res.data;
    },
    {
      onMutate: () => {
        // spinner
        setLoading(true);
      },
      onSettled: async (data, error) => {
        setLoading(false);

        if (data) {
          reset();
          clearErrors();
          setStatusOrder(data.status_order);
          setStatusBayar(data.status_bayar);
        }
      },
      onSuccess: async () => {
        toastSuccess("Pembayaran Berhasil Dilakukan");
      },
      onError: async () => {
        toastError("Pembayaran Gagal Dilakukan");
      },
    }
  );

  const pembayaran = async (data) => {
    if (
      data.pembayaran === null ||
      data.kembalian === null ||
      data.pembayaran == "" ||
      data.kembalian == "" ||
      data.pembayaran == 0 ||
      data.kembalian == 0
    ) {
      toastError("Silahkan Isi Pembayaran Pelanggan Terlebih Dahulu");
    } else {
      await mutation.mutate(data);
    }
  };

  const mutationUbahStatusOrder = useMutation(
    async (data) => {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const response = await axios.patch(
        "order/ubah-status-order/" + state.id,
        data,
        config
      );
      const res = response.data;

      if (res.meta.code != 200) {
        throw new Error(res.meta.message);
      }

      return res.data;
    },
    {
      onMutate: () => {
        // spinner
        setLoading(true);
      },
      onSettled: async (data, error) => {
        setLoading(false);

        if (data) {
          reset();
          setErrMessage("");
          clearErrors();
          setStatusOrder(data.status_order);
        }
      },
      onSuccess: async () => {
        toastSuccess("Status Order Berhasil Diubah");
      },
      onError: async () => {
        toastError("Status Order Gagal Diubah");
      },
    }
  );

  const ubahStatusOrder = (status) => {
    if (statusBayar == "not_paid") {
      if (status == "closed") {
        toastError("Silahkan Membayar Dahulu Sebelum Menyelesaikan Pesanan");
      } else {
        // const confirm = swConfirm(
        //   "Apakah Anda Yakin",
        //   "Ingin Mengubah Status Order",
        //   "Iya, Saya Ubah"
        // );
        // confirm.then((result) => {
        //   if (result.isConfirmed) {
        mutationUbahStatusOrder.mutate({ status: status });
        //   }
        // });
      }
    } else {
      // const confirm = swConfirm(
      //   "Apakah Anda Yakin",
      //   "Ingin Mengubah Status Order",
      //   "Iya, Saya Ubah"
      // );
      // confirm.then((result) => {
      //   if (result.isConfirmed) {
      mutationUbahStatusOrder.mutate({ status: status });
      // }
      // });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(pembayaran)}>
        <div className="h-max">
          <div className="grid grid-cols-12 mb-6">
            <div className="md:col-span-7 col-span-12">
              <div className="w-full pl-3 pr-1 mt-3 order-list__container">
                <div className="flex justify-between items-center order-list__title border-b border-zinc-200 pb-4 mx-4 flex-wrap">
                  <div className="space-x-2 flex justify-start items-center">
                    <Link to="/order">
                      <BiArrowBack size="20" className="text-blue-500" />
                    </Link>
                    <h2 className="text-black text-xl font-semibold">
                      Order Detail / {state.no_transaksi}
                    </h2>
                  </div>
                  <p className="text-lg text-black">
                    {state != null ? produk.length : 0} Item
                  </p>
                </div>

                <div className="order-list__content grid grid-cols-7 mt-5 px-4">
                  <table className="table-fixed w-full col-span-full">
                    <thead>
                      <tr>
                        <th className="text-slate-400 uppercase text-xs text-left pb-5">
                          Detail Item
                        </th>
                        <th className="text-slate-400 uppercase text-xs text-left pb-5 hidden lg:table-cell">
                          Jumlah Beli
                        </th>
                        <th className="text-slate-400 uppercase text-xs text-left pb-5 hidden md:table-cell lg:table-cell w-24">
                          Harga
                        </th>
                        <th className="text-slate-400 uppercase text-xs text-right pb-5 w-24">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {produk != null &&
                        produk.map((obj, key) => (
                          <tr
                            key={obj.id}
                            className="border-b border-slate-200"
                          >
                            <td>
                              <div className="flex items-center space-x-3">
                                <img
                                  src={baseUrl + obj.produk.gambar}
                                  alt={obj.produk.gambar}
                                  className="h-16 w-16 object-cover rounded"
                                />
                                <div className="justify-items-center">
                                  <h5 className="text-md text-black">
                                    {obj.produk.nama_produk}
                                  </h5>
                                  <span className="text-xs text-blue-400">
                                    {obj.produk.kategori_produk.kategori_produk}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="text-center hidden lg:table-cell">
                              <div className="block mr-1 text-sm font-bold text-blue-500 h-full">
                                x{obj.jumlah_beli}
                              </div>
                            </td>
                            <td className="hidden md:table-cell lg:table-cell">
                              <span className="block text-sm text-slate-500">
                                IDR {rupiah(obj.produk.harga_jual)}
                              </span>
                            </td>
                            <td className="text-right">
                              <span className="inline-block mr-1 text-sm font-bold text-blue-500">
                                IDR {rupiah(obj.total_harga_jual)}
                              </span>
                              {obj.produk.diskon > 0 && (
                                <span className="text-xs text-slate-300 block">
                                  - IDR{" "}
                                  {rupiah(obj.produk.diskon * obj.jumlah_beli)}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  <div className="flex justify-end col-span-full border-b border-slate-200">
                    <div className="w-1/2 bg-white sticky bottom-0 left-0 pl-6 py-4 space-y-3 mt-5">
                      <div className="flex justify-between text-xs text-slate-700">
                        <p className="font-medium">Subtotal :</p>
                        <p className="font-medium">
                          Rp.{" "}
                          {rupiah(
                            parseInt(subtotal) +
                              parseInt(diskon) -
                              (parseInt(state.pajak) +
                                parseInt(state.service_charge))
                          )}
                        </p>
                      </div>
                      <div className="flex justify-between text-xs text-green-500">
                        <p className="font-medium">Diskon :</p>
                        <p className="font-medium">Rp. {rupiah(diskon)}</p>
                      </div>
                      <div className="flex justify-between text-xs text-slate-700">
                        <p className="font-medium">Pajak :</p>
                        <p className="font-medium">Rp. {rupiah(state.pajak)}</p>
                      </div>
                      <div className="flex justify-between text-xs text-slate-700">
                        <p className="font-medium">Service Charge :</p>
                        <p className="font-medium">
                          Rp. {rupiah(state.service_charge)}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="font-bold text-slate-700">Total :</p>
                        <p className="font-bold text-blue-500">
                          Rp. {rupiah(subtotal)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center col-span-full pt-5 pb-5 border-b border-slate-200 flex-wrap space-y-2">
                    <h1 className="text-sm">Status Order : </h1>
                    <div className="space-x-2 order__status-container text-sm flex overflow-x-auto overflow-y-hidden">
                      <span
                        className={`order__status-item ${
                          statusOrder == "open" && "active"
                        }`}
                        onClick={() => {
                          setOrderStatus("open");
                          setShowModal(true);
                        }}
                      >
                        Open
                      </span>
                      <span
                        className={`order__status-item ${
                          statusOrder == "in_progress" && "active"
                        }`}
                        onClick={() => {
                          setOrderStatus("in_progress");
                          setShowModal(true);
                        }}
                      >
                        In Progress
                      </span>
                      <span
                        className={`order__status-item ${
                          statusOrder == "closed" && "active"
                        }`}
                        onClick={() => {
                          setOrderStatus("closed");
                          setShowModal(true);
                        }}
                      >
                        Closed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded md:col-span-5 col-span-12 md:right-0 flex flex-col px-2">
              <div className="border border-slate-200 rounded p-4">
                <h1 className="text-sm text-black font-semibold mb-2">
                  Detail Lainnya
                </h1>
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <h1>Pelanggan</h1>
                  <p className="font-semibold text-sm">
                    {state.nama_pelanggan}
                  </p>
                </div>
                {state.meja === null ? (
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <h1>Jenis Order</h1>
                    <p className="font-semibold text-sm">{state.source}</p>
                  </div>
                ) : (
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <h1>No Meja</h1>
                    <p className="font-semibold text-sm">
                      {state.meja.no_meja}
                    </p>
                  </div>
                )}
                <div className="flex justify-between text-xs text-slate-500">
                  <h1>Status Bayar</h1>
                  <p className="font-semibold text-sm">
                    {statusBayar == "already_paid" ? (
                      <Badge title="Sudah Bayar" type="success" />
                    ) : (
                      <Badge title="Belum Bayar" type="error" />
                    )}
                  </p>
                </div>
              </div>
              <div
                className={`border border-slate-200 rounded p-4 pb-6 mt-4 ${
                  statusBayar == "already_paid" && "hidden"
                }`}
              >
                <h1 className="text-sm text-black font-semibold mb-2">
                  Pembayaran
                </h1>
                <div className="order-pembayaran__form">
                  <div className="w-full">
                    <label className="label">
                      <span className="label-text text-xs">
                        Metode Pembayaran
                      </span>
                    </label>
                    <MetodePembayaran />
                  </div>

                  <div className="w-full">
                    <label className="label">
                      <span className="label-text text-xs">Pembayaran</span>
                    </label>
                    <InputGroupCurrency
                      type="text"
                      id="input-nilai-pembayaran"
                      directionIcon="left"
                      name="pembayaran"
                      icon="IDR"
                      onChange={hitungKembalian}
                      placeholder="Pembayaran"
                      control={control}
                      error={errors.pembayaran ? true : false}
                    />
                  </div>

                  <div className="w-full">
                    <label className="label">
                      <span className="label-text text-xs">Kembalian</span>
                    </label>
                    <InputGroupCurrency
                      type="text"
                      id="input-kembalian"
                      readOnly={true}
                      directionIcon="left"
                      name="kembalian"
                      icon="IDR"
                      placeholder="Kembalian"
                      control={control}
                      error={errors.kembalian ? true : false}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-active bg-blue-500 border-0 hover:bg-blue-600 btn-block text-white flex justify-between !mt-8"
                  >
                    <span>Bayar Sekarang</span>
                    <HiArrowRight size={16} />
                  </button>
                </div>
              </div>
              <div
                className={`border border-slate-200 rounded p-4 mt-4 ${
                  statusBayar == "not_paid" && "hidden"
                }`}
              >
                <h1 className="text-sm text-black font-semibold mb-2">
                  Detail Pembayaran
                </h1>
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <h1>Nilai Transaksi</h1>
                  <p className="font-semibold text-sm">
                    {rupiah(state.nilai_transaksi)}
                  </p>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <h1>Metode Pembayaran</h1>
                  <p className="font-semibold text-sm">
                    {capitalize(state.metode_pembayaran || "")}
                  </p>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <h1>Pajak</h1>
                  <p className="font-semibold text-sm">
                    {rupiah(state.pajak || 0)}
                  </p>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <h1>Service Charge</h1>
                  <p className="font-semibold text-sm">
                    {rupiah(state.service_charge || 0)}
                  </p>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <h1>Pembayaran</h1>
                  <p className="font-semibold text-sm">{rupiah(state.bayar)}</p>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <h1>Kembali</h1>
                  <p className="font-semibold text-sm">
                    {rupiah(state.kembali)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {showModal ? (
        <>
          <div className="fixed inset-0 z-30 overflow-y-auto">
            <div className="fixed inset-0 w-full h-full bg-black opacity-50"></div>
            <div className="flex items-center min-h-screen px-4 py-8">
              <div className="relative w-90 max-w-lg p-4 mx-auto bg-white rounded-xl shadow-lg">
                <div className="mt-3 sm:flex">
                  <div className="flex items-center justify-center flex-none w-5 h-5 mx-auto mt-2 mr-3 bg-red-100 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-yellow-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="mt-1 mx-auto">
                    <h4 className="text-lg text-left font-medium text-gray-800">
                      Apakah Anda Yakin?
                    </h4>
                    <p className="mt-2 text-left text-[15px] leading-relaxed text-gray-500">
                      Ingin Mengubah Status Order
                    </p>
                    <div className="items-center gap-2 mt-4 sm:flex">
                      <button
                        className="w-full h-10 px-12 py-1 mt-2 p-2.5 flex-1 text-white bg-green-500 rounded-md outline-none ring-offset-2 ring-green-500 focus:ring-2"
                        onClick={() => {
                          ubahStatusOrder(orderStatus);
                          setShowModal(false);
                        }}
                      >
                        Ubah
                      </button>
                      <button
                        className="w-full h-10 px-12 py-1 mt-2 mr-6 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                        onClick={() => setShowModal(false)}
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
