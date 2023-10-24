import React, { useState } from "react";

// components
import { Button } from "../../../components/Button";
import HeaderContent from "../../../layouts/HeaderContent";
import { Input, MessageError } from "../../../components/Input";

// icons
import { FiSave, FiXCircle } from "react-icons/fi";

// libraries
import axios from "../../../utils/axios";
import { swNormal } from "../../../utils/sw";
import { useMutation, QueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toastSuccess, toastError } from "../../../utils/toast";

const Tambah = () => {
  const navigate = useNavigate();
  const queryClient = new QueryClient();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isAction, setIsAction] = useState(false);
  const breadcrumbs = [
    { link: "/", menu: "Home" },
    { link: "/supplier", menu: "Supplier" },
    { link: "/supplier/tambah", menu: "Tambah Supplier" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    control,
  } = useForm();

  const mutation = useMutation(
    async (data) => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.post("supplier", data, config);
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
          queryClient.invalidateQueries("data-supplier");
          reset();
          clearErrors();
        }
      },
      onSuccess: async () => {
        navigate("/supplier");
        toastSuccess("Supplier Berhasil Ditambahkan");
      },
      onError: async () => {
        navigate("/supplier");
        toastError("Supplier Gagal Ditambahkan");
      },
    }
  );

  const addData = async (data) => {
    await mutation.mutate(data);
  };

  return (
    <>
      <HeaderContent
        linkBack="/supplier"
        title="Tambah Supplier"
        breadcrumbs={breadcrumbs}
      />
      <div className="bg-white h-max px-6 rounded-lg mt-0 md:mt-4">
        <form onSubmit={handleSubmit(addData)}>
          <div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
            <label className="label col-span-12 md:col-span-2">
              <span className="label-text">Nama Supplier</span>
            </label>
            <div className="relative col-span-12 md:col-span-4">
              <Input
                type="text"
                placeholder="Nama Supplier"
                name="nama_supplier"
                control={control}
                rules={{ required: true }}
                error={errors.nama_supplier ? true : false}
              />
              {errors.nama_supplier && (
                <MessageError>Nama Supplier Tidak Boleh Kosong</MessageError>
              )}
            </div>
          </div>

          <div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
            <label className="label col-span-12 md:col-span-2">
              <span className="label-text">Alamat</span>
            </label>
            <div className="relative col-span-12 md:col-span-4">
              <Input
                type="text"
                placeholder="Alamat"
                name="alamat"
                control={control}
                rules={{ required: true }}
                error={errors.alamat ? true : false}
              />
              {errors.alamat && (
                <MessageError>Alamat Tidak Boleh Kosong</MessageError>
              )}
            </div>
          </div>

          <div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
            <label className="label col-span-12 md:col-span-2">
              <span className="label-text">No Whatsapp</span>
            </label>
            <div className="relative col-span-12 md:col-span-4">
              <Input
                type="text"
                placeholder="No Whatsapp"
                name="no_whatsapp"
                control={control}
                rules={{ required: true }}
                error={errors.no_whatsapp ? true : false}
              />
              {errors.no_whatsapp && (
                <MessageError>No Whatsapp Tidak Boleh Kosong</MessageError>
              )}
            </div>
          </div>

          <div className="grid grid-cols-8 md:gap-4 mt-8 mb-8">
            <div className="relative col-span-12 gap-x-2 md:col-span-4 md:col-start-3">
              <Button
                className="text-xs mr-2 bg-custom-purple border-custom-purple"
                type="submit"
                startIcon={<FiSave size={20} />}
                loading={isAction}
                title="Simpan"
              />
              <Button
                className="text-xs"
                color="ghost"
                type="button"
                startIcon={<FiXCircle size={20} />}
                loading={false}
                title="Kembali"
                onClick={() => navigate("/supplier")}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Tambah;
