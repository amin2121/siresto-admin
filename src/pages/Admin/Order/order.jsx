import React, { useState, useEffect, useRef } from "react";

// components
import Pagination from "../../../components/Pagination";
import HeaderContent from "../../../layouts/HeaderContent";
import TableContent from "../../../layouts/TableContent";
import LoadingTable from "../../../components/LoadingTable";
import PaginationTable from "../../../components/PaginationTable";
import { Button, ButtonIconOutline } from "../../../components/Button";

// icons
import {
  FiTrash2,
  FiEdit3,
  FiToggleRight,
  FiPlusCircle,
  FiSearch,
  FiFileText,
} from "react-icons/fi";

// libraries
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "../../../utils/axios";
import { useForm } from "react-hook-form";
import { swNormal, swConfirm } from "../../../utils/sw";
import { rupiah, timestampToDate, capitalize } from "../../../utils/strings";
import { useMutation, QueryClient, useQueryClient } from "react-query";
import moment from "moment";
import { toastSuccess, toastError } from "../../../utils/toast";

const Order = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isShowModal, setIsShowModal] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const breadcrumbs = [
    { link: "/", menu: "Home" },
    { link: "/order", menu: "Order" },
  ];

  moment.locale("id");
  const [showDropdownAksi, setShowDropdownAksi] = useState({
    id: 0,
    status: false,
  });
  const elementDropdownAksi = useRef();
  const btnDropdownAksi = useRef(null);

  // pagination
  const [page, setPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [toRow, setToRow] = useState(1);
  const [fromRow, setFromRow] = useState(1);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [totalRows, setTotalRows] = useState(0);

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
  } = useQuery(["data-order", page], () => fetchData(), {
    staleTime: 15000,
    refetchInterval: 15000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  // fetch data
  const fetchData = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    const response = await axios.get(
      `order?s=${keyword}&limit=${limit}&sort=DESC&page=${page}`
    );
    const res = await response.data.data;
    const data = res.data;

    setTotalRows(res.total);
    setFromRow(res.from);
    setToRow(res.to);
    setNextPageUrl(res.next_page_url);
    setPrevPageUrl(res.prev_page_url);

    return data;
  };

  // refetch after searching
  useEffect(() => {
    refetch();
  }, [keyword, limit]);

  const nextPage = () => setPage(page + 1);
  const prevPage = () => setPage(page - 1);

  const mutation = useMutation(
    async (id) => {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
      const response = await axios.delete("order/" + id);
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
          queryClient.invalidateQueries("data-order");
          refetch();
        }
      },
      onSuccess: async () => {
        toastSuccess("Order Berhasil Dihapus");
      },
      onError: async () => {
        toastError("Order Gagal Dihapus");
      },
    }
  );

  const confirmDeleteData = async (id) => {
    mutation.mutate(id);
  };

  return (
    <>
      <HeaderContent title="Order" breadcrumbs={breadcrumbs}>
        <div className="md:flex mt-4 md:mt-0 flex-1 md:space-x-3 block space-y-3 md:space-y-0">
          <div className="relative flex-1 w-full">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <FiSearch size={20} />
            </div>
            <input
              type="text"
              placeholder="Cari Order"
              onChange={(e) => setKeyword(e.target.value)}
              className="input input-bordered w-full pl-10 p-2.5 col-span-2"
            />
          </div>
          <div className="text-right">
            <Link to="/order/tambah">
              <Button
                className="text-xs bg-custom-blue border-custom-blue"
                type="button"
                startIcon={<FiPlusCircle size={20} />}
                loading={false}
                title="Tambah Order"
              />
            </Link>
          </div>
        </div>
      </HeaderContent>
      <div className="bg-white px-6 mt-4 mb-5">
        <TableContent>
          <thead className="text-xs text-blue-500 bg-blue-50 uppercase">
            <tr className="border-b border-blue-200">
              <th scope="col" className="py-3 px-6 rounded-tl-md">
                Kode Transaksi
              </th>
              <th scope="col" className="py-3 px-6">
                Customer
              </th>
              <th scope="col" className="py-3 px-6">
                Nilai Transaksi
              </th>
              <th scope="col" className="py-3 px-6">
                Metode Pembayaran
              </th>
              <th scope="col" className="py-3 px-6">
                Tanggal Transaksi
              </th>
              <th scope="col" className="py-3 px-6 rounded-tr-md">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <LoadingTable colSpan="5" />
            ) : data.length > 0 ? (
              data?.map((obj, key) => (
                <tr className="bg-white border-b border-blue-200" key={key}>
                  <td className="py-4 px-6 text-sm">{obj.no_transaksi}</td>
                  <td className="py-4 px-6 text-sm">{obj.nama_pelanggan}</td>
                  <td className="py-4 px-6 text-sm">
                    Rp. {rupiah(obj.nilai_transaksi)}
                  </td>
                  <td className="py-4 px-6 text-sm">
                    {obj.metode_pembayaran == ""
                      ? "Belum Membayar"
                      : capitalize(obj.metode_pembayaran)}
                  </td>
                  <td className="py-4 px-6 text-sm">15-10-2022</td>
                  <td className="py-4 px-6">
                    <div className="md:space-x-3 space-x-1 text-center">
                      <div
                        className="tooltip tooltip-bottom"
                        data-tip="Detail Order"
                      >
                        <Link to="/order/detail" state={obj}>
                          <ButtonIconOutline>
                            <FiFileText size="16" />
                          </ButtonIconOutline>
                        </Link>
                      </div>
                      <div
                        className="tooltip tooltip-bottom"
                        data-tip="Edit Order"
                      >
                        <Link to="/order/edit" state={obj}>
                          <ButtonIconOutline>
                            <FiEdit3 size="16" />
                          </ButtonIconOutline>
                        </Link>
                      </div>
                      <div
                        className="tooltip tooltip-bottom"
                        data-tip="Hapus Order"
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
                            <div className="fixed inset-0 w-full h-full bg-black opacity-20"></div>
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
                  colSpan="5"
                >
                  Data Order Kosong
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td
                  className="py-4 px-6 text-center font-medium w-max"
                  colSpan="5"
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
    </>
  );
};

export default Order;
