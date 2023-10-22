import {API_CONSTANTS} from "../../constants/api.constants";
import axios from "axios";
import {BaseService} from "./base.service";

const BASE_URL_BAND = `${API_CONSTANTS.API_BASE_URL}/band`;

export const MusicianService = {

    CREATE: (bandUuid, musician, token) => (
        axios.post(`${BASE_URL_BAND}/v1/musician/band/${bandUuid}`, musician, BaseService.MAKE_HEADERS(token))
    ),

    DELETE: (bandUuid, musicianUuid, token) => (
        axios.delete(
            `${BASE_URL_BAND}/v1/musician/band/${bandUuid}/${musicianUuid}`, BaseService.MAKE_HEADERS(token)
        )
    ),

    FIND_BY_UUID: (bandUuid, musicianUuid, token) => (
        axios.get(`${BASE_URL_BAND}/v1/musician/band/${bandUuid}/${musicianUuid}`, BaseService.MAKE_HEADERS(token))
    ),

    UPLOAD_PROFILE_PICTURE: (musicianUuid, data, token) => {
        const form = new FormData();
        form.append('avatar', data);
        return axios.post(
            `${BASE_URL_BAND}/v1/musician/${musicianUuid}/avatar`, form, BaseService.MAKE_HEADERS(token)
        );
    },

    REMOVE_PROFILE_PICTURE: (musicianUuid, token) => (
        axios.delete(`${BASE_URL_BAND}/v1/musician/${musicianUuid}/avatar`, BaseService.MAKE_HEADERS(token))
    ),
}
