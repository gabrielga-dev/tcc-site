import {API_CONSTANTS} from "../../constants/api.constants";
import axios from "axios";
import {BaseService} from "./base.service";


const BASE_URL = `${API_CONSTANTS.API_BASE_URL}/event`;

export const QuoteRequestService = {

    FIND_ALL: (eventUuid, token) => (
        axios.get(`${BASE_URL}/v1/quote-request/${eventUuid}`, BaseService.MAKE_HEADERS(token))
    ),

    CREATE_FOR_BAND: (eventUuid, bandUuid, request, token) => (
        axios.post(
            `${BASE_URL}/v1/quote-request/${eventUuid}/band/${bandUuid}`,
            request,
            BaseService.MAKE_HEADERS(token)
        )
    )
}
