import React, { useState, useEffect, useRef, useCallback } from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import "./laporan.css";

// components
import { Button } from "../../../components/Button";
import HeaderContent from "../../../layouts/HeaderContent";
import { LaporanPenjualan } from "./Cetak/penjualan";

// icons
// import { HiPencil } from "react-icons/hi";
import {
  // BsFillTrash2Fill,
  // BsFillPlusCircleFill,
  BsFillPrinterFill,
} from "react-icons/bs";
// import { MdPublishedWithChanges } from "react-icons/md";
// import { FiPrinter } from "react-icons/fi";
// import { BiSearch, BiPlus, BiDotsHorizontalRounded } from "react-icons/bi";
// import { RiArrowLeftSFill, RiArrowRightSFill } from "react-icons/ri";

// libraries
// import { Link } from "react-router-dom";
// import { useQuery } from "react-query";
import axios from "../../../utils/axios";
// import { swNormal, swConfirm } from "../../../utils/sw";
// import { useMutation, QueryClient } from "react-query";
// import { useNavigate } from "react-router-dom";
// import { useForm, Controller } from "react-hook-form";
// import QRCode from "react-qr-code";
// import { baseUrlFrontEnd } from "../../../utils/strings";
// ReactToPrint,
import { useReactToPrint } from "react-to-print";
import moment from "moment";

const Penjualan = () => {
  moment.locale("id");
  // const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [tanggalAwal, setTanggalAwal] = useState(new Date());
  const [tanggalAkhir, setTanggalAkhir] = useState(new Date());
  const [statusOrder, setStatusOrder] = useState("");
  // const [isAction, setIsAction] = useState(false);
  const [data, setData] = useState([]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => setData([]),
  });

  const breadcrumbs = [
    { link: "/laporan", menu: "Laporan" },
    { link: "/penjualan", menu: "Laporan Penjualan" },
  ];

  const fetchOrder = useCallback(async () => {
    let tanggalAwalFormat = moment(tanggalAwal).format("DD-MM-YYYY [00:00:00]");
    let tanggalAkhirFormat = moment(tanggalAkhir).format(
      "DD-MM-YYYY [23:59:59]"
    );

    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    const response = await axios.get(
      `laporan/laporan-penjualan?tanggal-awal=${tanggalAwalFormat}&tanggal-akhir=${tanggalAkhirFormat}&status-order=${statusOrder}`
    );
    const res = await response.data.data;

    setData(res);
  }, [tanggalAwal, tanggalAkhir, statusOrder, user.token]);

  const handleStatusOrderChange = (e) => {
    setStatusOrder(e.target.value);
  };

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return (
    <>
      <HeaderContent title="Laporan Penjualan" breadcrumbs={breadcrumbs} />
      <div className="bg-white h-max px-6 rounded-lg mt-4 grid grid-cols-12 gap-x-3.5">
        <div className="col-span-2">
          <DatePicker
            onChange={setTanggalAwal}
            value={tanggalAwal}
            className="input input-bordered outline-0 border-blue-500 text-gray-900 text-sm focus:ring-blue-500 block w-full"
          />
        </div>
        <div className="col-span-2">
          <DatePicker
            onChange={setTanggalAkhir}
            value={tanggalAkhir}
            className="input input-bordered outline-0 border-blue-500 text-gray-900 text-sm focus:ring-blue-500 block w-full"
          />
        </div>
        <div className="col-span-2">
          <select
            onChange={handleStatusOrderChange}
            className="input input-bordered outline-0 border-blue-500 text-gray-900 text-sm focus:ring-blue-500 block w-full focus:outline-none"
          >
            <option value="">Semua</option>
            <option value="open">Buka</option>
            <option value="in_progress">Dalam Proses</option>
            <option value="closed">Tutup</option>
          </select>
        </div>
        <div className="col-span-3">
          <Button
            className="text-xs"
            color="primary"
            type="button"
            startIcon={<BsFillPrinterFill size={16} />}
            loading={false}
            title="Cetak Laporan"
            onClick={handlePrint}
          />
        </div>
      </div>

      <div>
        <LaporanPenjualan
          ref={componentRef}
          tanggalAwal={tanggalAwal}
          tanggalAkhir={tanggalAkhir}
          data={data}
        />
      </div>
    </>
  );
};

export default Penjualan;
