import React, { useState, useEffect, useRef } from "react";

// component
import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import Logo from "../../../assets/images/logo/SiResto.png";

// assets
import { BsFillSave2Fill } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
// import BgAuth from '../../../assets/images/bg-auth.jpg'

// library
import axios from "../../../utils/axios";
import { swNormal } from "../../../utils/sw";
import { useMutation, QueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { setDataLogin } from "../../../features/loginSlice";
import { toastSuccess, toastError } from "../../../utils/toast";
import moment from "moment";

const Login = () => {
  moment.locale("id");
  const statusNotif = useSelector((state) => state.notifTrial.statusNotif);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const labelNotifTrial = useRef(null);
  const queryClient = new QueryClient();
  const [isAction, setIsAction] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [isDisabledInput, setIsDisabledInput] = useState(false);

  const { register, handleSubmit, errors, reset, clearErrors } = useForm();

  const submitLoginUser = async (data) => {
    const response = await axios.post("auth/login", data);
    const res = response.data;

    if (res.meta.code != 200) {
      throw new Error("Gagal Login");
    }

    return res.data;
  };

  const mutation = useMutation(submitLoginUser, {
    onMutate: () => {
      // spinner
      setIsDisabledInput(!isDisabledInput);
      setIsAction(!isAction);
    },
    onSuccess: async (data) => {
      reset();
      clearErrors();
      setIsDisabledInput(false); // disable input login
      setIsAction(false); // mematikan loading button

      // cek jika lisence trial lebih dari 30 hari
      let endDate = moment(data.created_at);
      let startDate = moment();
      let _30hari = moment(endDate).add(30, "days");

      let diff = moment.duration(endDate.diff(startDate)).asDays();
      let rentangHari = Math.abs(Math.round(diff));

      if (rentangHari > 30) {
        document.getElementById("label-notif-trial").click();
      } else {
        localStorage.setItem(
          "user",
          JSON.stringify({
            token: data.token,
            level: data.level,
            lisence: data.lisence,
            name: data.name,
            tanggal: data.created_at,
          })
        );

        if (data.level == "Owner") {
          navigate("/dashboard/owner");
        } else if (data.level == "Superadmin") {
          navigate("/dashboard/superadmin");
        } else if (data.level == "Staff") {
          navigate("/order");
        }

        toastSuccess("Login Berhasil Dilakukan");
      }
    },
    onError: async () => {
      setIsDisabledInput(false);
      setIsAction(false);

      toastError("Login Gagal Dilakukan");
    },
  });

  const loginUser = async (data) => {
    await mutation.mutate(data);
  };

  return (
    <div className="h-screen flex">
      <div className="basis-3/5">
        {/*<img src={BgAuth} alt={BgAuth} className="w-full h-screen object-cover object-center"/>*/}
      </div>
      <div className="basis-2/5 bg-white flex items-center justify-center flex-col">
        <div className="mb-10">
          <div className="logo-website gap-x-2 flex items-center justify-center">
            <img src={Logo} alt={Logo} className="w-28" />
          </div>
        </div>
        <form onSubmit={handleSubmit(loginUser)} className="w-full px-16">
          <div className="relative mb-3">
            <label className="label mb-1 px-0">
              <span className="label-text font-medium">Username</span>
            </label>
            <div className="relative">
              <input
                type="text"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Username"
                {...register("username", { required: true })}
                disabled={isDisabledInput ? "disabled" : ""}
              />
              {errors?.email && (
                <span className="text-red-400 block mt-2">
                  Email Tidak Boleh Kosong
                </span>
              )}
            </div>
          </div>

          <div className="relative">
            <label className="label mb-1 px-0">
              <span className="label-text font-medium">Password</span>
              <span className="label-text font-bold text-blue-500 hover:text-blue-700 cursor-pointer text-xs duration-200">
                Forgot Password?
              </span>
            </label>
            <div className="relative">
              <input
                type="password"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="******"
                {...register("password", { required: true })}
                disabled={isDisabledInput ? "disabled" : ""}
              />
              {errors?.password && (
                <span className="text-red-400 block mt-2">
                  Password Tidak Boleh Kosong
                </span>
              )}
            </div>
          </div>

          <Button
            className="w-full text-xs mt-5"
            color="secondary"
            type="submit"
            loading={isAction}
            title="Login"
          />

          {/*<span className="label-text font-medium text-xs">Belum Menjadi Anggota?</span> <span className="label-text font-bold text-blue-500 hover:text-blue-700 cursor-pointer text-xs duration-200" onClick={() => navigate('/auth/register')}>Registrasi</span>*/}
        </form>

        <label htmlFor="modal-notif-trial" id="label-notif-trial"></label>
        <Modal
          id="modal-notif-trial"
          showButtonConfirm={false}
          showButtonClose={true}
          titleModal="Perhatian"
        >
          <p className="py-2 text-sm text-slate-600">
            Penggunaan lisence anda sudah berakhir, silahkan upgrade ke versi
            lisence premium atau multicabang untuk menikmati fitur yang tidak
            disediakan di lisence trial
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default Login;
