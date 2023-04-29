import { toast } from 'react-toastify'

export function toastSuccess(message) {
	return toast.success(message, {
		position: "top-center",
		autoClose: 3000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	});
}

export function toastError(message) {
	return toast.error(message, {
		position: "top-center",
		autoClose: 3000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	});
}

export function toastDark(message) {
	return toast(message, {
		position: "bottom-center",
		autoClose: 1500,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: false,
		draggable: true,
		progress: undefined,
		theme: "dark",
	});
}