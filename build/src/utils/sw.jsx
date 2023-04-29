import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export function swNormal(title, message, icon) {
	MySwal.fire({
		title: `<strong>${title}</strong>`,
		html: message,
		icon: icon,
		closeOnConfirm: false,
        showConfirmButton: false,
        timer: 2000,
	})
}

export function swConfirm(title = 'Apakah Anda Yakin?', text = 'Ingin Menghapus Data Ini', confirmButtonText = 'Iya, Hapus') {
	return MySwal.fire({
	  title: title,
	  text: text,
	  icon: 'warning',
	  showCancelButton: true,
	  confirmButtonColor: '#3085d6',
	  cancelButtonColor: '#636C74',
	  confirmButtonText: confirmButtonText
	})
}