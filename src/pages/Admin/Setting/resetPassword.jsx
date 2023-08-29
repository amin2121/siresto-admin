import React, { useState } from "react";

// component
import HeaderContent from "../../../layouts/HeaderContent";
import { Button } from "../../../components/Button";
import { Input, MessageError } from "../../../components/Input";

// icons
import { FiSave, FiXCircle } from "react-icons/fi";

// library
import axios from "../../../utils/axios";
import { baseUrl, slugify } from "../../../utils/strings";
import { swNormal } from "../../../utils/sw";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, QueryClient } from "react-query";
import { toastSuccess, toastError } from "../../../utils/toast";

export default function ResetPassword() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isAction, setIsAction] = useState(false);
  const [passBaru, setPassBaru] = useState("");
  const [passwordTidakSama, setPasswordTidakSama] = useState(false);
  const defaultValues = { password_baru: "", konfirmasi_password: "" };

  const breadcrumbs = [
    { link: "/#", menu: "Home" },
    { link: "/#", menu: "Setting" },
    { link: "/setting/reset-password", menu: "Reset Password" },
  ];

  const queryClient = new QueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    control,
    watch,
    setError,
  } = useForm();

  const navigate = useNavigate();

  const mutation = useMutation(
    async (data) => {
      const config = (axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${user.token}`);
      await axios
        .patch("setting/update-password", data, config)
        .then((response) => {
          const res = response.data;
          const config_awd = (axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${user.token_awd}`);

          axios
            .put(
              process.env.REACT_APP_BACKEND_DOMAIN + "/api/update-password",
              data,
              config_awd
            )
            .then((response) => {
              const respon = response.data;
              return respon.data;
            })
            .catch((error) => {
              if (user.level !== "Staff") {
                throw new Error(res.meta.message);
              }
            });

          return res.data;
        })
        .catch((error) => {
          throw new Error(error.meta.message);
        });
    },
    {
      onMutate: () => {
        setIsAction(true);
      },
      onSettled: async (data, error) => {
        setIsAction(false);

        if (data) {
          reset(defaultValues);
          clearErrors();
        }
      },
      onSuccess: async () => {
        toastSuccess("Reset Password Berhasil Dilakukan");
      },
      onError: async () => {
        toastError("Reset Password Gagal Dilakukan");
      },
    }
  );

  const updatePassword = async (data) => {
    await mutation.mutate(data);
  };

  const checkPasswordTidakSama = (inputKonfirmasiPass) => {
    let konfirmasiPass = inputKonfirmasiPass.target.value;
    passBaru !== konfirmasiPass
      ? setPasswordTidakSama(true)
      : setPasswordTidakSama(false);
  };

  return (
    <>
      <HeaderContent title="Reset Password" breadcrumbs={breadcrumbs} />
      <div className="bg-white h-max px-6 rounded-lg mt-0 md:mt-4">
        <form onSubmit={handleSubmit(updatePassword)}>
          <div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
            <label className="label col-span-12 md:col-span-2">
              <span className="label-text">Password Baru</span>
            </label>
            <div className="relative col-span-12 md:col-span-4">
              <Input
                type="password"
                placeholder="Password Lama"
                name="current_password"
                control={control}
                rules={{ required: true }}
                error={errors.password_baru ? true : false}
                onChange={(e) => setPassBaru(e.target.value)}
              />
              {errors.password_baru && (
                <MessageError>Password Baru Tidak Boleh Kosong</MessageError>
              )}
            </div>
          </div>

          <div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
            <label className="label col-span-12 md:col-span-2">
              <span className="label-text">Password Baru</span>
            </label>
            <div className="relative col-span-12 md:col-span-4">
              <Input
                type="password"
                placeholder="Password Baru"
                name="new_password"
                control={control}
                rules={{ required: true }}
                error={errors.password_baru ? true : false}
                onChange={(e) => setPassBaru(e.target.value)}
              />
              {errors.password_baru && (
                <MessageError>Password Baru Tidak Boleh Kosong</MessageError>
              )}
            </div>
          </div>

          <div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
            <label className="label col-span-12 md:col-span-2">
              <span className="label-text">Konfirmasi Password</span>
            </label>
            <div className="relative col-span-12 md:col-span-4">
              <Input
                type="password"
                placeholder="Konfirmasi Password"
                name="new_password_confirmation"
                rules={{ required: true }}
                control={control}
                error={
                  errors.konfirmasi_password || passwordTidakSama ? true : false
                }
                onChange={(e) => checkPasswordTidakSama(e)}
              />
              {errors?.konfirmasi_password && (
                <MessageError>
                  Konfirmasi Password Tidak Boleh Kosong
                </MessageError>
              )}
              {passwordTidakSama && (
                <MessageError>
                  Password Baru dengan Konfirmasi Password Tidak Sama
                </MessageError>
              )}
            </div>
          </div>

          <div className="grid grid-cols-8 md:gap-4 mt-8 mb-8">
            <div className="relative col-span-12 gap-x-2 md:col-span-4 md:col-start-3">
              <Button
                className="text-xs bg-custom-blue border-custom-blue"
                type="submit"
                startIcon={<FiSave size={20} />}
                loading={isAction}
                title="Simpan"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
