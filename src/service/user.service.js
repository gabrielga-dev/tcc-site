import axios from "axios";
import {API_CONSTANTS} from "../constants/api.constants";
import {ServiceUtils} from "../util/service.utils";

const BASE_URL_USER = `${API_CONSTANTS.API_BASE_URL}/user`;
const HEADERS = {
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    }
}
const makeHeaders = (token) => ({
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Authorization': 'Bearer ' + token
    }
})

export const UserService = {
    LOGIN: (payload) => (axios.post(`${API_CONSTANTS.API_BASE_URL}/auth`, payload, HEADERS)),
    GET_AUTHENTICATED_USER: (token) => (axios.get(`${API_CONSTANTS.API_BASE_URL}/auth`, makeHeaders(token))),
    CREATE: (payload) => (axios.post(BASE_URL_USER, payload, HEADERS)),
    GET_ALL_USERS_LEFT: (projectId, pagination, token) => (
        axios.get(
            `${BASE_URL_USER}/left/${projectId}?${ServiceUtils.TO_REQUEST_PARAMS(pagination)}`,
            makeHeaders(token)
        )
    ),
    LIST: (filter, pagination, token) => (
        axios.get(
            `${BASE_URL_USER}?${ServiceUtils.TO_REQUEST_PARAMS(filter)}&${ServiceUtils.TO_REQUEST_PARAMS(pagination)}`,
            makeHeaders(token))
    ),
    FIND_BY_ID: (userId, token) => (axios.get(`${BASE_URL_USER}/${userId}`, makeHeaders(token))),
    DELETE: (userId, token) => (axios.delete(`${BASE_URL_USER}/${userId}`, makeHeaders(token))),
    UPDATE: (userId, user, token) => (axios.put(`${BASE_URL_USER}/${userId}`, user, makeHeaders(token))),
}
