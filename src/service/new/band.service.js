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
    FIND_BAND_BY_UUID: (bandUuid) => {
        return axios.get(`${BASE_URL_BAND}/v1/band/uuid/${bandUuid}`, BaseService.HEADERS);
    },
    CREATE: (band, token) => (
        axios.post(`${BASE_URL_BAND}/v1/band`, band, BaseService.MAKE_HEADERS(token))
    )
}
