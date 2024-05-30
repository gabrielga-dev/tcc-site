import axios from "axios";
import {API_CONSTANTS} from "../../constants/api.constants";
import {BaseService} from "./base.service";

const BASE_URL_BAND = `${API_CONSTANTS.API_BASE_URL}/band`;

export const BandService = {
    FIND_BANDS: (bandFilter, pagination) => {
        let url = `${BASE_URL_BAND}/v1/band?${pagination.toRequestParameters()}`;
        if (!!bandFilter) {
            url = `${url}&${bandFilter.toRequestParameters()}`
        }
        return axios.get(url, BaseService.HEADERS);
    },
    FIND_AUTHENTICATED_PERSON_BANDS: (bandFilter, pagination, token) => {
        let url = `${BASE_URL_BAND}/v1/band/my-bands?${pagination.toRequestParameters()}`;
        if (!!bandFilter) {
            url = `${url}&${bandFilter.toRequestParameters()}`
        }
        return axios.get(url, BaseService.MAKE_HEADERS(token));
    },
    FIND_BAND_BY_UUID: (bandUuid) => {
        return axios.get(`${BASE_URL_BAND}/v1/band/uuid/${bandUuid}`, BaseService.HEADERS);
    },
    CREATE: (band, picture, token) => {
        const form = new FormData();

        const bandJson = JSON.stringify(band);
        const bandBlob = new Blob([bandJson], {
            type: 'application/json'
        });
        form.append('request', bandBlob);

        form.append('profilePicture', picture);
        return axios.post(`${BASE_URL_BAND}/v1/band`, form, BaseService.MAKE_HEADERS(token));
    },
    TOGGLE_BAND_ACTIVITY_FLAG: (bandUuid, token) => (
        axios.patch(`${BASE_URL_BAND}/v1/band/${bandUuid}/toggle`, null, BaseService.MAKE_HEADERS(token))
    ),
    FIND_PROFILE: (bandUuid, token) => (
        axios.get(`${BASE_URL_BAND}/v1/band/${bandUuid}/profile`, BaseService.MAKE_HEADERS(token))
    ),

    UPDATE: (bandUuid, band, picture, token) => {
        const form = new FormData();

        const bandJson = JSON.stringify(band);
        const bandBlob = new Blob([bandJson], {
            type: 'application/json'
        });
        form.append('request', bandBlob);

        form.append('profilePicture', picture);
        return axios.put(`${BASE_URL_BAND}/v1/band/${bandUuid}`, form, BaseService.MAKE_HEADERS(token))
    },
    UPLOAD_PROFILE_PICTURE: (bandUuid, data, token) => {
        const form = new FormData();
        form.append('picture', data);
        return axios.post(`${BASE_URL_BAND}/v1/band/uuid/${bandUuid}/picture`, form, BaseService.MAKE_HEADERS(token));
    },
    REMOVE_PROFILE_PICTURE: (bandUuid, token) => (
        axios.delete(`${BASE_URL_BAND}/v1/band/uuid/${bandUuid}/picture`, BaseService.MAKE_HEADERS(token))
    ),

    FIND_NAMES: (uuids = [], token) => {
        let params = uuids.map(uuid => `bandsUuids=${uuid}`).join('&');
        return axios.get(`${BASE_URL_BAND}/v1/band/name?${params}`, BaseService.MAKE_HEADERS(token));
    },

    FIND_QUOTE_REQUESTS: (bandUuid, criteria, pagination, token) => {
        let url = `${BASE_URL_BAND}/v1/band/${bandUuid}/quote-request?${pagination.toRequestParameters()}`;
        if (!!criteria) {
            url = `${url}&${criteria.toRequestParameters()}`
        }
        return axios.get(url, BaseService.MAKE_HEADERS(token));
    },

    FIND_QUOTE_REQUEST_BY_UUID: (quoteRequestUuid, token) => (
        axios.get(`${BASE_URL_BAND}/v1/quote-request/${quoteRequestUuid}`, BaseService.MAKE_HEADERS(token))
    ),

    DECLINE_QUOTE_REQUEST: (quoteRequestUuid, token) => (
        axios.delete(`${BASE_URL_BAND}/v1/quote-request/${quoteRequestUuid}`, BaseService.MAKE_HEADERS(token))
    ),

    DOWNLOAD_PLAYLIST_PDF: (quoteRequestUuid, token) => (
        axios.get(
            `${BASE_URL_BAND}/v1/quote-request/${quoteRequestUuid}/playlist`,
            BaseService.MAKE_HEADERS_TO_PDF(token)
        )
    ),

    FIND_ALL_MUSICIANS: (bandUuid, token) => (
        axios.get(`${BASE_URL_BAND}/v1/band/${bandUuid}/musicians`, BaseService.MAKE_HEADERS(token))
    )
}
