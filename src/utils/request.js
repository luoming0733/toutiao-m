/**
 * 封装 axios 请求模块
 */
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'

const request = axios.create({
  baseURL: 'http://toutiao-app.itheima.net/',
  transformResponse: [
    function(data) {
      try {
        return JSONBig.parse(data)
      } catch (err) {
        return data // 后端返回的原始数据
      }
    }
  ]
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 请求发起经过这里
    // config 配置对象:本次请求的配置对象
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  error => {
    // 请求出错了
    return Promise.reject(error)
  }
)
export default request
