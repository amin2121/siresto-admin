import React, { useState, useEffect, useRef } from "react";

// components
import { Button, ButtonIconOutline } from "../../../components/Button";
import HeaderContent from "../../../layouts/HeaderContent";
import TableContent from "../../../layouts/TableContent";
import LoadingTable from "../../../components/LoadingTable";
import PaginationTable from "../../../components/PaginationTable";
import { Menu } from "@headlessui/react";

// icons
import { FiEdit3, FiTrash2, FiPlusCircle, FiSearch } from "react-icons/fi";

// libraries
import axios from "../../../utils/axios";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { swNormal, swConfirm } from "../../../utils/sw";
import { useMutation, QueryClient, useQueryClient } from "react-query";
import { toastSuccess, toastError } from "../../../utils/toast";
import DropdownTable from "../../../components/DropdownTable";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Supplier = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const breadcrumbs = [
    { link: "/", menu: "Home" },
    { link: "/supplier", menu: "Supplier" },
  ];

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
  } = useQuery(["data-supplier", page], () => fetchData(), {
    keepPreviousData: true,
  });

  const deleteDataMutation = useMutation(
    async (id) => {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
      const response = await axios.delete("supplier/" + id);
      const res = response.data;

      if (res.meta.code != 200) {
        throw new Error(res.meta.message);
      }

      return res.meta.code;
    },
    {
      onSettled: async (data, error) => {
        if (data == 200) {
          refetch();
        } else {
        }
      },
      onSuccess: async () => {
        toastSuccess("Supplier Berhasil Dihapus");
      },
      onError: async () => {
        toastError("Supplier gagal dihapus.");
      },
    }
  );

  // fetch data
  const fetchData = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    const response = await axios.get(
      `supplier?s=${keyword}&limit=${limit}&sort=DESC&page=${page}`
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

  // pagination action
  const nextPage = () => (nextPageUrl != null ? setPage(page + 1) : null);
  const prevPage = () => (prevPageUrl != null ? setPage(page - 1) : null);

  const confirmDeleteData = (id) => {
    deleteDataMutation.mutate(id);
  };

  return (
    <>
      <HeaderContent title="Supplier" breadcrumbs={breadcrumbs}>
        <div className="md:flex mt-4 md:mt-0 flex-1 md:space-x-3 block space-y-3 md:space-y-0">
          <div className="relative flex-1 w-full">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <FiSearch size={20} />
            </div>
            <input
              type="text"
              placeholder="Cari Supplier"
              onBlur={(e) => setKeyword(e.target.value)}
              className="input input-bordered w-full pl-10 p-2.5 col-span-2"
            />
          </div>
          <div className="text-right">
            <Link to="/supplier/tambah">
              <Button
                className="text-xs bg-custom-blue border-custom-blue"
                type="button"
                startIcon={<FiPlusCircle size={20} />}
                loading={false}
                title="Tambah Supplier"
              />
            </Link>
          </div>
        </div>
      </HeaderContent>
      <div className="bg-white px-6 mt-4 mb-5">
        <TableContent>
          <thead className="text-xs text-custom-purple bg-custom-purple-light uppercase">
            <tr className="border-b border-custom-purple-light">
              <th scope="col" className="py-3 px-6 rounded-tl-md">
                No.
              </th>
              <th scope="col" className="py-3 px-6">
                Nama Supplier
              </th>
              <th scope="col" className="py-3 px-6">
                Alamat
              </th>
              <th scope="col" className="py-3 px-6">
                No Whatsapp
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
                <tr
                  className="bg-white border-b border-custom-purple-light"
                  key={key}
                >
                  <td className="py-4 px-6 whitespace-nowrap text-center">
                    {++key}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {obj.nama_supplier}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {obj.alamat}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {obj.no_whatsapp}
                  </td>
                  <td className="py-4 px-6">
                    <div className="md:space-x-3 space-x-1 text-center">
                      <div
                        className="tooltip tooltip-bottom"
                        data-tip="Edit Supplier"
                      >
                        <Link to="/supplier/edit" state={obj}>
                          <ButtonIconOutline>
                            <FiEdit3 size="16" />
                          </ButtonIconOutline>
                        </Link>
                      </div>
                      <div
                        className="tooltip tooltip-bottom"
                        data-tip="Hapus Supplier"
                      >
                        {/* <ButtonIconOutline
                          onClick={() => confirmDeleteData(obj.id)}
                        >
                          <FiTrash2 size="16" />
                        </ButtonIconOutline> */}
                        <ButtonIconOutline
                          type="button"
                          onClick={() => {
                            setSelectedId(obj.id_supplier);
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
                  colSpan="5"
                >
                  Data Supplier Kosong
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

export default Supplier;
