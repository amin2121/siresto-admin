import { Routes, Route } from 'react-router-dom'

import ContainerUser from '../pages/User/Container'
import ContainerEmpty from '../pages/User/ContainerEmpty'
import Home from '../pages/User/Home'
import Keranjang from '../pages/User/Keranjang'
import Pembayaran from '../pages/User/Pembayaran'
import DaftarNoTelepon from '../pages/User/DaftarNoTelepon'
import DaftarNamaPelanggan from '../pages/User/DaftarNamaPelanggan'
import PembayaranBerhasil from '../pages/User/PembayaranBerhasil'
import StatusOrder from '../pages/User/StatusOrder'

const RouteManager = () => {
	return (
		<Routes>
			<Route path="/" element={<ContainerUser/>}>
				<Route index element={<Home />}/>
				<Route path="home" element={<Home />}/>
				<Route path="status-order" element={<StatusOrder />}/>
				<Route path="keranjang" element={<Keranjang />}/>
				<Route path="pembayaran" element={<Pembayaran />}/>
				<Route path="pembayaran-berhasil" element={<PembayaranBerhasil />}/>
			</Route>
			<Route path="/" element={<ContainerEmpty/>}>
				<Route path="nomor-telepon" element={<DaftarNoTelepon />}/>
				<Route path="nama-pelanggan" element={<DaftarNamaPelanggan />}/>
			</Route>
		</Routes>
	)
}

export { RouteManager }