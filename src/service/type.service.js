import axios from "axios";
import {API_CONSTANTS} from "../constants/api.constants";

const BASE_URL_TYPE  = `${API_CONSTANTS.API_BASE_URL}/type`;
const makeHeaders =  (token) => ({
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Authorization': 'Bearer ' + token
    }
})

export const TypeService = {
    PROJECT_SITUATION_VALUES: (token) => (axios.get(`${BASE_URL_TYPE}/project-situation`, makeHeaders(token))),
}