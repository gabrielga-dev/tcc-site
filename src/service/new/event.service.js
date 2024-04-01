import {API_CONSTANTS} from "../../constants/api.constants";
import axios from "axios";
import {BaseService} from "./base.service";

const BASE_URL = `${API_CONSTANTS.API_BASE_URL}/event`;

export const EventService = {
    CREATE: (request, token) => (
        axios.post(`${BASE_URL}/v1/event`, request, BaseService.MAKE_HEADERS(token))
    ),

    FIND_BY_CRITERIA: (criteria, pagination, token) => {

        let url = `${BASE_URL}/v1/event?${pagination.toRequestParameters()}`;
        if (!!criteria) {
            url = `${url}&${criteria.toRequestParameters()}`
        }
        return axios.get(url, BaseService.MAKE_HEADERS(token));
    },

    FIND_PROFILE: (eventUuid, token) => {
        return axios.get(`${BASE_URL}/v1/event/${eventUuid}/profile`, BaseService.MAKE_HEADERS(token));
    },

    CANCEL: (eventUuid, token) => {
        return axios.delete(`${BASE_URL}/v1/event/${eventUuid}/cancel`, BaseService.MAKE_HEADERS(token));
    },
}
