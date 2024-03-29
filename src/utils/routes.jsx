import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routeGuard";

// pages
import {
  DashboardOwner,
  DashboardSuperadmin,
  ContainerDashboard,
} from "../pages/Admin/Dashboard";
import ContainerAdmin from "../pages/Admin/container";
import Container from "../pages/Container";
import {
  Resto,
  ContainerResto,
  TambahResto,
  EditResto,
  EditLisensi,
} from "../pages/Admin/Resto";
import {
  KategoriBisnis,
  ContainerKategoriBisnis,
  TambahKategoriBisnis,
  EditKategoriBisnis,
} from "../pages/Admin/KategoriBisnis";
import {
  Produk,
  ContainerProduk,
  TambahProduk,
  EditProduk,
} from "../pages/Admin/Produk";
import {
  KategoriProduk,
  ContainerKategoriProduk,
  TambahKategoriProduk,
  EditKategoriProduk,
} from "../pages/Admin/KategoriProduk";
import {
  Meja,
  ContainerMeja,
  TambahMeja,
  EditMeja,
  FileQrCode,
} from "../pages/Admin/Meja";
import { Register, Login, ContainerAuth } from "../pages/Admin/Auth";
import {
  Order,
  ContainerOrder,
  TambahOrder,
  EditOrder,
  PembayaranOrder,
  DetailOrder,
} from "../pages/Admin/Order";
import {
  Supplier,
  ContainerSupplier,
  TambahSupplier,
  EditSupplier,
} from "../pages/Admin/Supplier";
import {
  Promo,
  ContainerPromo,
  TambahPromo,
  EditPromo,
} from "../pages/Admin/Promo";
import {
  Staff,
  ContainerStaff,
  TambahStaff,
  EditStaff,
  ResetPassword as ResetPasswordStaff,
} from "../pages/Admin/Staff";
import {
  Level,
  ContainerLevel,
  TambahLevel,
  EditLevel,
} from "../pages/Admin/Level";
import {
  Pembayaran as PembayaranSetting,
  ResetPassword as ResetPasswordSetting,
  UbahProfile as UbahProfileSetting,
  KonfigurasiResto as KonfigurasiRestoSetting,
  LinkMenu as LinkMenuSetting,
  ContainerSetting,
} from "../pages/Admin/Setting";
import {
  ContainerLaporan,
  LaporanPenjualan,
  LaporanPendapatan,
  LaporanStok,
  LaporanMutasiStok,
  StokOpname,
  TambahStokOpname,
} from "../pages/Admin/Laporan";
import {
  StokMasuk,
  ContainerStok,
} from "../pages/Admin/Stok";
import ForgotPassword from "../pages/Admin/Auth/ForgotPassword";
import ResetPasswordLink from "../pages/Admin/Auth/ResetPassword";

const RouteManager = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      <Route path="/" element={<Container />}>
        <Route path="/" element={<ContainerAdmin />}>
          <Route
            index
            element={
              <ProtectedRoute>
                {user?.level == "Superadmin" ? (
                  <DashboardSuperadmin />
                ) : (
                  <DashboardOwner />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <ContainerDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="superadmin" element={<DashboardSuperadmin />} />
            <Route path="owner" element={<DashboardOwner />} />
          </Route>
          <Route
            path="resto"
            element={
              <ProtectedRoute>
                <ContainerResto />
              </ProtectedRoute>
            }
          >
            <Route index element={<Resto />} />
            <Route path="tambah" element={<TambahResto />} />
            <Route path="edit" element={<EditResto />} />
            <Route path="edit/lisensi" element={<EditLisensi />} />
          </Route>
          <Route
            path="kategori-bisnis"
            element={
              <ProtectedRoute>
                <ContainerKategoriBisnis />
              </ProtectedRoute>
            }
          >
            <Route index element={<KategoriBisnis />} />
            <Route path="tambah" element={<TambahKategoriBisnis />} />
            <Route path="edit" element={<EditKategoriBisnis />} />
          </Route>
          <Route
            path="produk"
            element={
              <ProtectedRoute>
                <ContainerProduk />
              </ProtectedRoute>
            }
          >
            <Route index element={<Produk />} />
            <Route path="tambah" element={<TambahProduk />} />
            <Route path="edit" element={<EditProduk />} />
          </Route>
          <Route
            path="kategori-produk"
            element={
              <ProtectedRoute>
                <ContainerKategoriProduk />
              </ProtectedRoute>
            }
          >
            <Route index element={<KategoriProduk />} />
            <Route path="tambah" element={<TambahKategoriProduk />} />
            <Route path="edit" element={<EditKategoriProduk />} />
          </Route>
          <Route
            path="meja"
            element={
              <ProtectedRoute>
                <ContainerMeja />
              </ProtectedRoute>
            }
          >
            <Route index element={<Meja />} />
            <Route path="tambah" element={<TambahMeja />} />
            <Route path="edit" element={<EditMeja />} />
          </Route>
          <Route
            path="order"
            element={
              <ProtectedRoute>
                <ContainerOrder />
              </ProtectedRoute>
            }
          >
            <Route index element={<Order />} />
            <Route path="tambah" element={<TambahOrder />} />
            <Route path="detail" element={<DetailOrder />} />
            <Route path="pembayaran" element={<PembayaranOrder />} />
          </Route>
          <Route
            path="promo"
            element={
              <ProtectedRoute>
                <ContainerPromo />
              </ProtectedRoute>
            }
          >
            <Route index element={<Promo />} />
            <Route path="tambah" element={<TambahPromo />} />
            <Route path="edit" element={<EditPromo />} />
          </Route>
          <Route
            path="laporan"
            element={
              <ProtectedRoute>
                <ContainerLaporan />
              </ProtectedRoute>
            }
          >
            <Route path="penjualan" element={<LaporanPenjualan />} />
            <Route path="pendapatan" element={<LaporanPendapatan />} />
            <Route path="stok" element={<LaporanStok />} />
            <Route path="mutasi-stok" element={<LaporanMutasiStok />} />
          </Route>
          <Route
            path="supplier"
            element={
              <ProtectedRoute>
                <ContainerSupplier />
              </ProtectedRoute>
            }
          >
            <Route index element={<Supplier />} />
            <Route path="tambah" element={<TambahSupplier />} />
            <Route path="edit" element={<EditSupplier />} />
          </Route>
          <Route
            path="stok"
            element={
              <ProtectedRoute>
                <ContainerStok />
              </ProtectedRoute>
            }
          >
            <Route path="stok-masuk" element={<StokMasuk />} />
          </Route>
          <Route
            path="stok-opname"
            element={
              <ProtectedRoute>
                <ContainerLaporan />
              </ProtectedRoute>
            }
          >
            <Route index element={<StokOpname />} />
            <Route path="tambah" element={<TambahStokOpname />} />
          </Route>
          <Route
            path="staff"
            element={
              <ProtectedRoute>
                <ContainerStaff />
              </ProtectedRoute>
            }
          >
            <Route index element={<Staff />} />
            <Route path="tambah" element={<TambahStaff />} />
            <Route path="edit" element={<EditStaff />} />
            <Route path="reset-password" element={<ResetPasswordStaff />} />
          </Route>
          <Route
            path="level"
            element={
              <ProtectedRoute>
                <ContainerLevel />
              </ProtectedRoute>
            }
          >
            <Route index element={<Level />} />
            <Route path="tambah" element={<TambahLevel />} />
            <Route path="edit" element={<EditLevel />} />
          </Route>
          <Route
            path="setting"
            element={
              <ProtectedRoute>
                <ContainerSetting />
              </ProtectedRoute>
            }
          >
            <Route path="pembayaran" element={<PembayaranSetting />} />
            <Route
              path="konfigurasi-resto"
              element={<KonfigurasiRestoSetting />}
            />
            <Route path="update-password" element={<ResetPasswordSetting />} />
            <Route path="ubah-profile" element={<UbahProfileSetting />} />
            <Route path="pesan-online" element={<LinkMenuSetting />} />
          </Route>
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="password-reset/:token" element={<ResetPasswordLink />} />
      </Route>
    </Routes>
  );
};

export { RouteManager };
