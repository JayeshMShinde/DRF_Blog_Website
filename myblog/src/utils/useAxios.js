import axios from "axios";
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../services/AuthContext";


export const baseUrl = 'http://127.0.0.1:8000';

const useAxios = () => {
    const {authTokens, setUser, setAuthToken} = useContext(AuthContext)
    
    const axiosInstance = axios.create({
        baseUrl,
        headers:{
            Authorization:`bearer ${authTokens?.access}`
        }
    });

    axiosInstance.interceptors.request.use(async req =>{
        const user = jwtDecode(authTokens.access)
        const isExpired = dayjs.unix(user.exp).diff(dayjs())<1;
        if(!isExpired) return req

        const response = await axios.post(`${baseUrl}/api/token/refresh`,{
            refresh: authTokens.refresh
        });
        localStorage.setItem('authTokens', JSON.stringify(response.data))

        setAuthToken(response.data)
        setUser(response.data.access)

        req.headers.Authorization = `Bearer ${response.data.access}`
        return req
    })
}   

export default useAxios;

