import axios from "axios";
import {API_CONSTANTS} from "../../constants/api.constants";

const BASE_URL_FILE = `${API_CONSTANTS.API_BASE_URL}/file`;

export const FileService = {
    GET_IMAGE_URL: (imageUuid) => (`${BASE_URL_FILE}/v1/file/image/{file_uuid}`),
    GET_IMAGE: (imageUuid) => (
        axios.get(`${BASE_URL_FILE}/v1/file/image/{file_uuid}`)
    ),
}
