const ID_TOKEN_KEY = 'id_token_awan_digital_id'
const REACT_APP_ENV = process.env.REACT_APP_ENV
const REACT_APP_COOKIE_DOMAIN = process.env.REACT_APP_COOKIE_DOMAIN

const getToken = () => {
  return getCookie(ID_TOKEN_KEY)
}

const saveToken = (token) => {
  setCookie(token)
}

const destroyToken = () => {
  if (REACT_APP_ENV === 'local') {
    document.cookie =
      ID_TOKEN_KEY + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  } else {
    document.cookie =
      ID_TOKEN_KEY +
      '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;domain=' +
      REACT_APP_COOKIE_DOMAIN +
      ';'
  }
}

function setCookie(cvalue) {
  let d = new Date()
  d.setTime(d.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days
  let expires = 'expires=' + d.toUTCString()

  if (REACT_APP_ENV === 'local') {
    document.cookie = ID_TOKEN_KEY + '=' + cvalue + ';' + expires + ';path=/;'
  } else {
    document.cookie =
      ID_TOKEN_KEY +
      '=' +
      cvalue +
      ';' +
      expires +
      ';path=/;domain=' +
      REACT_APP_COOKIE_DOMAIN +
      ';'
  }
}

function getCookie(cname) {
  var name = cname + '='
  var decodedCookie = decodeURIComponent(document.cookie)
  var ca = decodedCookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}
const exportedObject = {
    getToken, 
    saveToken, 
    destroyToken
}
export default exportedObject
