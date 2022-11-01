import axios from 'axios';

export const API_URL = `http//localhost:3002/api`

const instance = axios.create({
    withCredentials: true, // accept credentials. send cookie back
    baseURL: 'http://localhost:3002/api'
 })

 instance.interceptors.request.use(req => { // used to work with authmiddleware to get token before request and send it to the middleware
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return req
})

export default instance
