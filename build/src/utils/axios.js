import axios from 'axios'
import { baseUrl } from './strings'

const instance = axios.create({baseURL: baseUrl + 'api/'})
export default instance