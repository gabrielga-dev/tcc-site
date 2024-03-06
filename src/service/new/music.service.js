import {API_CONSTANTS} from "../../constants/api.constants";
import axios from "axios";
import {BaseService} from "./base.service";

const BASE_URL_BAND = `${API_CONSTANTS.API_BASE_URL}/band`;

export const MusicService = {

    LIST_BAND_MUSICS: (bandUuid, token = null, criteria, pagination) => {
        let url = `${BASE_URL_BAND}/v1/music/band/${bandUuid}?${pagination.toRequestParameters()}`;
        if (!criteria.isEmpty()) {
            url = `${url}&${criteria.toRequestParameters()}`
        }
        return axios.get(url, BaseService.MAKE_HEADERS(token))
    },

    CREATE: (bandUuid, music, token) => (
        axios.post(`${BASE_URL_BAND}/v1/music/band/${bandUuid}`, music, BaseService.MAKE_HEADERS(token))
    ),

    UPDATE: (musicUuid, music, token) => (
        axios.put(`${BASE_URL_BAND}/v1/music/${musicUuid}`, music, BaseService.MAKE_HEADERS(token))
    ),

    DEACTIVATE: (musicUuid, token) => (
        axios.delete(`${BASE_URL_BAND}/v1/music/${musicUuid}`, BaseService.MAKE_HEADERS(token))
    ),

    ACTIVATE: (musicUuid, token) => (
        axios.patch(`${BASE_URL_BAND}/v1/music?musicUuid=${musicUuid}`, null, BaseService.MAKE_HEADERS(token))
    ),

    FIND_BY_UUID: (musicUuid, token) => (
        axios.get(`${BASE_URL_BAND}/v1/music/${musicUuid}`, BaseService.MAKE_HEADERS(token))
    ),
}
