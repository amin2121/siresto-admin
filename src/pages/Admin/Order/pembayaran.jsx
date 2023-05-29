import React, { useState, useRef, useEffect } from "react";
import "./order.css";

// components
import { Button } from "../../../components/Button";
import { Input, InputGroupCurrency, Textarea } from "../../../components/Input";
import { Struk } from "./Cetak/struk";

// icons
import { FiSave } from "react-icons/fi";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

// libraries
import axios from "../../../utils/axios";
import { rupiahToNumber, rupiah, baseUrl } from "../../../utils/strings";
import { useMutation, QueryClient, useQuery } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import AsyncCreatableSelect from "react-select/async-creatable";
import MetodePembayaran from "../../../components/MetodePembayaran";
import { toastSuccess, toastError } from "../../../utils/toast";
import ReactToPrint, { useReactToPrint } from "react-to-print";

const colourStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    height: "3rem",
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
    borderRadius: "10px",
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

export default function Pembayaran() {
  const location = useLocation();
  const state = location.state;
  const user = JSON.parse(localStorage.getItem("user"));
  const promo = JSON.parse(localStorage.getItem("promo"));
  const [produk, setProduk] = useState(state.produk);
  const [isAction, setIsAction] = useState(false);
  const [bayar, setBayar] = useState(0);
  const [resto, setResto] = useState({});
  const [settingPembayaran, setSettingPembayaran] = useState([]);
  const [kembalian, setKembalian] = useState(0);
  const { metodePembayaran } = useSelector((state) => state.pembayaran);
  const [diskon, setDiskon] = useState(state.diskon_total);
  const [subtotal, setSubtotal] = useState(state.subtotal);
  const [pajak, setPajak] = useState(state.pajak);
  const [chargeService, setChargeService] = useState(state.chargeService);
  const [totalSemua, setTotalSemua] = useState(
    state.totalSemua + (promo ? parseFloat(promo.promo) : 0)
  );
  const [errMessage, setErrMessage] = useState("");
  const navigate = useNavigate();

  const breadcrumbs = [
    { link: "/", menu: "Home" },
    { link: "/order", menu: "Order" },
    { link: "/order/pembayaran", menu: "Pembayaran Order" },
  ];

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

  const fetchResto = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    const response = await axios.get("resto/show/");
    const res = await response.data.data;

    setResto(res);
  };

  const componentRef = useRef();
  const queryClient = new QueryClient();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      queryClient.invalidateQueries("data-order");
      navigate("/order");
    },
  });

  useEffect(() => {
    if (state == null) {
      navigate("/order/tambah");
    }

    fetchResto();
  }, []);

  const hitungKembalian = () => {
    let pembayaran = document.getElementById("input-nilai-pembayaran");
    let kembalian =
      rupiahToNumber(pembayaran.value) -
      (totalSemua - (promo ? parseFloat(promo.promo) : 0));

    setBayar(rupiahToNumber(getValues("pembayaran")));
    setKembalian(kembalian);

    setValue("kembalian", kembalian);
  };

  const tambahJumlahBeli = (id) => {
    let cart = produk.find((value) => value.id === id);
    let produkBaru = [...produk];

    if (cart !== undefined) {
      let index = produk.indexOf(cart);
      produkBaru[index]["jumlah_produk"] =
        parseInt(produkBaru[index]["jumlah_produk"]) + 1;

      let jumlahProduk =
        produkBaru[index]["jumlah_produk"] == ""
          ? 0
          : produkBaru[index]["jumlah_produk"];
      let harga_jual = produkBaru[index]["harga_jual"];
      let diskon = produkBaru[index]["diskon"];

      produkBaru[index]["harga_total"] = (harga_jual - diskon) * jumlahProduk;

      produkBaru[index]["harga_total_diskon"] = diskon * jumlahProduk;

      setProduk(produkBaru);
    }

    hitungTotal();
  };

  const ubahJumlahBeli = (index, value) => {
    let produkBaru = [...produk];
    produkBaru[index]["jumlah_produk"] = parseInt(value && 0);

    let jumlahProduk =
      produkBaru[index]["jumlah_produk"] == ""
        ? 0
        : produkBaru[index]["jumlah_produk"];
    let harga_jual = produkBaru[index]["harga_jual"];
    let diskon = produkBaru[index]["diskon"];
    let pajak = produkBaru[index]["pajak"];

    produkBaru[index]["harga_total"] = (harga_jual - diskon) * jumlahProduk;

    produkBaru[index]["harga_total_diskon"] = diskon * jumlahProduk;

    setProduk(produkBaru);
    hitungTotal();
  };

  const kurangJumlahBeli = (id) => {
    let cart = produk.find((value) => value.id === id);
    let produkBaru = [...produk];

    if (cart !== undefined) {
      let index = produk.indexOf(cart);
      if (produkBaru[index]["jumlah_produk"] > 1) {
        produkBaru[index]["jumlah_produk"] =
          parseInt(produkBaru[index]["jumlah_produk"]) - 1;

        let jumlahProduk =
          produkBaru[index]["jumlah_produk"] == ""
            ? 0
            : produkBaru[index]["jumlah_produk"];
        let harga_jual = produkBaru[index]["harga_jual"];
        let diskon = produkBaru[index]["diskon"];

        produkBaru[index]["harga_total"] = (harga_jual - diskon) * jumlahProduk;

        produkBaru[index]["harga_total_diskon"] = diskon * jumlahProduk;

        setProduk(produkBaru);
      } else {
        toastError("Jumlah beli tidak boleh kurang dari 1");
      }
    }

    hitungTotal();
  };

  const hitungTotal = () => {
    setDiskon(
      produk.length > 0
        ? produk.reduce(
            (n, { harga_total_diskon }) => n + harga_total_diskon,
            0
          )
        : 0
    );
    setSubtotal(
      produk.length > 0
        ? produk.reduce((n, { harga_total }) => n + harga_total, 0)
        : 0
    );

    hitungSemua();
  };

  const hitungSemua = () => {
    let pajak =
      settingPembayaran?.status_pajak === 1
        ? (settingPembayaran?.pajak *
            (produk.reduce(
              (n, { harga_total, harga_total_diskon }) =>
                n + (harga_total - harga_total_diskon),
              0
            ) -
              (promo ? parseFloat(promo.promo) : 0))) /
          100
        : 0;
    let total =
      parseInt(produk.reduce((n, { harga_total }) => n + harga_total, 0)) -
      parseInt(
        produk.reduce((n, { harga_total_diskon }) => n + harga_total_diskon, 0)
      ) +
      parseInt(pajak) +
      parseInt(chargeService);

    setPajak(pajak);
    setTotalSemua(total);
  };

  const promiseOptions = async (inputValue) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    const response = await axios.get("order/meja?s=" + inputValue);
    const res = await response.data.data;

    return res;
  };

  const getSettingPembayaran = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    const response = await axios.get(`setting`);
    const res = await response.data.data;

    setSettingPembayaran(res);
  };

  useEffect(() => {
    getSettingPembayaran();
  }, []);

  const mutation = useMutation(
    async (data) => {
      data.diskon = diskon + (promo ? parseFloat(promo.promo) : 0);
      data.subtotal = subtotal;
      data.id_meja = data.no_meja.value;
      data.metode_pembayaran = metodePembayaran;
      data.pembayaran = rupiahToNumber(data.pembayaran);
      data.kembalian = data.kembalian;
      data.pajak = parseFloat(pajak);
      data.charge_service = parseFloat(chargeService);
      data.total_semua =
        parseFloat(totalSemua) - (promo ? parseFloat(promo.promo) : 0);
      data.produk = produk;

      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const response = await axios.post("order", data, config);
      const res = response.data;

      if (res.meta.code != 200) {
        throw new Error(res.meta.message);
      }

      return res.data;
    },
    {
      onMutate: () => {
        // spinner
        setIsAction(true);
      },
      onSettled: async (data, error) => {
        setIsAction(false);

        if (data) {
          reset();
          setErrMessage("");
          clearErrors();
        }

        if (error) {
          setErrMessage(error.message);
        }
      },
      onSuccess: async () => {
        handlePrint();
        toastSuccess("Pembayaran Berhasil Dilakukan");
      },
      onError: async () => {
        toastError("Pembayaran Gagal Dilakukan");
      },
    }
  );

  const pembayaran = async (data) => await mutation.mutate(data);

  return (
    <div>
      <form onSubmit={handleSubmit(pembayaran)}>
        <div className="h-max">
          <div className="grid grid-cols-12 gap-4 mb-6">
            <div className="lg:col-span-8 col-span-12">
              <div className="w-full pl-6 pr-6 mt-3 order-list__container">
                <div className="flex justify-between items-center order-list__title border-b border-zinc-200 pb-4 pr-2">
                  <h2 className="text-black text-xl font-semibold">
                    Pesanan Anda
                  </h2>
                  <p className="text-xl text-black font-semibold">
                    {state != null ? state.produk.length : 0} Item
                  </p>
                </div>

                <div className="order-list__content mt-10">
                  <table className="table-auto w-full">
                    <thead>
                      <tr>
                        <th className="text-slate-400 uppercase text-xs text-left pb-5">
                          Detail Item
                        </th>
                        <th className="text-slate-400 uppercase text-xs text-left pb-5">
                          Jumlah Beli
                        </th>
                        <th className="text-slate-400 uppercase text-xs text-left pb-5">
                          Harga
                        </th>
                        <th className="text-slate-400 uppercase text-xs text-left pb-5">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {produk != null &&
                        produk.map((obj, key) => (
                          <tr key={obj.id}>
                            <td>
                              <div className="flex items-center space-x-3">
                                <img
                                  src={baseUrl + obj.gambar}
                                  alt={obj.gambar}
                                  className="h-20 w-20 object-cover rounded"
                                />
                                <div className="justify-items-center">
                                  <h5 className="text-md text-black">
                                    {obj.nama_produk}
                                  </h5>
                                  <span className="text-xs text-blue-400">
                                    Makanan Pedas
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="flex border border-slate-300 w-fit rounded-md">
                                <button
                                  type="button"
                                  className="w-8 h-8 flex justify-center items-center rounded-tl-md rounded-bl-md hover:bg-blue-500 hover:text-white duration-200"
                                  onClick={() => kurangJumlahBeli(obj.id)}
                                >
                                  <AiOutlineMinus size={12} />
                                </button>
                                <input
                                  type="number"
                                  value={obj.jumlah_produk}
                                  className="w-10 text-center focus:outline-0 !border-none"
                                  onChange={(e) =>
                                    ubahJumlahBeli(key, e.target.value)
                                  }
                                />
                                <button
                                  type="button"
                                  className="w-8 h-8 flex justify-center items-center rounded-tr-md rounded-br-md hover:bg-blue-500 hover:text-white duration-200"
                                  onClick={() => tambahJumlahBeli(obj.id)}
                                >
                                  <AiOutlinePlus size={12} />
                                </button>
                              </div>
                            </td>
                            <td>
                              <span className="block text-sm font-bold text-slate-500">
                                IDR {rupiah(obj.harga_jual)}
                              </span>
                            </td>
                            <td className="text-right">
                              <span
                                className={`inline-block mr-1 text-sm font-bold text-blue-500 ${
                                  obj.diskon > 0 && "mt-4"
                                }`}
                              >
                                IDR {rupiah(obj.harga_total)}
                              </span>
                              {obj.diskon > 0 && (
                                <span className="text-xs text-slate-500 block">
                                  - IDR {rupiah(obj.harga_total_diskon)}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  <div className="flex grow items-end">
                    <div className="w-full bg-white sticky bottom-0 left-0 space-y-3 mt-5">
                      <div className="flex justify-between text-xs text-slate-700">
                        <p className="font-medium">Subtotal :</p>
                        <p className="font-medium">Rp. {rupiah(subtotal)}</p>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <p className="font-medium">Diskon :</p>
                        <p className="font-medium">
                          - Rp.{" "}
                          {rupiah(
                            diskon + (promo ? parseFloat(promo.promo) : 0)
                          )}
                        </p>
                      </div>
                      {state.statusPajak === 1 ? (
                        <div className="flex justify-between text-xs text-slate-700">
                          <p className="font-medium">Pajak :</p>
                          <p className="font-medium">Rp. {rupiah(pajak)}</p>
                        </div>
                      ) : (
                        ""
                      )}
                      {state.statusChargeService === 1 ? (
                        <div className="flex justify-between text-xs text-slate-700">
                          <p className="font-medium">Service Charge :</p>
                          <p className="font-medium">
                            Rp. {rupiah(chargeService)}
                          </p>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="flex justify-between border-t border-zinc-200 pt-2">
                        <p className="font-bold text-lg text-slate-700">
                          Total :
                        </p>
                        <p className="font-bold text-blue-500 text-xl">
                          Rp.{" "}
                          {rupiah(
                            parseFloat(totalSemua) -
                              (promo ? parseFloat(promo.promo) : 0)
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="hidden">
                      <Struk
                        ref={componentRef}
                        data={produk}
                        subtotal={subtotal}
                        bayar={bayar}
                        kembali={kembalian}
                        resto={resto}
                        serviceCharge={chargeService}
                        diskon={diskon + (promo ? parseFloat(promo.promo) : 0)}
                        totalSemua={
                          parseFloat(totalSemua) -
                          (promo ? parseFloat(promo.promo) : 0)
                        }
                        pajak={pajak}
                        statusChargeService={state.statusChargeService}
                        statusPajak={state.statusPajak}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-full lg:col-span-4 col-span-12 bg-slate-100 rounded flex flex-col px-6">
              <h2 className="text-black text-xl font-semibold mt-3 order-pembayaran__title border-b border-zinc-200 pb-4">
                Pembayaran
              </h2>
              <div className="order-pembayaran__form">
                <div className="w-full">
                  <label className="label">
                    <span className="label-text text-xs">Nama Pelanggan</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Nama Pelanggan"
                    name="nama_pelanggan"
                    control={control}
                    error={errors.nama_pelanggan ? true : false}
                  />
                </div>

                <div className="w-full">
                  <label className="label">
                    <span className="label-text text-xs">No Meja</span>
                  </label>
                  <Controller
                    name="no_meja"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <AsyncCreatableSelect
                        styles={colourStyles}
                        cacheOptions
                        defaultOptions
                        isClearable
                        loadOptions={promiseOptions}
                        {...field}
                      />
                    )}
                  />
                </div>

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
                <Button
                  className="text-xs mr-2 w-full mt-4 bg-custom-blue border-custom-blue"
                  type="submit"
                  startIcon={<FiSave size={20} />}
                  loading={isAction}
                  title="BAYAR SEKARANG"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
