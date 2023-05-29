import React, { useState, useEffect } from "react";

// components
import { Button } from "../../../components/Button";
import HeaderContent from "../../../layouts/HeaderContent";
import {
  InputGroup,
  Input,
  InputCurrency,
  MessageError,
  Textarea,
} from "../../../components/Input";

// icons
import { FiSave, FiXCircle } from "react-icons/fi";

// libraries
import axios from "../../../utils/axios";
import { swNormal } from "../../../utils/sw";
import { rupiahToNumber, rupiah } from "../../../utils/strings";
import { useMutation, QueryClient } from "react-query";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import AsyncCreatableSelect from "react-select/async-creatable";
import { toastSuccess, toastError } from "../../../utils/toast";
import moment from "moment";
import { useDropzone } from "react-dropzone";
import { getBase64 } from "../../../utils/image";
import { baseUrl } from "../../../utils/strings";

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

const Edit = () => {
  moment.locale("id");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const queryClient = new QueryClient();
  const [isAction, setIsAction] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [isLoadingSelect, setIsLoadingSelect] = useState(true);
  const location = useLocation();
  const data = location.state;
  const breadcrumbs = [
    { link: "/", menu: "Home" },
    { link: "/promo", menu: "Promo" },
    { link: "/promo/edit", menu: "Edit Promo" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    control,
    setValue,
    setFocus,
  } = useForm();

  useEffect(() => {
    if (data.gambar) {
      localStorage.setItem("image", JSON.stringify(baseUrl + data.gambar));
    }
  }, []);

  // dropzone
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    value: {},
  });

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () =>
      acceptedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  const gambar_lama = JSON.parse(localStorage.getItem("image"));

  const files = acceptedFiles.map((file, key) => {
    getBase64(file)
      .then((result) => {
        setImageBase64(result);
        localStorage.removeItem("image");
      })
      .catch((err) => {
        console.log(err);
      });

    return (
      <img
        key={key}
        src={URL.createObjectURL(file)}
        alt={file}
        // Revoke data uri after image is loaded
        onLoad={() => {
          URL.revokeObjectURL(file);
        }}
      />
    );
  });

  useEffect(() => {
    setValue("id", data.id);
    setValue("judul_promo", data.judul_promo);
    setValue(
      "tanggal_awal_promo",
      moment(data.tanggal_awal_promo).format("YYYY-MM-DD")
    );
    setValue("periode_promo", data.periode_promo);
    setValue("status_promo", "nominal");
    setValue("nominal_promo", data.promo);
    setValue("deskripsi_promo", data.deskripsi_promo);
  }, []);

  useEffect(() => {
    setFocus("judul_promo");
  }, [setFocus]);

  const mutation = useMutation(
    async (data) => {
      data.gambar = imageBase64;
      data.nominal_promo = rupiahToNumber(data.nominal_promo);

      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const response = await axios.put("promo/" + data.id, data, config);
      const res = response.data;

      if (res.meta.code != 200) {
        throw new Error(res.meta.message);
      }

      return res.data;
    },
    {
      onMutate: () => {
        // spinner
        setIsAction(!isAction);
      },
      onSettled: async (data, error) => {
        setIsAction(!isAction);

        if (data) {
          queryClient.invalidateQueries("data-promo");
          reset();
          setErrMessage("");
          clearErrors();
        }

        if (error) {
          setErrMessage(error.message);
        }
      },
      onSuccess: async () => {
        navigate("/promo");
        toastSuccess("Promo Berhasil Diedit");
      },
      onError: async () => {
        navigate("/promo");
        toastError("Promo Gagal Diedit");
      },
    }
  );

  const tambahData = async (data) => {
    await mutation.mutate(data);
  };

  return (
    <>
      <HeaderContent
        linkBack="/promo"
        title="Edit Promo"
        breadcrumbs={breadcrumbs}
      ></HeaderContent>

      <div className="bg-white h-max px-6 rounded-lg mt-0 md:mt-4">
        <form onSubmit={handleSubmit(tambahData)}>
          <input
            type="hidden"
            name="id"
            {...register("id")}
            defaultValue={data.id}
          />

          <div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
            <label className="label col-span-12 md:col-span-2">
              <span className="label-text">Judul Promo</span>
            </label>
            <div className="relative col-span-12 md:col-span-4">
              <Input
                type="text"
                placeholder="Judul Promo"
                name="judul_promo"
                control={control}
                rules={{ required: true }}
                error={errors.judul_promo ? true : false}
                defaultValue={data.judul_promo}
              />
              {errors?.judul_promo && (
                <MessageError>Judul Promo Tidak Boleh Kosong</MessageError>
              )}
            </div>
          </div>

          <div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
            <input
              type="hidden"
              value={data.gambar_produk}
              {...register("gambar_produk_lama")}
            />
            <label className="label col-span-12 md:col-span-2">
              <span className="label-text">Gambar Produk</span>
            </label>
            <div className="relative col-span-12 md:col-span-4">
              <div {...getRootProps({ className: "dropzone" })}>
                <div className="flex justify-center w-full h-32 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                  {acceptedFiles.length > 0 ? (
                    files
                  ) : acceptedFiles.length === 0 && gambar_lama !== "null" ? (
                    <img src={baseUrl + data.gambar} alt={data.gambar} />
                  ) : (
                    <span className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span className="font-medium text-gray-600">
                        Drop files to Attach, or
                        <span className="text-blue-600 underline"> browse</span>
                      </span>
                    </span>
                  )}
                  <input
                    type="file"
                    name="file_upload"
                    className="hidden"
                    {...getInputProps()}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
            <label className="label col-span-12 md:col-span-2">
              <span className="label-text">Tanggal Awal Promo</span>
            </label>
            <div className="relative col-span-12 md:col-span-4">
              <Input
                type="date"
                placeholder="Tanggal Awal Promo"
                name="tanggal_awal_promo"
                control={control}
                rules={{ required: true }}
                error={errors.tanggal_awal_promo ? true : false}
              />
              {errors?.tanggal_awal_promo && (
                <MessageError>
                  Tanggal Awal Promo Tidak Boleh Kosong
                </MessageError>
              )}
            </div>
          </div>

          <div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
            <label className="label col-span-12 md:col-span-2">
              <span className="label-text">Periode Promo</span>
            </label>
            <div className="relative col-span-12 md:col-span-4">
              <InputGroup
                icon="Hari"
                directionIcon="right"
                type="number"
                placeholder="Periode Promo"
                name="periode_promo"
                rules={{ required: true }}
                control={control}
                error={errors.periode_promo ? true : false}
              />
              {errors.periode_promo?.type === "required" && (
                <MessageError>Periode Promo Tidak Boleh Kosong</MessageError>
              )}
            </div>
          </div>

          {/* <div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
            <label className="label col-span-12 md:col-span-2">
              <span className="label-text">Status Promo</span>
            </label>
            <div className="relative col-span-12 md:col-span-4 flex">
              <div className="form-control flex-1 mr-4">
                <label className="label cursor-pointer">
                  <span className="label-text">Nominal</span>
                  <input
                    type="radio"
                    name="status_promo"
                    {...register("status_promo")}
                    value="nominal"
                    className="radio checked:bg-custom-blue"
                  />
                </label>
              </div>

              <div className="form-control flex-1">
                <label className="label cursor-pointer">
                  <span className="label-text">Persentase</span>
                  <input
                    type="radio"
                    name="status_promo"
                    {...register("status_promo")}
                    value="persentase"
                    className="radio checked:bg-custom-blue"
                  />
                </label>
              </div>
            </div>
          </div> */}

          <div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
            <label className="label col-span-12 md:col-span-2">
              <span className="label-text">Nominal Promo (Rp)</span>
            </label>
            <div className="relative col-span-12 md:col-span-4">
              <InputCurrency
                type="text"
                placeholder="Promo"
                name="nominal_promo"
                control={control}
                required="true"
                error={errors.nominal_promo ? true : false}
              />
              {errors?.nominal_promo && (
                <MessageError>Nominal Promo Tidak Boleh Kosong</MessageError>
              )}
            </div>
          </div>

          <div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
            <label className="label col-span-12 md:col-span-2">
              <span className="label-text">Deskripsi Promo</span>
            </label>
            <div className="relative col-span-12 md:col-span-4">
              <Textarea
                placeholder="Deskripsi Promo"
                name="deskripsi_promo"
                control={control}
                error={errors.deskripsi_promo ? true : false}
                className="w-full input-bordered !border-blue-500 text-gray-900 focus:outline-none"
              ></Textarea>
              {errors?.deskripsi_promo && (
                <MessageError>Deskripsi Promo Tidak Boleh Kosong</MessageError>
              )}
            </div>
          </div>

          <div className="grid grid-cols-8 md:gap-4 mt-8 mb-8">
            <div className="relative col-span-12 gap-x-2 md:col-span-4 md:col-start-3">
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
                startIcon={<FiXCircle size={20} />}
                type="button"
                onClick={() => navigate("/promo")}
                title="Kembali"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Edit;
