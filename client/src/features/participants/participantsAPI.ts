import axios from "axios";
import API_URL from "../api/api_url";
import { TParticipant } from "../types/participant";

export const getParticipants = (eventId: string | null) => {
    return axios.get(API_URL + "/participants/" + eventId, {headers: {"Content-Type": "application/json", Authorization: "JWT " + localStorage.getItem("token"),}, params: {eventId: eventId}});
}

export const createParticipant = (event: TParticipant) => {
    return axios.post(API_URL + "/participants", event, {headers: {"Content-Type": "application/json", Authorization: "JWT " + localStorage.getItem("token"),}});
}

export const updateParticipant = (participant: TParticipant) => {
    return axios.post(API_URL + "/participants/update/" + participant._id, participant, {headers: {"Content-Type": "application/json", Authorization: "JWT " + localStorage.getItem("token"),}});
}

export const deleteParticipant = (participantId: string) => {
    return axios.post(API_URL + "/participants/delete/" + participantId, {participantId: participantId}, {headers: {"Content-Type": "application/json", Authorization: "JWT " + localStorage.getItem("token"),}});
}