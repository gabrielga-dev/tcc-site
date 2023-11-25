import {API_CONSTANTS} from "../../../constants/api.constants";
import axios from "axios";
import {BaseService} from "../base.service";

const BASE_URL_MS_AUTH = `${API_CONSTANTS.API_BASE_URL}/auth`;

export const EmaiValidationService = {

    CHECK_IF_EMAIL_VALIDATION_EXISTS: (emailValidationUuid) => (
        axios.get(`${BASE_URL_MS_AUTH}/v1/email-validation/${emailValidationUuid}`, BaseService.HEADERS)
    ),

    VALIDATE: (emailValidationUuid) => (
        axios.patch(
            `${BASE_URL_MS_AUTH}/v1/email-validation/person-creation/${emailValidationUuid}`,
            {},
            BaseService.HEADERS
        )
    ),
}
