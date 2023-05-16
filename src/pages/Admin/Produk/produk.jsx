import React, { useState, useEffect, useRef } from "react";

// components
import { Button, ButtonIconOutline } from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import HeaderContent from "../../../layouts/HeaderContent";
import TableContent from "../../../layouts/TableContent";
import LoadingTable from "../../../components/LoadingTable";
import PaginationTable from "../../../components/PaginationTable";
import Badge from "../../../components/Badge";

// icons
import {
  FiTrash2,
  FiEdit3,
  FiToggleRight,
  FiPlusCircle,
  FiSearch,
} from "react-icons/fi";

// libraries
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../../../utils/axios";
import { rupiah, baseUrl } from "../../../utils/strings";
import { swNormal, swConfirm } from "../../../utils/sw";
import {
  useMutation,
  QueryClient,
  useQueryClient,
  useQuery,
} from "react-query";
import moment from "moment";
import { toastSuccess, toastError } from "../../../utils/toast";

const Produk = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [pesanLisence, setPesanLisence] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const labelLisenceTrial = useRef(null);
  const navigate = useNavigate();
  moment.locale("id");
  const breadcrumbs = [
    { link: "/", menu: "Home" },
    { link: "/produk", menu: "Produk" },
  ];

  const [showDropdownAksi, setShowDropdownAksi] = useState({
    id: 0,
    status: false,
  });
  const elementDropdownAksi = useRef();
  const btnDropdownAksi = useRef(null);
  const [totalProduk, setTotalProduk] = useState(0);

  // pagination
  const [page, setPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [toRow, setToRow] = useState(1);
  const [fromRow, setFromRow] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [selectedId, setSelectedId] = useState(null);

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
  } = useQuery(["data-produk", page], () => fetchData(), {
    staleTime: 15000,
    refetchInterval: 15000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
  } = useForm();

  const mutation = useMutation(
    async (id) => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.delete("produk/" + id, config);
      const res = response.data;

      if (res.meta.code != 200) {
        throw new Error(res.meta.message);
      }

      return res.meta.code;
    },
    {
      onMutate: () => {
        // spinner
      },
      onSettled: async (data, error) => {
        if (data == 200) {
          refetch();
        }
      },
      onSuccess: async () => {
        toastSuccess("Produk Berhasil Dihapus");
      },
      onError: async () => {
        toastError("Produk Gagal Dihapus");
      },
    }
  );

  const mutationUbahStatusProduk = useMutation(
    async (data) => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.put(
        "produk/ubah-status/" + data.id_produk,
        data,
        config
      );
      const res = response.data;

      if (res.meta.code != 200) {
        throw new Error(res.meta.message);
      }

      return res.meta.code;
    },
    {
      onMutate: () => {
        // spinner
      },
      onSettled: async (data, error) => {
        if (data == 200) {
          refetch();
        }
      },
      onSuccess: async () => {
        toastSuccess("Status Produk Berhasil Diubah");
      },
      onError: async () => {
        toastError("Status Produk Gagal Diubah");
      },
    }
  );

  // fetch data
  const fetchData = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    const response = await axios.get(
      `produk?s=${keyword}&limit=${limit}&sort=DESC&page=${page}`
    );
    const res = await response.data.data.data;
    const data = res.data;

    setTotalRows(res.total);
    setFromRow(res.from);
    setToRow(res.to);
    setNextPageUrl(res.next_page_url);
    setPrevPageUrl(res.prev_page_url);
    setTotalProduk(res.total_produk);

    return data;
  };

  // refetch after searching
  useEffect(() => {
    refetch();
  }, [keyword, limit]);

  // pagination action
  const nextPage = () => (nextPageUrl != null ? setPage(page + 1) : null);
  const prevPage = () => (prevPageUrl != null ? setPage(page - 1) : null);

  const confirmDeleteData = (id) => {
    mutation.mutate(id);
  };

  const checkedStatusProduk = (obj) => {
    setValue("id_produk", obj.id);
    setValue("status_produk", obj.status_produk);
  };

  const ubahStatusProduk = async (data) => {
    await mutationUbahStatusProduk.mutate(data);
  };

  const checkLisence = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const lisence = user?.lisence;

    if (lisence == "Trial") {
      let endDate = moment(user.tanggal);
      let startDate = moment();
      let _30hari = moment(endDate).add(30, "days");

      let diff = moment.duration(endDate.diff(startDate)).asDays();
      let rentangHari = Math.abs(Math.round(diff));

      if (rentangHari < 30) {
        if (totalProduk > 10) {
          setPesanLisence(
            "Anda hanya bisa menambahkan produk sebanyak 10 produk, silahkan upgrade ke versi lisence premium atau multicabang untuk menikmati fitur yang tidak disediakan di lisence trial"
          );
          labelLisenceTrial.current.click();
        } else {
          navigate("/produk/tambah");
        }
      } else {
        setPesanLisence(
          "Penggunaan lisence anda sudah berakhir, silahkan upgrade ke versi lisence premium atau multicabang untuk menikmati fitur yang tidak disediakan di lisence trial"
        );
        labelLisenceTrial.current.click();
      }
    } else {
      navigate("/produk/tambah");
    }
  };
  // console.log(data.gambar);

  return (
    <>
      <HeaderContent title="Produk" breadcrumbs={breadcrumbs}>
        <div className="md:flex mt-4 md:mt-0 flex-1 md:space-x-3 block space-y-3 md:space-y-0">
          <div className="relative flex-1 w-full">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <FiSearch size={20} />
            </div>
            <input
              type="text"
              placeholder="Cari Produk"
              onChange={(e) => setKeyword(e.target.value)}
              className="input input-bordered w-full pl-10 p-2.5 col-span-2"
            />
          </div>
          <div className="text-right">
            <Button
              className="text-xs bg-custom-blue border-custom-blue"
              type="button"
              startIcon={<FiPlusCircle size={20} />}
              loading={false}
              title="Tambah Produk"
              onClick={checkLisence}
            />
          </div>
        </div>
      </HeaderContent>
      <div className="bg-white px-6 mt-4 mb-5">
        <TableContent>
          <thead className="text-xs text-blue-500 bg-blue-50 uppercase">
            <tr className="border-b border-blue-200">
              <th scope="col" className="py-3 px-6 rounded-tl-md">
                No.
              </th>
              <th scope="col" className="py-3 px-6">
                Nama Produk
              </th>
              <th scope="col" className="py-3 px-6">
                Nomor SKU
              </th>
              <th scope="col" className="py-3 px-6">
                Harga Produk
              </th>
              <th scope="col" className="py-3 px-6">
                Status Aktif
              </th>
              <th scope="col" className="py-3 px-6 rounded-tr-md">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <LoadingTable colSpan="6" />
            ) : data.length > 0 ? (
              data?.map((obj, key) => (
                <tr className="bg-white border-b border-blue-200" key={key}>
                  <td className="py-4 px-6 whitespace-nowrap">{++key}</td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-3">
                      <img
                        src={baseUrl + obj.gambar}
                        alt={obj.gambar}
                        className="w-14 h-14 object-cover rounded-md"
                      />
                      <div className="flex flex-col">
                        <p className="font-semibold py-1 mb-1">
                          {obj.nama_produk}
                        </p>
                        <span className="text-slate-400">
                          {obj.kategori_produk.kategori_produk}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">{obj.nomor_sku}</td>
                  <td className="py-4 px-6">
                    Rp. {rupiah(obj.harga_jual)} <br />
                    {obj.diskon != 0 || obj.diskon != "" ? (
                      <span className="text-xs text-slate-400">
                        Disc : Rp. {rupiah(obj.diskon)}
                      </span>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {obj.status_produk == "1" ? (
                      <Badge title="Aktif" type="success" />
                    ) : (
                      <Badge title="Tidak Aktif" type="error" />
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="md:space-x-3 space-x-1 text-center">
                      <div
                        className="tooltip tooltip-bottom"
                        data-tip="Ubah Status Produk"
                      >
                        <label htmlFor="modal-ubah-status-produk">
                          <ButtonIconOutline
                            onClick={() => checkedStatusProduk(obj)}
                          >
                            <FiToggleRight size="16" />
                          </ButtonIconOutline>
                        </label>
                      </div>
                      <div
                        className="tooltip tooltip-bottom"
                        data-tip="Edit Produk"
                      >
                        <Link to="/produk/edit" state={obj}>
                          <ButtonIconOutline>
                            <FiEdit3 size="16" />
                          </ButtonIconOutline>
                        </Link>
                      </div>
                      <div
                        className="tooltip tooltip-bottom"
                        data-tip="Hapus Produk"
                      >
                        <ButtonIconOutline
                          type="button"
                          onClick={() => {
                            setSelectedId(obj.id);
                            setIsShowModal(true);
                          }}
                        >
                          <FiTrash2 size="16" />
                        </ButtonIconOutline>
                      </div>

                      {isShowModal ? (
                        <>
                          <div className="fixed inset-0 z-30 overflow-y-auto">
                            <div className="fixed inset-0 w-full h-full bg-black opacity-30"></div>
                            <div className="flex items-center min-h-screen px-4 py-8">
                              <div className="relative w-90 max-w-lg p-4 mx-auto bg-white rounded-xl shadow-lg">
                                <div className="mt-3 sm:flex">
                                  <div className="flex items-center justify-center flex-none w-5 h-5 mx-auto mt-2 mr-3 bg-red-100 rounded-full">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-6 h-6 text-red-600"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                  <div className="mt-1 mx-auto">
                                    <h4 className="text-lg text-left font-medium text-gray-800">
                                      Apakah Anda Yakin?
                                    </h4>
                                    <p className="mt-2 text-left text-[15px] leading-relaxed text-gray-500">
                                      Ingin Menghapus Data Ini
                                    </p>
                                    <div className="items-center gap-2 mt-4 sm:flex">
                                      <button
                                        className="w-full h-10 px-12 py-1 mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                                        onClick={() => {
                                          confirmDeleteData(selectedId);
                                          setIsShowModal(false);
                                        }}
                                      >
                                        Hapus
                                      </button>
                                      <button
                                        className="w-full h-10 px-12 py-1 mt-2 mr-6 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                                        onClick={() => setIsShowModal(false)}
                                      >
                                        Batal
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="py-4 px-6 text-center font-medium w-max"
                  colSpan="6"
                >
                  Data Produk Kosong
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td
                  className="py-4 px-6 text-center font-medium w-max"
                  colSpan="6"
                >
                  Gagal Mengambil Data
                </td>
              </tr>
            )}
          </tbody>
        </TableContent>
        <PaginationTable
          setLimit={setLimit}
          fromRow={fromRow}
          toRow={toRow}
          totalRows={totalRows}
          prevPageUrl={prevPageUrl}
          nextPageUrl={nextPageUrl}
          prevPage={prevPage}
          nextPage={nextPage}
        />
      </div>

      <Modal
        id="modal-ubah-status-produk"
        showButtonConfirm={true}
        typeButtonConfirm="submit"
        titleButtonConfirm="Simpan"
        showButtonClose={true}
        titleModal="Sembunyikan/Tampilkan Produk"
        submitForm={handleSubmit(ubahStatusProduk)}
      >
        <div className="flex mt-5 mb-3">
          <input type="hidden" id="id-produk" {...register("id_produk")} />

          <div className="form-control flex-1 mr-4">
            <label className="label cursor-pointer">
              <span className="label-text">Tampilkan</span>
              <input
                type="radio"
                id="radio-tampilkan-produk"
                name="status_produk"
                {...register("status_produk")}
                value="1"
                className="radio checked:bg-custom-blue"
              />
            </label>
          </div>

          <div className="form-control flex-1">
            <label className="label cursor-pointer">
              <span className="label-text">Sembunyikan</span>
              <input
                type="radio"
                id="radio-sembunyikan-produk"
                name="status_produk"
                {...register("status_produk")}
                value="0"
                className="radio checked:bg-custom-blue"
              />
            </label>
          </div>
        </div>
      </Modal>

      <label
        htmlFor="modal-lisence-trial"
        id="label-lisence-trial"
        ref={labelLisenceTrial}
      ></label>
      <Modal
        id="modal-lisence-trial"
        showButtonConfirm={false}
        showButtonClose={true}
        titleModal="Perhatian"
      >
        <p className="py-2 text-sm text-slate-600">{pesanLisence}</p>
      </Modal>
    </>
  );
};

export default Produk;
