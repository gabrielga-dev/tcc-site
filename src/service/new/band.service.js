import axios from "axios";
import {API_CONSTANTS} from "../../constants/api.constants";
import {BaseService} from "./base.service";
import {PaginationDto} from "../../domain/new/dto/page/pagination.dto";

const BASE_URL_BAND = `${API_CONSTANTS.API_BASE_URL}/band`;

export const BandService = {
    FIND_BANDS: (bandFilter, pagination) => {
        let url = `${BASE_URL_BAND}/v1/band?${pagination.toRequestParameters()}`;
        if (!!bandFilter) {
            url = `${url}&${bandFilter.toRequestParameters()}`
        }
        return axios.get(url, BaseService.HEADERS);
    },
}
