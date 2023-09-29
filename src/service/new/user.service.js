import axios from "axios";
import {API_CONSTANTS} from "../../constants/api.constants";

const BASE_URL_USER = `${API_CONSTANTS.API_BASE_URL}/auth`;
const HEADERS = {
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'API-KEY': API_CONSTANTS.API_KEY
    }
}
const makeHeaders = (token) => ({
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Authorization': 'Bearer ' + token,
        'API-KEY': API_CONSTANTS.API_KEY
    }
})

export const UserService = {
    CREATE: (payload) => (
        axios.post(`${BASE_URL_USER}/v1/person`, payload, HEADERS)
    ),
    LOGIN: (payload) => (axios.post(`${BASE_URL_USER}/v1/person/token`, payload, HEADERS)),
    GET_AUTHENTICATED_USER: (token) => (axios.get(`${BASE_URL_USER}/v1/person`, makeHeaders(token))),
}
