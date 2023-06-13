import React, { useState, useEffect } from "react";

// components
import { Button } from "../../../components/Button";
import { InputGroup, Input, MessageError } from "../../../components/Input";
import HeaderContent from "../../../layouts/HeaderContent";

// icons
import { FiSave, FiXCircle } from "react-icons/fi";

// library
import axios from "../../../utils/axios";
import { swNormal } from "../../../utils/sw";
import { useMutation, QueryClient, useQuery } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import AsyncCreatableSelect from "react-select/async-creatable";
import { toastSuccess, toastError } from "../../../utils/toast";

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

const EditLisensi = () => {
  const [isAction, setIsAction] = useState(false);
  const [isLoadingSelect, setIsLoadingSelect] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const queryClient = new QueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;
  const [selectedLisence, setSelectedLisence] = useState({
    label: data.users[0].lisence.lisence,
    value: data.users[0].id_lisence,
  });

  const breadcrumbs = [
    { link: "/", menu: "Home" },
    { link: "/resto", menu: "Resto" },
    { link: "/resto/edit/lisence", menu: "Edit Lisensi Resto" },
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
    let inputHargaDiskon = document.getElementById("content-masa-trial");

    if (selectedLisence.value === 1) {
      inputHargaDiskon.classList.add("block");
      inputHargaDiskon.classList.remove("hidden");
    } else {
      inputHargaDiskon.classList.add("hidden");
      inputHargaDiskon.classList.remove("block");
    }
  }, [selectedLisence]);

  const mutation = useMutation(
    async (data) => {
      data.lisence = selectedLisence.label;
      data.id_lisence = selectedLisence.value;
      data.masa_trial = data.masa_trial;

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.put("lisence/ubah/" + data.id, data, config);
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
          clearErrors();
          queryClient.invalidateQueries("data-resto");
        }
      },
      onSuccess: async () => {
        navigate("/resto");
        toastSuccess("Resto Berhasil Diubah");
      },
      onError: async () => {
        navigate("/resto");
        toastError("Resto Gagal Diubah");
      },
    }
  );

  const promiseOptions = async (inputValue) => {
    setIsLoadingSelect(!isLoadingSelect);
    const response = await axios.get("lisence?s=" + inputValue);
    const res = await response.data.data;

    return res;
  };

  const editLisence = async (data) => {
    await mutation.mutate(data);
  };

  return (
    <>
      <HeaderContent
        linkBack="/resto"
        title="Edit Lisensi Resto"
        breadcrumbs={breadcrumbs}
      ></HeaderContent>
      <div className="bg-white h-max px-6 rounded-lg mt-0 md:mt-4">
        <form onSubmit={handleSubmit(editLisence)}>
          <input
            type="hidden"
            name="id"
            {...register("id")}
            defaultValue={data.id}
          />

          <div className="grid grid-cols-8 gap-1 md:gap-4 mb-4">
            <label className="label col-span-12 md:col-span-2">
              <span className="label-text">Kategori Binis</span>
            </label>
            <div className="relative col-span-12 md:col-span-4">
              <Controller
                name="id_lisence"
                control={control}
                render={({ field }) => (
                  <AsyncCreatableSelect
                    styles={colourStyles}
                    cacheOptions
                    defaultOptions
                    loadOptions={promiseOptions}
                    // {...field}
                    onChange={(selected) => {
                      setSelectedLisence(selected);
                    }}
                    value={selectedLisence}
                  />
                )}
              />
            </div>
          </div>

          <div
            className="grid grid-cols-8 gap-1 md:gap-4 mb-4 hidden duration-200"
            id="content-masa-trial"
          >
            <label className="label col-span-12 md:col-span-2">
              <span className="label-text">Tambah Masa Trial</span>
            </label>
            <div className="relative col-span-12 md:col-span-4">
              <Input
                type="number"
                placeholder="Masa Trial (Hari)"
                name="masa_trial"
                control={control}
                required
                error={errors.masa_trial ? true : false}
              />
              {errors?.masa_trial && (
                <MessageError>Masa Trial Tidak Boleh Kosong</MessageError>
              )}
            </div>
          </div>

          <div className="grid grid-cols-8 md:gap-4 mt-8">
            <div className="relative col-span-12 gap-x-2 md:col-span-4 md:col-start-3">
              <Button
                className="text-xs bg-custom-blue border-custom-blue"
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
                onClick={() => navigate("/resto")}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditLisensi;
