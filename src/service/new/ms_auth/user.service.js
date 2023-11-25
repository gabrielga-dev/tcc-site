import axios from "axios";
import {API_CONSTANTS} from "../../../constants/api.constants";
import {BaseService} from "../base.service";

const BASE_URL_USER = `${API_CONSTANTS.API_BASE_URL}/auth`;

export const UserService = {
    CREATE: (payload, role) => {
        let headers = BaseService.HEADERS;
        headers.headers.role = role;

        return axios.post(`${BASE_URL_USER}/v1/person`, payload, headers);
    },
    LOGIN: (payload) => (axios.post(`${BASE_URL_USER}/v1/person/token`, payload, BaseService.HEADERS)),
    GET_AUTHENTICATED_USER: (token) => (axios.get(`${BASE_URL_USER}/v1/person`, BaseService.MAKE_HEADERS(token)))
}
