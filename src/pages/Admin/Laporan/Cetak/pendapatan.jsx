import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { rupiah } from "../../../../utils/strings";

export const LaporanPendapatan = React.forwardRef((props, ref) => {
  moment.locale("id");

  return (
    <div className="text-black mt-5 px-4" ref={ref}>
      <h1 className="text-xl text-center font-bold color-slate-400">SiResto</h1>
      <h2 className="text-md text-center font-semibold color-slate-400">
        Laporan Pendapatan
      </h2>

      <div className="mb-3">
        <span className="text-sm">Tanggal : </span>
        <span className="text-sm">
          {moment(props.tanggalAwal).format("DD-MM-YYYY")} s/d{" "}
          {moment(props.tanggalAkhir).format("DD-MM-YYYY")}
        </span>
      </div>

      <table className="w-full text-sm border-collapse border border-slate-400 table-auto">
        <tbody>
          <tr className="text-sm font-semibold tracking-wide border-b border-slate-400">
            <td colSpan="3" className="px-4 py-3 border border-slate-400">
              Pendapatan
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 border border-slate-400">
              Penjualan Bersih
            </td>
            <td className="px-4 py-2 border border-slate-400"></td>
            <td className="px-4 py-2 border border-slate-400 text-right">
              Rp. {rupiah(props.data.penjualanBersih)}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 border border-slate-400">HPP</td>
            <td className="px-4 py-2 border border-slate-400"></td>
            <td className="px-4 py-2 border border-slate-400 text-right">
              Rp. {rupiah(props.data.hpp)}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 border border-slate-400">
              Laba Kotor (Gross Profit)
            </td>
            <td className="px-4 py-2 border border-slate-400"></td>
            <td className="px-4 py-2 border border-slate-400 text-right">
              Rp. {rupiah(props.data.labaBersih)}
            </td>
          </tr>
          <tr className="text-sm font-semibold tracking-wide border-b border-slate-400">
            <td colSpan="3" className="px-4 py-2 border border-slate-400">
              Beban Usaha
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 border border-slate-400">
              Beban Penjualan
            </td>
            <td className="px-4 py-2 border border-slate-400 text-right">
              Rp. {0}
            </td>
            <td className="px-4 py-2 border border-slate-400"></td>
          </tr>
          <tr>
            <td className="px-4 py-2 border border-slate-400">
              Total Beban Usaha
            </td>
            <td className="px-4 py-2 border border-slate-400 text-right">
              Rp. 0
            </td>
            <td className="px-4 py-2 border border-slate-400"></td>
          </tr>
          <tr>
            <td className="px-4 py-2 border border-slate-400 font-semibold">
              Laba Bersih
            </td>
            <td className="px-4 py-2 border border-slate-400"></td>
            <td className="px-4 py-2 border border-slate-400 font-semibold text-right">
              Rp. {rupiah(props.data.labaBersih)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});
