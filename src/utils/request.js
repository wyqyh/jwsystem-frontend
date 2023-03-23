import axios from 'axios'
import { transParams } from '../utils/ruoyi'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 10000
})

service.interceptors.request.use(config => {
  if(config.method === 'get' && config.params) {
    let url = config.url + '?' + transParams(config.params)
    url = url.slice(0, -1)
    config.params = {}
    config.url = url
  }
  return config
})

service.interceptors.response.use(res => {
  return res.data
})

export default service