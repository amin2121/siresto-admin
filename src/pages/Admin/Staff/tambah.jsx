import React, { useState, useEffect, useRef } from "react";

// component
import HeaderContent from "../../../layouts/HeaderContent";
import NoImage from "../../../assets/images/user/no-image.png";
import { Button } from "../../../components/Button";
import {
  Input,
  InputCurrency,
  MessageError,
  Textarea,
} from "../../../components/Input";

// icons
import { FiSave, FiXCircle } from "react-icons/fi";
import { MdOutlineClose } from "react-icons/md";
import { HiPencil } from "react-icons/hi";

// library
import axios from "../../../utils/axios";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, QueryClient } from "react-query";
import { toastSuccess, toastError } from "../../../utils/toast";
import { getBase64 } from "../../../utils/image";

export default function Tambah() {
  const [isAction, setIsAction] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [imageBase64, setImageBase64] = useState("");
  const [gambar, setGambar] = useState("");
  const inputFileRef = useRef(null);
  const breadcrumbs = [
    { link: "/", menu: "Home" },
    { link: "/staff", menu: "Staff" },
    { link: "/staff/tambah", menu: "Tambah Staff" },
  ];

  const queryClient = new QueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    control,
    setFocus,
  } = useForm();

  const navigate = useNavigate();

  const mutation = useMutation(
    async (data) => {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      data.gambar = imageBase64;

      const response = await axios.post("staff", data, config);
      const res = response.data;

      if (res.meta.code != 200) {
        throw new Error(res.meta.message);
      }

      return res.data;
    },
    {
      onMutate: () => {
        setIsAction(!isAction);
      },
      onSettled: async (data, error) => {
        setIsAction(!isAction);

        if (data) {
          queryClient.invalidateQueries("data-staff");
          reset();
          clearErrors();
        }
      },
      onSuccess: async () => {
        navigate("/staff");
        toastSuccess("Staff Berhasil Ditambahkan");
      },
      onError: async () => {
        navigate("/staff");
        toastError("Staff Gagal Ditambahkan");
      },
    }
  );

  const addStaff = async (data) => {
    await mutation.mutate(data);
  };

  const convertImageToBase64 = (e) => {
    let file = e.target.files[0];

    if (e.target.files && e.target.files[0]) {
      setGambar(URL.createObjectURL(e.target.files[0]));
    }

    getBase64(file)
      .then((result) => {
        setImageBase64(result);
      })
      .catch((err) => {});
  };

  const klikGambar = () => {
    inputFileRef.current.click();
  };

  const tampilGambar = () => {
    if (gambar == "") {
      return (
        <div className="absolute bottom-0 w-40 h-40 rounded-full bg-gray-300 flex justify-center items-center">
          <img src={NoImage} alt={NoImage} className="w-24 h-24" />
        </div>
      );
    }

    return (
      <img
        src={gambar}
        alt={gambar}
        className="absolute bottom-0 w-40 h-40 rounded-full "
      />
    );
  };

  const hapusGambar = () => {
    setGambar("");
    setImageBase64("");
  };

  useEffect(() => {
    setFocus("nama_lengkap");
  }, [setFocus]);

  return (
    <>
      <HeaderContent
        linkBack="/staff"
        title="Tambah Staff"
        breadcrumbs={breadcrumbs}
      ></HeaderContent>
      <div className="bg-white px-6 rounded-lg my-4 grid grid-cols-12">
        <div className="profile__image md:col-span-4 col-span-12 flex justify-center mb-4 md:mb-0">
          <div className="w-40 h-44 relative">
            <span className="cursor-pointer">
              <MdOutlineClose
                className="absolute top-0 right-0 text-gray-400"
                size={20}
                onClick={hapusGambar}
              />
            </span>
            {tampilGambar()}
            <span
              className="inline-block absolute bottom-1 cursor-pointer right-4 w-8 h-8 rounded-full bg-blue-500 flex justify-center items-center text-white"
              onClick={klikGambar}
            >
              <HiPencil />
            </span>
            <input
              type="file"
              className="hidden"
              ref={inputFileRef}
              onChange={(e) => convertImageToBase64(e)}
            />
          </div>
        </div>
        <form
          className="md:col-span-6 col-span-12 space-y-1"
          onSubmit={handleSubmit(addStaff)}
        >
          <h3 className="uppercase text-sm text-black font-semibold">
            Data Personal :{" "}
          </h3>
          <div className="grid grid-cols-1 grid-rows-2">
            <label className="label col-span-2">
              <span className="label-text">Nama Lengkap</span>
            </label>
            <div className="relative col-span-4">
              <Input
                type="text"
                placeholder="Nama Lengkap"
                name="nama_lengkap"
                control={control}
                error={errors.nama_lengkap ? true : false}
              />
              {errors.nama_lengkap && (
                <MessageError>Nama Lengkap Tidak Boleh Kosong</MessageError>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-1 grid-rows-2">
              <label className="label col-span-2">
                <span className="label-text">Email</span>
              </label>
              <div className="relative col-span-4">
                <Input
                  type="text"
                  placeholder="Email"
                  name="email"
                  control={control}
                  error={errors.email ? true : false}
                />
                {errors.email && (
                  <MessageError>Email Tidak Boleh Kosong</MessageError>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 grid-rows-2">
              <label className="label col-span-2">
                <span className="label-text">No Telepon</span>
              </label>
              <div className="relative col-span-4">
                <Input
                  type="number"
                  placeholder="No Telepon"
                  name="no_telepon"
                  control={control}
                  error={errors.no_telepon ? true : false}
                />
                {errors.no_telepon && (
                  <MessageError>No Telepon Tidak Boleh Kosong</MessageError>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 grid-rows-2">
            <label className="label col-span-2">
              <span className="label-text">Username</span>
            </label>
            <div className="relative col-span-4">
              <Input
                type="text"
                placeholder="Username"
                name="username"
                control={control}
                error={errors.username ? true : false}
              />
              {errors?.username && (
                <MessageError>Username Tidak Boleh Kosong</MessageError>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 grid-rows-2">
            <label className="label col-span-2">
              <span className="label-text">Password</span>
            </label>
            <div className="relative col-span-4">
              <Input
                type="password"
                placeholder="Password"
                name="password"
                control={control}
                error={errors.password ? true : false}
              />
              {errors?.password && (
                <MessageError>Password Tidak Boleh Kosong</MessageError>
              )}
            </div>
          </div>

          <div className="">
            <label className="label h-full">
              <span className="label-text">Alamat Lengkap</span>
            </label>
            <div className="relative">
              <Textarea
                className="!border-blue-500 text-gray-900 focus:outline-none"
                placeholder="Alamat Lengkap"
                name="alamat_lengkap"
                control={control}
                rules={{ required: true }}
                error={errors.alamat_lengkap ? true : false}
              ></Textarea>
              {errors?.alamat_lengkap && (
                <span className="text-red-400 block mt-2">
                  Alamat Lengkap Tidak Boleh Kosong
                </span>
              )}
            </div>
          </div>

          <div className="grid !mt-4 mb-8">
            <div className="relative">
              <Button
                className="text-xs mr-2 bg-custom-blue border-custom-blue"
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
                onClick={() => navigate("/staff")}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
