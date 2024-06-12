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

    FIND_BY_UUID: (eventUuid, token) => (
        axios.get(`${BASE_URL}/v1/event/${eventUuid}`, BaseService.MAKE_HEADERS(token))
    ),

    FIND_PROFILE: (eventUuid, token) => (
        axios.get(`${BASE_URL}/v1/event/${eventUuid}/profile`, BaseService.MAKE_HEADERS(token))
    ),

    CANCEL: (eventUuid, token) => {
        return axios.delete(`${BASE_URL}/v1/event/${eventUuid}/cancel`, BaseService.MAKE_HEADERS(token));
    },

    FIND_NAMES: (eventUuids, token) => {
        let params = eventUuids.map(uuid => `eventUuids=${uuid}`).join('&');
        return axios.get(`${BASE_URL}/v1/event/names?${params}`, BaseService.MAKE_HEADERS(token));
    },

    HIRE_QUOTE: (quoteRequestUuid, token) => (
        axios.post(`${BASE_URL}/v1/quote/${quoteRequestUuid}/accept`, {}, BaseService.MAKE_HEADERS(token))
    ),

    DECLINE_QUOTE: (quoteRequestUuid, token) => (
        axios.delete(`${BASE_URL}/v1/quote/${quoteRequestUuid}/decline`, BaseService.MAKE_HEADERS(token))
    ),

    GENERATE_CONTRACT: (quoteRequestUuid, token) => (
        axios.get(`${BASE_URL}/v1/quote/${quoteRequestUuid}/contract`, BaseService.MAKE_HEADERS_TO_PDF(token))
    ),

    DASHBOARD: (token) => (
        axios.get(`${BASE_URL}/v1/quote/dashboard`, BaseService.MAKE_HEADERS(token))
    ),
}
