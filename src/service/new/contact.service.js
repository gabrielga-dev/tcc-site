import axios from "axios";
import {API_CONSTANTS} from "../../constants/api.constants";
import {BaseService} from "./base.service";

const BASE_URL_BAND = `${API_CONSTANTS.API_BASE_URL}/band`;

export const ContactService = {
    DELETE_CONTACT: (bandUuid, contactUuid, token) => (
        axios.delete(
            `${BASE_URL_BAND}/v1/contact/band/${bandUuid}/contact/${contactUuid}`, BaseService.MAKE_HEADERS(token)
        )
    ),
    CREATE: (contactForm, bandUuid, token) => (
        axios.post(
            `${BASE_URL_BAND}/v1/contact/band/${bandUuid}`, contactForm, BaseService.MAKE_HEADERS(token)
        )
    ),
    UPDATE: (contactForm, bandUuid, contactUuid, token) => (
        axios.put(
            `${BASE_URL_BAND}/v1/contact/band/${bandUuid}/contact/${contactUuid}`,
            contactForm,
            BaseService.MAKE_HEADERS(token)
        )
    ),
}
