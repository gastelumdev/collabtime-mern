import axios from "axios";
import API_URL from "../api/api_url";
import { TSignin, TUser } from "../types/auth";


export const login = ({email, password}: TSignin) => {
    return axios.post(API_URL + "/login", {email, password}, {headers: {"Content-Type": "application/json"}});
}

export const register = (user: TUser) => {
    return axios.post(API_URL + "/register", user, {headers: {"Content-Type": "application/json"}})
}

export const getSession = () => {
    return axios.get(API_URL + "/user/session/" + localStorage.getItem("userId"), {headers: {"Content-Type": "application/json", Authorization: "JWT " + localStorage.getItem("token"),}})
}

export const logout = () => {
    return axios.get(API_URL + "/logout/" + localStorage.getItem("userId"), {headers: {"Content-Type": "application/json", Authorization: "JWT " + localStorage.getItem("token"),}})
}