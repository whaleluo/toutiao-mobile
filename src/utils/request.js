/**
 * 封装 axios 请求模块
 */
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'

const request = axios.create({
  baseURL: 'http://localhost:8080/data', // 基础路径
  // 自定义后端返回的原始数据
  // data: 后端返回的原始数据，说白了就是 JSON 格式的字符串
  transformResponse: [
    function(data) {
      try {
        return JSONBig.parse(data)
      } catch (err) {
        return data
      }

      // axios 默认会在内部这样来处理后端返回的数据
      // return JSON.parse(data)
    }
  ]
})
// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(
  function(config) {
    // 请求与发起会经过这里

    // config：本次请求的配置对象
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // console.log(config)
    return config
  },
  function(error) {
    // D如果请求失败（还没发送出去）会经过这里
    return Promise.reject(error)
  }
)
// 响应拦截器
export default request
