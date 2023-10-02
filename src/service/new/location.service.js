import axios from "axios";
import {API_CONSTANTS} from "../../constants/api.constants";
import {BaseService} from "./base.service";

const BASE_URL_LOCATION = `${API_CONSTANTS.API_BASE_URL}/location`;


export const LocationService = {
    GET_BRAZIL_STATES: () => (
        axios.get(`${BASE_URL_LOCATION}/v1/location/country/BR/states`, BaseService.HEADERS)
    ),
    GET_STATE_CITIES: (stateIso) => (
        axios.get(`${BASE_URL_LOCATION}/v1/location/country/BR/state/${stateIso}/cities`, BaseService.HEADERS)
    ),
}
