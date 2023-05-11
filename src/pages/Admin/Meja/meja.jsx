import React, { useState, useEffect, useRef } from "react";

// components
import { Button, ButtonIconOutline } from "../../../components/Button";
import HeaderContent from "../../../layouts/HeaderContent";
import TableContent from "../../../layouts/TableContent";
import LoadingTable from "../../../components/LoadingTable";
import Badge from "../../../components/Badge";
import PaginationTable from "../../../components/PaginationTable";
import { QrCode } from "./Cetak/qrCode";

// icons
import {
  FiTrash2,
  FiEdit3,
  FiPlusCircle,
  FiSearch,
  FiPrinter,
  FiHash,
} from "react-icons/fi";

// libraries
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "../../../utils/axios";
import { swConfirm } from "../../../utils/sw";
import { useMutation, QueryClient } from "react-query";
import QRCode from "react-qr-code";
import { baseUrlFrontEnd } from "../../../utils/strings";
import { toastSuccess, toastError } from "../../../utils/toast";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import uuid from "react-uuid";

const Meja = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [qrCode, setQrCode] = useState({});
  const QRCodeRef = useRef();
  const guest = uuid();
  const breadcrumbs = [
    { link: "/", menu: "Home" },
    { link: "/meja", menu: "Meja" },
  ];

  const handlePrint = useReactToPrint({
    content: () => QRCodeRef.current,
  });

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
  const {
    isLoading,
    isError,
    error,
    data,
    isSuccess,
    isFetching,
    refetch,
    isPreviousData,
  } = useQuery(["data-meja", page], () => fetchData(), {
    staleTime: 15000,
    refetchInterval: 15000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation(
    async (id) => {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
      const response = await axios.delete("meja/" + id);
      const res = response.data;

      if (res.meta.code != 200) {
        throw new Error(res.meta.message);
      }

      return res.meta.code;
    },
    {
      onMutate: () => {
        // spinner
        // setIsAction(!isAction)
      },
      onSettled: async (data, error) => {
        // setIsAction(!isAction)

        if (data == 200) {
          refetch();
        }
      },
      onSuccess: async () => {
        toastSuccess("Meja Berhasil Dihapus");
      },
      onError: async () => {
        toastError("Meja Gagal Dihapus");
      },
    }
  );

  // fetch data
  const fetchData = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    const response = await axios.get(
      `meja?s=${keyword}&limit=${limit}&sort=DESC&page=${page}`
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
    mutation.mutate(id);
  };

  const showQrCode = (item) => {
    setQrCode({
      resto: item.resto.nama_resto,
      slug: item.resto.slug,
      noMeja: item.no_meja,
      uuid: item.uuid,
      noTelp: item.resto.no_telepon,
      alamat: item.resto.alamat_lengkap,
      logo: item.resto.logo,
    });
  };

  const printQrCode = () => {
    let checkboxModalQrCode = document.getElementById("modal-qr-code");
    checkboxModalQrCode.checked = false;
    handlePrint();
  };

  return (
    <>
      <HeaderContent title="Meja" breadcrumbs={breadcrumbs}>
        <div class="md:flex mt-4 md:mt-0 flex-1 md:space-x-3 block space-y-3 md:space-y-0">
          <div className="relative flex-1 w-full">
            <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <FiSearch size={20} />
            </div>
            <input
              type="text"
              placeholder="Cari Meja"
              onChange={(e) => setKeyword(e.target.value)}
              className="input input-bordered w-full pl-10 p-2.5 col-span-2"
            />
          </div>
          <div className="text-right">
            <Link to="/meja/tambah">
              <Button
                className="text-xs bg-custom-blue border-custom-blue"
                type="button"
                startIcon={<FiPlusCircle size={20} />}
                loading={false}
                title="Tambah Meja"
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
                No.
              </th>
              <th scope="col" className="py-3 px-6">
                No Meja
              </th>
              <th scope="col" className="py-3 px-6">
                Resto
              </th>
              <th scope="col" className="py-3 px-6">
                Meja Tersedia
              </th>
              <th scope="col" className="py-3 px-6 rounded-tr-md">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <LoadingTable colSpan="5" />
            ) : data.length > 0 ? (
              data?.map((obj, key) => (
                <tr className="bg-white border-b border-blue-200" key={key}>
                  <td className="py-4 px-6 whitespace-nowrap text-center">
                    {++key}
                  </td>
                  <td className="py-4 px-6 text-center">{obj.no_meja}</td>
                  <td className="py-4 px-6 text-center">
                    {obj.resto.nama_resto}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {obj.meja_tersedia == "1" ? (
                      <Badge title="Tersedia" type="success" />
                    ) : (
                      <Badge title="Tidak Tersedia" type="error" />
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="md:space-x-3 space-x-1 text-center">
                      <div
                        className="tooltip tooltip-bottom"
                        data-tip="QR Code Meja"
                      >
                        <label
                          htmlFor="modal-qr-code"
                          onClick={() => showQrCode(obj)}
                        >
                          <ButtonIconOutline>
                            <FiHash size="16" />
                          </ButtonIconOutline>
                        </label>
                      </div>
                      <div
                        className="tooltip tooltip-bottom"
                        data-tip="Edit Meja"
                      >
                        <Link to="/meja/edit" state={obj}>
                          <ButtonIconOutline>
                            <FiEdit3 size="16" />
                          </ButtonIconOutline>
                        </Link>
                      </div>
                      <div
                        className="tooltip tooltip-bottom"
                        data-tip="Hapus Meja"
                      >
                        {/* <ButtonIconOutline
                          onClick={() => confirmDeleteData(obj.id)}
                        >
                          <FiTrash2 size="16" />
                        </ButtonIconOutline> */}
                        <ButtonIconOutline
                          type="button"
                          onClick={() => setIsShowModal(true)}
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
                                        onClick={() =>
                                          confirmDeleteData(obj.id)
                                        }
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
                  Data Meja Kosong
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

      {/* print qr code */}
      <div className="hidden">
        <QrCode
          ref={QRCodeRef}
          uuid={qrCode.uuid}
          user={guest}
          resto={qrCode.resto}
          noTelp={qrCode.noTelp}
          alamat={qrCode.alamat}
          noMeja={qrCode.noMeja}
          slug={qrCode.slug}
        />
      </div>

      <input type="checkbox" id="modal-qr-code" className="modal-toggle" />

      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-3">QR Code</h3>
          <form action="" className="space-y-2">
            <div className="text-center">
              <p className="uppercase text-md">Self Ordering</p>
              <p className="uppercase text md mt-1 mb-5">
                No Meja : {qrCode.noMeja}
              </p>
              <div className="p-3 border border-blue-500 rounded inline-block mb-2">
                {/* <QRCode size={200} className="mx-auto" value={baseUrlFrontEnd + `home/${qrCode.uuid}/${guest}`}/> */}
                <QRCode
                  size={200}
                  className="mx-auto"
                  value={
                    process.env.REACT_APP_SIRESTO_MENU_DOMAIN +
                    `home?source=qrcode&branch=${qrCode.slug}&meja=${qrCode.noMeja}`
                  }
                />
              </div>
              <p className="text-xs text-slate-400">
                Scan QR Code dengan Smartphone anda, setelah itu <br /> akses
                link dari hasil QR Code Tersebut
              </p>
            </div>
          </form>
          <div className="modal-action text-center justify-center items-center">
            <label htmlFor="modal-qr-code" id="label-close"></label>
            <label
              onClick={printQrCode}
              className="btn bg-custom-blue border-custom-blue text-xs gap-2"
            >
              <FiPrinter size={16} />
              Cetak QR Code
            </label>
            <label
              htmlFor="modal-qr-code"
              className="btn btn-link block border-none text-slate-500 mt-2 flex items-center"
            >
              Keluar
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Meja;
