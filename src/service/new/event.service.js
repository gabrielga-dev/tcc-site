import {API_CONSTANTS} from "../../constants/api.constants";
import axios from "axios";
import {BaseService} from "./base.service";

const BASE_URL = `${API_CONSTANTS.API_BASE_URL}/event`;

export const EventService = {
    CREATE: (request, token) => (
        axios.post(`${BASE_URL}/v1/event`, request, BaseService.MAKE_HEADERS(token))
    ),
}
