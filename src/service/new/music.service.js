import {API_CONSTANTS} from "../../constants/api.constants";
import axios from "axios";
import {BaseService} from "./base.service";

const BASE_URL_BAND = `${API_CONSTANTS.API_BASE_URL}/band`;

export const MusicService = {

    LIST_BAND_MUSICS: (bandUuid, token=null) => (
        axios.get(`${BASE_URL_BAND}/v1/music/band/${bandUuid}`, BaseService.MAKE_HEADERS(token))
    ),

    CREATE: (bandUuid, music, token) => (
        axios.post(`${BASE_URL_BAND}/v1/music/band/${bandUuid}`, music, BaseService.MAKE_HEADERS(token))
    ),
}
