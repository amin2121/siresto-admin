import React, { useState, useEffect, useRef } from "react";
import "./setting.css";

// components
import HeaderContent from "../../../layouts/HeaderContent";
import LoadingPage from "../../../components/LoadingPage";
import { Button } from "../../../components/Button";
import { InputGroup, InputGroupCurrency } from "../../../components/Input";

// icons
import { HiOutlineReceiptTax } from "react-icons/hi";
import { BiGitBranch } from "react-icons/bi";
import { FiSave } from "react-icons/fi";

// libraries
import { useQuery } from "react-query";
import axios from "../../../utils/axios";
import { useForm } from "react-hook-form";
import { rupiahToNumber } from "../../../utils/strings";
import { useMutation, QueryClient } from "react-query";
import { toastSuccess, toastError } from "../../../utils/toast";
import moment from "moment";

const Pembayaran = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [dataInput, setDataInput] = useState({
    status_pajak: 0,
    pajak: "0",
    status_charge_service: 0,
    charge_service: 0,
    alur_pembayaran_konsumen: "langsung_bayar",
  });
  const [setting, setSetting] = useState("pajak_service");
  const [isAction, setIsAction] = useState(false);

  const breadcrumbs = [
    { link: "/", menu: "Home" },
    { link: "/setting", menu: "Setting" },
    { link: "/setting/pembayaran", menu: "Pembayaran" },
  ];

  moment.locale("id");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    control,
    setValue,
  } = useForm();

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
  } = useQuery(["data-setting-pembayaran"], () => fetchData(), {
    refetchOnWindowFocus: false,
  });

  // useEffect(() => {
  // console.log(dataInput)
  // }, [dataInput])

  // fetch data
  const fetchData = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    const response = await axios.get(`setting`);
    const res = await response.data.data;
    //

    setValue("status_pajak", res.status_pajak || "");
    setValue("pajak", res.pajak || "");
    setValue("status_charge_service", res.status_charge_service || "");
    setValue("charge_service", res.charge_service || "");
    setValue("alur_pembayaran_konsumen", res.alur_pembayaran_konsumen || "");

    setDataInput(res);

    return res;
  };

  const mutation = useMutation(
    async (data) => {
      data.charge_service = rupiahToNumber(data.charge_service);
      data.status_pajak = dataInput.status_pajak;
      data.status_charge_service = dataInput.status_charge_service;

      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const response = await axios.post("setting", data, config);
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
      },
      onSuccess: async () => {
        toastSuccess("Setting Pembayaran Berhasil Diubah");
      },
      onError: async () => {
        toastError("Setting Pembayaran Gagal Diubah");
      },
    }
  );

  const ubahSetting = async (data) => await mutation.mutate(data);

  if (isLoading)
    return (
      <div className="flex-1 flex justify-center items-center flex-col space-y-3">
        <LoadingPage />
      </div>
    );

  return (
    <>
      <HeaderContent title="Setting" breadcrumbs={breadcrumbs} />
      <div
        className="bg-white h-max px-6 rounded-lg h-96 mt-4 grid grid-cols-8 gap-4 relative"
        key={1}
      >
        <div className="md:col-span-3 col-span-12 shadow-lg shadow-blue-100 rounded grid grid-cols-2 gap-4 px-6 py-10 text-sm rounded">
          <div
            className={`setting__choose border-2 border-gray-300 p-2 h-32 flex flex-col items-center justify-center space-y-2 rounded ${
              setting == "pajak_service" ? "active" : ""
            } `}
            onClick={() => setSetting("pajak_service")}
          >
            <HiOutlineReceiptTax size={40} />
            <p>Pajak & Service</p>
          </div>
          <div
            className={`setting__choose border-2 border-gray-300 p-2 h-32 flex flex-col items-center justify-center space-y-2 rounded ${
              setting == "alur_pembayaran" ? "active" : ""
            } `}
            onClick={() => setSetting("alur_pembayaran")}
          >
            <BiGitBranch size={40} />
            <p>Alur Pembayaran</p>
          </div>
        </div>

        <div className="md:col-span-5 col-span-12 shadow-lg shadow-blue-100 rounded px-6 py-10 rounded">
          <form onSubmit={handleSubmit(ubahSetting)}>
            <div
              className={`${setting == "pajak_service" ? "block" : "hidden"}`}
            >
              <h1 className="text-md font-bold mb-4">Pajak & Charge Service</h1>
              <div className="setting__content space-y-5">
                <div className="setting__item flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-semibold mb-1">
                      Penggunaan Pajak
                    </h3>
                    <p className="text-xs text-slate-400">
                      Hidupkan jika ingin menambahkan pajak dalam setiap
                      transaksi penjualan{" "}
                    </p>
                    <div className="form-group flex items-center mt-2">
                      <InputGroup
                        type="text"
                        id="input-pajak"
                        directionIcon="right"
                        name="pajak"
                        icon="%"
                        className="p-1 input-sm !w-24"
                        control={control}
                        disabled={dataInput.status_pajak == 0}
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      className="toggle toggle-secondary toggle-sm checked:bg-custom-blue"
                      name="status_pajak"
                      {...register("status_pajak")}
                      onChange={() =>
                        setDataInput({
                          ...dataInput,
                          status_pajak: dataInput.status_pajak == 0 ? 1 : 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="setting__item flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-semibold mb-1">
                      Penggunaan Service Charge
                    </h3>
                    <p className="text-xs text-slate-400">
                      Hidupkan jika ingin menambahkan service charge dalam
                      setiap transaksi penjualan{" "}
                    </p>
                    <div className="form-group flex items-center mt-2">
                      <InputGroupCurrency
                        type="number"
                        id="input-service-charge"
                        directionIcon="left"
                        name="charge_service"
                        icon="IDR"
                        placeholder="Jumlah Uang"
                        control={control}
                        className="p-1 input-sm !w-40"
                        disabled={dataInput.status_charge_service == 0}
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      className="toggle toggle-secondary toggle-sm checked:bg-custom-blue"
                      name="status_charge_service"
                      value={dataInput.status_charge_service}
                      {...register("status_charge_service")}
                      onChange={() =>
                        setDataInput({
                          ...dataInput,
                          status_charge_service:
                            dataInput.status_charge_service == 0 ? 1 : 0,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`${setting == "alur_pembayaran" ? "block" : "hidden"}`}
            >
              <h1 className="text-md font-bold mb-4">Alur Pembayaran</h1>
              <div className="setting__content space-y-5">
                <div className="setting__item flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-semibold mb-1">
                      Alur Pembayaran Konsumen
                    </h3>
                    <p className="text-xs text-slate-400">
                      Alur pembayaran konsumen bisa diubah dari langsung bayar
                      atau bayar nanti{" "}
                    </p>
                    <div className="form-group flex items-center mt-2 space-x-4">
                      <div className="form-control">
                        <label className="label cursor-pointer space-x-4">
                          <span className="label-text">Bayar Langsung</span>
                          <input
                            type="radio"
                            name="alur_pembayaran_konsumen"
                            value="bayar_langsung"
                            className="radio radio-secondary"
                            {...register("alur_pembayaran_konsumen")}
                          />
                        </label>
                      </div>

                      <div className="form-control">
                        <label className="label cursor-pointer space-x-4">
                          <span className="label-text">Bayar Nanti</span>
                          <input
                            type="radio"
                            name="alur_pembayaran_konsumen"
                            value="bayar_nanti"
                            className="radio radio-secondary"
                            {...register("alur_pembayaran_konsumen")}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              className="text-xs mr-2 mt-10 bg-custom-blue border-custom-blue"
              color="secondary"
              type="submit"
              startIcon={<FiSave size={16} />}
              loading={isAction}
              title="Simpan"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Pembayaran;
