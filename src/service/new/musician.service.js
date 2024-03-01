import {API_CONSTANTS} from "../../constants/api.constants";
import axios from "axios";
import {BaseService} from "./base.service";

const BASE_URL_BAND = `${API_CONSTANTS.API_BASE_URL}/band`;

export const MusicianService = {

    CREATE: (bandUuid, picture, musician, token) => {

        const form = new FormData();

        const musicianJson = JSON.stringify(musician);
        const musicianBlob = new Blob([musicianJson], {
            type: 'application/json'
        });
        form.append('request', musicianBlob);

        form.append('profilePicture', picture);
        return axios.post(`${BASE_URL_BAND}/v1/musician/band/${bandUuid}`, form, BaseService.MAKE_HEADERS(token));
    },

    UPDATE: (musicianUuid, picture, musician, token) => {
        const form = new FormData();

        const musicianJson = JSON.stringify(musician);
        const musicianBlob = new Blob([musicianJson], {
            type: 'application/json'
        });
        form.append('request', musicianBlob);

        form.append('profilePicture', picture);
        return axios.put(`${BASE_URL_BAND}/v1/musician/${musicianUuid}`, form, BaseService.MAKE_HEADERS(token));
    },

    ASSOCIATE: (bandUuid, cpf, token) => (
        axios.post(
            `${BASE_URL_BAND}/v1/musician/${cpf}/band/${bandUuid}/associate`,
            null,
            BaseService.MAKE_HEADERS(token)
        )
    ),

    DISASSOCIATE: (bandUuid, musicianUuid, token) => (
        axios.delete(
            `${BASE_URL_BAND}/v1/musician/${musicianUuid}/band/${bandUuid}/disassociate`,
            BaseService.MAKE_HEADERS(token)
        )
    ),

    DELETE: (bandUuid, musicianUuid, token) => (
        axios.delete(
            `${BASE_URL_BAND}/v1/musician/band/${bandUuid}/${musicianUuid}`, BaseService.MAKE_HEADERS(token)
        )
    ),

    FIND_BY_UUID: (musicianUuid, token) => (
        axios.get(`${BASE_URL_BAND}/v1/musician/${musicianUuid}`, BaseService.MAKE_HEADERS(token))
    ),

    FIND_BY_CPF: (musicianCpf, token) => (
        axios.get(`${BASE_URL_BAND}/v1/musician/cpf/${musicianCpf}`, BaseService.MAKE_HEADERS(token))
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

    DEACTIVATE: (musicianUuid, token) => (
        axios.delete(`${BASE_URL_BAND}/v1/musician/${musicianUuid}`, BaseService.MAKE_HEADERS(token))
    ),

    ACTIVATE: (musicianUuid, token) => (
        axios.patch(`${BASE_URL_BAND}/v1/musician?musicianUuid=${musicianUuid}`, {}, BaseService.MAKE_HEADERS(token))
    ),
}
