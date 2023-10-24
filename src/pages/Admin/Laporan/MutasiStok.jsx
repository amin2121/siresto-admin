import React, { useState, useEffect, useRef, useCallback } from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import "./laporan.css";

// components
import { Button } from "../../../components/Button";
import HeaderContent from "../../../layouts/HeaderContent";
import { LaporanMutasiStok } from "./Cetak/MutasiStok";

// icons
import { HiPencil } from "react-icons/hi";
import {
  BsFillTrash2Fill,
  BsFillPlusCircleFill,
  BsFileSpreadsheet,
  BsFillPrinterFill,
} from "react-icons/bs";
import { MdPublishedWithChanges } from "react-icons/md";
import { FiPrinter } from "react-icons/fi";
import { BiSearch, BiPlus, BiDotsHorizontalRounded } from "react-icons/bi";
import { RiArrowLeftSFill, RiArrowRightSFill } from "react-icons/ri";

// libraries
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "../../../utils/axios";
import { swNormal, swConfirm } from "../../../utils/sw";
import { useMutation, QueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import QRCode from "react-qr-code";
import { baseUrlFrontEnd } from "../../../utils/strings";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import moment from "moment";

const MutasiStok = () => {
  moment.locale("id");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [tanggalAwal, setTanggalAwal] = useState(new Date());
  const [tanggalAkhir, setTanggalAkhir] = useState(new Date());
  const [isAction, setIsAction] = useState(false);
  const [data, setData] = useState([]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const breadcrumbs = [
    { link: "/laporan", menu: "Laporan" },
    { link: "/mutasi-stok", menu: "Laporan Mutasi Stok" },
  ];

  const fetchOrder = useCallback(async () => {
    setIsAction(true)
    let tanggalAwalFormat = moment(tanggalAwal).format("DD-MM-YYYY [00:00:00]");
    let tanggalAkhirFormat = moment(tanggalAkhir).format(
      "DD-MM-YYYY [23:59:59]"
    );

    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    const response = await axios.get(
      `laporan/mutasi-stok?tanggal-awal=${tanggalAwalFormat}&tanggal-akhir=${tanggalAkhirFormat}`
    );
    const res = await response.data.data;

    setData(res);
    setIsAction(false)
  }, [tanggalAwal, tanggalAkhir]);

  // useEffect(() => {
  //   if (data.length > 0) {
  //     handlePrint();
  //   }
  // }, [data]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return (
    <>
      <HeaderContent title="Laporan Mutasi Stok" breadcrumbs={breadcrumbs} />
      <div className="bg-white h-max px-6 rounded-lg mt-4 flex justify-left gap-4 relative">
        <div className="col-span-2">
          <DatePicker
            onChange={setTanggalAwal}
            value={tanggalAwal}
            className="input input-bordered outline-0 border-custom-purple text-gray-900 text-sm focus:ring-custom-purple block w-full"
          />
        </div>
        <div className="col-span-2">
          <DatePicker
            onChange={setTanggalAkhir}
            value={tanggalAkhir}
            className="input input-bordered outline-0 border-custom-purple text-gray-900 text-sm focus:ring-custom-purple block w-full"
          />
        </div>
        <div className="col-span-3">
          <Button
            className="text-xs bg-custom-purple border-custom-purple"
            type="button"
            startIcon={<BsFillPrinterFill size={16} />}
            loading={false}
            title="Cetak Laporan"
            onClick={handlePrint}
          />
        </div>
      </div>

      <div>
        <LaporanMutasiStok
          ref={componentRef}
          tanggalAwal={tanggalAwal}
          tanggalAkhir={tanggalAkhir}
          data={data}
          isAction={isAction}
        />
      </div>
    </>
  );
};

export default MutasiStok;
