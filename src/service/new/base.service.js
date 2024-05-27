import {API_CONSTANTS} from "../../constants/api.constants";

export const BaseService = {
    HEADERS: {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'API-KEY': API_CONSTANTS.API_KEY
        }
    },
    MAKE_HEADERS: (token) => ({
        headers: {
            'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Authorization': 'Bearer ' + token,
            'API-KEY': API_CONSTANTS.API_KEY
        }
    }),
    MAKE_HEADERS_TO_PDF: (token) => ({
        responseType: 'arraybuffer',
        headers: {
            'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Authorization': 'Bearer ' + token,
            'API-KEY': API_CONSTANTS.API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/pdf'
        }
    })
}
