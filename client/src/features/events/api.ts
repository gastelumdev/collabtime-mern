import axios from "axios";
import API_URL from "../api/api_url";
import { TData } from "./types";
import config from "./config";

export const getData = () => {
    return axios.get(API_URL + `/${config.name}`, {headers: {"Content-Type": "application/json", Authorization: "JWT " + localStorage.getItem("token"),}});
}

export const createData = (data: TData) => {
    return axios.post(API_URL + `/${config.name}`, data, {headers: {"Content-Type": "application/json", Authorization: "JWT " + localStorage.getItem("token"),}});
}

export const updateData = (data: TData) => {
    return axios.post(API_URL + `/${config.name}/update/` + data._id, data, {headers: {"Content-Type": "application/json", Authorization: "JWT " + localStorage.getItem("token"),}});
}

export const deleteData = (dataId: string) => {
    return axios.post(API_URL + `/${config.name}/delete/` + dataId, {dataId: dataId}, {headers: {"Content-Type": "application/json", Authorization: "JWT " + localStorage.getItem("token"),}});
}