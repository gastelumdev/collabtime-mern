import axios from "axios";
import API_URL from "../api/api_url";
import { TEvent } from "../types/event";

export const getEvents = () => {
    return axios.get(API_URL + "/events", {headers: {"Content-Type": "application/json", Authorization: "JWT " + localStorage.getItem("token"),}});
}

export const createEvent = (event: TEvent) => {
    return axios.post(API_URL + "/events", event, {headers: {"Content-Type": "application/json", Authorization: "JWT " + localStorage.getItem("token"),}});
}