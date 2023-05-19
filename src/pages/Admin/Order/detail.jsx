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
        const confirm = swConfirm(
          "Apakah Anda Yakin",
          "Ingin Mengubah Status Order",
          "Iya, Saya Ubah"
        );
        confirm.then((result) => {
          if (result.isConfirmed) {
            mutationUbahStatusOrder.mutate({ status: status });
          }
        });
      }
    } else {
      const confirm = swConfirm(
        "Apakah Anda Yakin",
        "Ingin Mengubah Status Order",
        "Iya, Saya Ubah"
      );
      confirm.then((result) => {
        if (result.isConfirmed) {
          mutationUbahStatusOrder.mutate({ status: status });
        }
      });
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
                  <div class="space-x-2 flex justify-start items-center">
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
                                    Makanan Pedas
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
                        onClick={() => ubahStatusOrder("open")}
                      >
                        Open
                      </span>
                      <span
                        className={`order__status-item ${
                          statusOrder == "in_progress" && "active"
                        }`}
                        onClick={() => ubahStatusOrder("in_progress")}
                      >
                        In Progress
                      </span>
                      <span
                        className={`order__status-item ${
                          statusOrder == "closed" && "active"
                        }`}
                        onClick={() => ubahStatusOrder("closed")}
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
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <h1>No Meja</h1>
                  <p className="font-semibold text-sm">{state.meja.no_meja}</p>
                </div>
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

                  <div class="w-full">
                    <label class="label">
                      <span class="label-text text-xs">Pembayaran</span>
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

                  <div class="w-full">
                    <label class="label">
                      <span class="label-text text-xs">Kembalian</span>
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
    </div>
  );
}
