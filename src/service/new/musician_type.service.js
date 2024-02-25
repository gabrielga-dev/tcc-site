import {API_CONSTANTS} from "../../constants/api.constants";
import axios from "axios";
import {BaseService} from "./base.service";

const BASE_URL_BAND = `${API_CONSTANTS.API_BASE_URL}/band`;

export const MusicianTypeService = {
    FIND_ALL: (token) => (
        axios.get(`${BASE_URL_BAND}/v1/musician/type/all`, BaseService.MAKE_HEADERS(token))
    )
}
