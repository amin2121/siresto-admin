import moment from 'moment'

export const slugify = str =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const rupiah = (number) => {

  if(number === 0 || number === '') {
    return number
  }

  var rupiah = '';
  var angkarev = number.toString().split('').reverse().join('');
  for(var i = 0; i < angkarev.length; i++) if(i%3 === 0) rupiah += angkarev.substr(i,3)+'.';
  return rupiah.split('',rupiah.length-1).reverse().join('');
  
  // return new Intl.NumberFormat("id-ID", {
  //   style: "currency",
  //   currency: "IDR",
  //   minimumFractionDigits: 0,
  //   maximumFractionDigits: 0,
  // }).format(number)

  // return number?.toLocaleString("id-ID", {minimumFractionDigits: 0, maximumFractionDigits: 0})
}

export const rupiahToNumber = str => {
  if(str === '' || str === undefined) {
    return 0
  }

  if(str.toString().indexOf('.') >= 0) {
    return str.replace('.', '')
  }

  return str
}

export const baseUrl = 'https://api.siresto.awandigital.id/'
export const baseUrlFrontEnd = 'https://siresto.awandigital.id/'

// export const baseUrl = 'http://127.0.0.1:8000/'
// export const baseUrlFrontEnd = 'http://localhost:3000/'

export const capitalize = (val) => {
  if(val === '' || val === undefined || val === null) {
    return val
  }

  let lower = val.toLowerCase()
  return val.charAt(0).toUpperCase() + lower.slice(1)
}

export const timestampToDate = (timestamp) => {
  moment.locale('id');
  let unix = new Date(timestamp.replace(' ', 'T')).getTime();
  const date = moment.unix(unix);

  const formattedDate = date.format('DD-MMMM-YYYY');

  return formattedDate
}