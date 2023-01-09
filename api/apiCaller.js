import axios from 'axios'
import { getLocalStorageWithExpiry } from '@/utils/localStorage'
import Vue from 'vue'

const apiCaller = axios.create({
  baseURL: process.env.XXX,
  // timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})
// req
apiCaller.interceptors.request.use(function (config) {


}, function (error) {
  return Promise.reject(error)
})
// res
apiCaller.interceptors.response.use(function (response) {
  return response
}, function (error) {
})



export default apiCaller
