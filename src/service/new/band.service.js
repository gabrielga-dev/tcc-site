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

    UPDATE: (bandUuid, band, token) => (
        axios.put(`${BASE_URL_BAND}/v1/band/${bandUuid}`, band, BaseService.MAKE_HEADERS(token))
    ),
    UPLOAD_PROFILE_PICTURE: (bandUuid, data, token) => {
        const form = new FormData();
        form.append('picture', data);
        return axios.post(`${BASE_URL_BAND}/v1/band/uuid/${bandUuid}/picture`, form, BaseService.MAKE_HEADERS(token));
    },
    REMOVE_PROFILE_PICTURE: (bandUuid, token) => (
        axios.delete(`${BASE_URL_BAND}/v1/band/uuid/${bandUuid}/picture`, BaseService.MAKE_HEADERS(token))
    ),
}
