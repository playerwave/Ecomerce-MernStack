import axios from "axios" 

const axiosInstance = axios.create({
    baseURL: import.meta.mode ===  "development" ? "http://loaclhost:5000/api" : "/api", // backend path
    withCredential: true, // ทำให้ส่ง cookie ไปพร้อมกับ request ได้
})

export default axiosInstance;
