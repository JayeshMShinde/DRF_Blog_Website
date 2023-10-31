import axios from "axios";
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";

const baseUrl = 'http://127.0.0.1:8000'

let authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null

const axiosInstance = axios.create({
    baseUrl,
    headers: {
        Authorization: `Bearer ${authTokens?.access}`
    }
});

axiosInstance.interceptors.request.use(async req => {
    if (!authTokens) {
        authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
        req.headers.Authorization = `bearer ${authTokens?.access}`
    }
    if (authTokens?.access) {
        const user = jwtDecode(authTokens?.access)
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

        if (!isExpired) return req

        const response = await axios.post(`${baseUrl}/api/token/refresh/`, {
            refresh: authTokens.refresh
        });

        localStorage.setItem('authTokens', JSON.stringify(response.data))
        req.headers.Authorization = `bearer ${response.data.access}`
        return req
    }

    return req
})

export default axiosInstance;