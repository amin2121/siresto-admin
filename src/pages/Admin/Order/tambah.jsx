import React, { useState, useEffect, useRef } from "react";
import "./order.css";

// components
import HeaderContent from "../../../layouts/HeaderContent";
import {
  InputGroup,
  Input,
  InputGroupCurrency,
  Textarea,
} from "../../../components/Input";
import LoadingPage from "../../../components/LoadingPage";

// icons
import { HiArrowRight } from "react-icons/hi";
import { FiTrash2, FiSearch } from "react-icons/fi";

// libraries
import axios from "../../../utils/axios";
import { rupiah, baseUrl } from "../../../utils/strings";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toastError } from "../../../utils/toast";
import PilihPromo from "../../../components/PilihPromo";
import { Button } from "../../../components/Button";

const Tambah = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [rowCart, setRowCart] = useState([]);
  const [settingPembayaran, setSettingPembayaran] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const promo = JSON.parse(localStorage.getItem("promo"));

  let discount =
    rowCart.length > 0
      ? rowCart.reduce((n, { harga_total_diskon }) => n + harga_total_diskon, 0)
      : 0; // menjumlahkan harga total diskon
  let subtotal =
    rowCart.length > 0
      ? rowCart.reduce((n, { harga_total }) => n + harga_total, 0)
      : 0; // menjumlahkan harga total

  let chargeService =
    settingPembayaran?.status_charge_service === 1
      ? settingPembayaran?.charge_service
      : 0;
  let pajak =
    settingPembayaran?.status_pajak === 1
      ? (settingPembayaran?.pajak *
          (subtotal - discount - (promo ? parseInt(promo.promo) : 0))) /
        100
      : 0;
  let pajakPersen =
    settingPembayaran?.status_pajak === 1 ? settingPembayaran?.pajak : 0;

  let totalSemua =
    subtotal +
    parseInt(chargeService) +
    parseInt(pajak) -
    parseInt(discount) -
    (promo ? parseInt(promo.promo) : 0);

  const breadcrumbs = [
    { link: "/", menu: "Home" },
    { link: "/order", menu: "Order" },
    { link: "/order/tambah", menu: "Tambah Order" },
  ];

  // get produk
  const {
    isLoading,
    isError,
    error,
    data,
    isSuccess,
    isFetching,
    refetch,
    isPreviousData,
  } = useQuery(["data-produk", page], () => getProduk(), {
    staleTime: 15000,
    refetchInterval: 15000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const filteredData = data?.filter((item) => item.status_produk === "1");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    control,
  } = useForm();

  const tambahDataOrder = async (e) => {
    e.preventDefault();

    let data_produk = {
      subtotal: subtotal,
      diskon_total: discount,
      pajak: pajak,
      statusChargeService:
        settingPembayaran?.status_charge_service == null
          ? 0
          : settingPembayaran.status_charge_service,
      statusPajak:
        settingPembayaran?.status_pajak == null
          ? 0
          : settingPembayaran.status_pajak,
      chargeService: chargeService,
      pajakPersen: pajakPersen,
      totalSemua: totalSemua,
      produk: [...rowCart],
    };

    if (rowCart.length == 0) {
      toastError("Pilih Makanan & Minuman Terlebih Dahulu");
    } else {
      navigate(
        "/order/pembayaran",
        rowCart.length > 0 && { state: data_produk }
      );
    }
  };

  const getProduk = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    const response = await axios.get(
      `produk?s=${keyword}&limit=${10}&sort=DESC&page=${page}`
    );
    const res = await response.data.data;
    const data = res.data.data;

    return data;
  };

  const getSettingPembayaran = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    const response = await axios.get(`setting`);
    const res = await response.data.data;

    setSettingPembayaran(res);
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = () => {
    localStorage.removeItem("promo");
  };

  useEffect(() => {
    getSettingPembayaran();
  }, []);

  useEffect(() => {
    refetch();
  }, [keyword]);

  const pakaiDiskon = (index, item, e) => {
    let inputHargaDiskon = document.getElementById(
      `input-harga-diskon-${item.id}`
    );
    let rowCartBaru = [...rowCart];

    inputHargaDiskon.classList.add("hidden");
    rowCartBaru[index]["harga_total"] =
      (+item.harga_jual - +item.diskon) * +item.jumlah_produk;

    setRowCart(rowCartBaru);
  };

  const ubahJumlahPesanProduk = (index, e) => {
    let rowCartBaru = [...rowCart];
    let jumlahProdukBaru =
      e.target.value === "" || +e.target.value <= 0 ? 1 : e.target.value;

    rowCartBaru[index][e.target.name] = e.target.value;
    rowCartBaru[index]["harga_total"] =
      (rowCartBaru[index]["harga_jual"] - rowCartBaru[index]["diskon"]) *
      jumlahProdukBaru;
    rowCartBaru[index]["harga_total_diskon"] =
      rowCartBaru[index]["diskon"] * jumlahProdukBaru;
    setRowCart(rowCartBaru);
  };

  const hapusRowProduk = (index, id) => {
    let rowCarts = [...rowCart];
    rowCarts.splice(index, 1);
    setRowCart(rowCarts);
  };

  const tambahRowCart = (item) => {
    let cart = rowCart.find((value) => value.id === item.id);
    let rowCartBaru = [...rowCart];
    if (cart !== undefined) {
      let index = rowCart.indexOf(cart);
      rowCartBaru[index]["jumlah_produk"] += 1;
      rowCartBaru[index]["harga_total"] =
        (rowCartBaru[index]["harga_jual"] - rowCartBaru[index]["diskon"]) *
        rowCartBaru[index]["jumlah_produk"];

      rowCartBaru[index]["harga_total_diskon"] =
        rowCartBaru[index]["diskon"] * rowCartBaru[index]["jumlah_produk"];
      setRowCart(rowCartBaru);
    } else {
      setRowCart([
        ...rowCart,
        {
          id: item.id,
          nama_produk: item.nama_produk,
          harga_jual: item.harga_jual,
          jumlah_produk: 1,
          harga_total: (+item.harga_jual - +item.diskon) * 1,
          pakai_diskon: true,
          diskon: item.diskon,
          catatan: "",
          gambar: item.gambar,
          harga_total_diskon: +item.diskon * 1,
        },
      ]);
    }
  };

  const layoutRowCart = (item, index) => {
    return (
      <div
        key={index}
        className="w-full bg-white rounded-lg p-2 duration-200 hover:bg-blue-100 collapse"
      >
        <input type="checkbox" className="!p-0 !min-h-0 !w-3/4" />
        <div className="collapse-title flex cursor-pointer p-0 min-h-0">
          <img
            src={baseUrl + item.gambar}
            alt={item.nama_produk}
            className="h-14 w-14 object-cover rounded mr-2"
          />
          <div className="flex-1 flex align-center">
            <div className="flex flex-1 flex-col mr-2">
              <p className="text-sm font-semibold text-slate-700 mb-1">
                {item.nama_produk}
              </p>
              <span
                className="text-xs text-slate-500"
                id={`span-jumlah-produk-${item.id}`}
              >
                x{item.jumlah_produk}
              </span>
            </div>
            <div className="flex flex-col content-end justify-between">
              <p
                className="text-sm font-medium text-blue-500"
                id={`span-harga-jual-total-${item.id}`}
              >
                Rp. {rupiah(item.harga_jual)}
              </p>
              <div className="flex justify-end">
                <FiTrash2
                  className="cursor-pointer hover:text-red-400 duration-200"
                  size="20"
                  onClick={() => hapusRowProduk(index, item.id)}
                />
              </div>
            </div>
          </div>

          <input type="hidden" defaultValue={item.id} />
          <input type="hidden" defaultValue={item.nama_produk} />
          <input type="hidden" defaultValue={item.harga_jual} />
        </div>
        <div className="collapse-content space-y-2 p-0">
          <div className="form-control mt-2">
            <label className="label cursor-pointer py-0">
              <span className="label-text text-xs text-slate-500">Jumlah</span>
              <Input
                type="number"
                value={item.jumlah_produk}
                placeholder="Jumlah Produk"
                className="input-sm w-40 max-w-xs"
                id={`input-jumlah-produk-${item.id}`}
                onChange={(e) => ubahJumlahPesanProduk(index, e)}
                name="jumlah_produk"
              />
            </label>
          </div>

          {/*<div className="form-control p-0">
						<label className="label cursor-pointer py-0">
							<span className="label-text text-xs text-slate-500">Pakai Diskon</span>
				  			<input type="checkbox" className="toggle toggle-secondary" onChange={(e) => pakaiDiskon(index, item, e)}/>
						</label>
					</div>*/}

          <div
            className="form-control hidden"
            id={`input-harga-diskon-${item.id}`}
          >
            <label className="label cursor-pointer py-0">
              <span className="label-text text-xs text-slate-500">Diskon</span>
              <InputGroupCurrency
                icon="Rp."
                placeholder="Diskon"
                required
                label="diskon"
                className="input-sm"
                parentClassName="w-40 max-w-xs"
                defaultValue={rupiah(item.diskon)}
              />
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer py-1">
              <span className="label-text text-xs text-slate-500">Catatan</span>
            </label>
            <Textarea
              className="h-24 mx-1"
              placeholder="Catatan"
              label="catatan"
            />
          </div>
        </div>
      </div>
    );
  };

  // showing produk
  const layoutProduk = (item, index) => {
    return (
      <div
        className="bg-slate-100 hover:bg-gray-300 cursor-pointer duration-200 rounded-lg h-fit"
        onClick={() => tambahRowCart(item)}
        key={index}
      >
        <div className="px-2 pt-2">
          <img
            src={baseUrl + item.gambar}
            alt={item.nama_produk}
            className="h-40 w-full object-cover rounded"
          />
        </div>
        <div className="px-2 py-2">
          <h5 className="text-sm font-bold text-slate-900">
            {item.nama_produk}
          </h5>
          <div className="relative mt-3">
            <p className="text-md font-semibold text-blue-500 inline-block mr-1">
              Rp. {rupiah(item.harga_jual)}
            </p>
            {item.diskon != 0 && (
              <span className="text-xs text-gray-500 line-through absolute">
                Rp. {rupiah(item.diskon)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <form onSubmit={tambahDataOrder}>
        <input type="hidden" defaultValue={discount} />
        <input type="hidden" defaultValue={subtotal} />

        <div className="h-max">
          <div className="grid grid-cols-12 gap-4 mb-6">
            <div className="col-span-8 mt-2 flex flex-col">
              <HeaderContent title="Tambah Order" breadcrumbs={breadcrumbs} />
              <div className="grid grid-cols-6 mb-2 mt-2">
                <div className="col-span-3 px-6">
                  <InputGroup
                    type="text"
                    id="input-search"
                    icon={<FiSearch size={20} />}
                    placeholder="Cari Produk"
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 w-full pl-6 pr-3 flex-1">
                {isLoading && (
                  <div className="flex justify-center items-center flex-col col-span-3 space-y-3">
                    <LoadingPage />
                  </div>
                )}
                {filteredData?.length > 0
                  ? filteredData.map((item, index) => layoutProduk(item, index))
                  : !isLoading && (
                      <div className="flex justify-center items-center flex-col col-span-3 space-y-3">
                        <p>
                          Data Produk Kosong, Silahkan Menambahkan Data Produk
                          Terlebih Dahulu
                        </p>
                      </div>
                    )}
              </div>
            </div>
            <div className="col-span-4 bg-slate-100 rounded relative flex flex-col pesanan-pelanggan__container">
              <h5 className="text-slate-700 px-4 font-semibold mb-4 mt-2">
                Pesanan Pelanggan :
              </h5>
              <div className="space-y-3 px-4">
                {rowCart.map((item, index) => layoutRowCart(item, index))}
              </div>

              <div className="flex grow items-end">
                <div className="w-full bg-white sticky bottom-0 left-0 px-4 py-4 space-y-3 mt-5">
                  <button
                    type="button"
                    className="btn gap-3flex items-center justify-between w-full bg-blue-400 border-0 hover:bg-blue-700 text-xs mb-5"
                    onClick={() => setIsShowModal(true)}
                  >
                    {promo ? (
                      <span className="flex items-center">
                        {promo.judul_promo} (IDR {rupiah(promo.promo)})
                      </span>
                    ) : (
                      <span className="flex items-center">Pilih Promo</span>
                    )}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {isShowModal ? (
                    <>
                      <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="fixed inset-0 w-full h-full bg-black opacity-20"></div>
                        <div className="flex items-center min-h-screen px-4 py-8">
                          <div className="relative w-full max-w-lg p-10 mx-auto bg-white rounded-xl shadow-lg">
                            <PilihPromo />
                            <div className="w-full px-4 bottom-10 left-0">
                              <Button
                                title="Pilih"
                                type="button"
                                className="w-full bg-blue-500 border-0 hover:bg-blue-700 text-xs"
                                onClick={() => setIsShowModal(false)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}

                  <div className="flex justify-between text-xs text-slate-700">
                    <p className="font-medium">Subtotal :</p>
                    <p className="font-medium">Rp. {rupiah(subtotal)}</p>
                  </div>
                  <div className="flex justify-between text-xs ">
                    <p className="font-medium text-green-500">Discount :</p>
                    <p className="font-medium text-green-500">
                      - Rp.{" "}
                      {rupiah(discount + (promo ? parseFloat(promo.promo) : 0))}
                    </p>
                  </div>
                  {settingPembayaran?.status_charge_service === 1 ? (
                    <div className="flex justify-between text-xs text-slate-700">
                      <p className="font-medium">Servic Charge :</p>
                      <p className="font-medium">Rp. {rupiah(chargeService)}</p>
                    </div>
                  ) : (
                    ""
                  )}
                  {settingPembayaran?.status_pajak === 1 ? (
                    <div className="flex justify-between text-xs text-slate-700">
                      <p className="font-medium">Pajak :</p>
                      <p className="font-medium">Rp. {rupiah(pajak)}</p>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="flex justify-between border-t border-zinc-200 pt-2">
                    <p className="font-bold text-lg text-slate-700">Total :</p>
                    <p className="font-bold text-blue-500 text-xl">
                      Rp. {rupiah(totalSemua)}
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-active bg-blue-500 border-0 hover:bg-blue-600 btn-block text-white flex justify-between !mt-6"
                  >
                    <span>Lakukan Pembayaran</span>
                    <HiArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      </form>
    </div>
  );
};

export default Tambah;
