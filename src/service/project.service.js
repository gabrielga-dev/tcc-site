import axios from "axios";
import {API_CONSTANTS} from "../constants/api.constants";
import {ServiceUtils} from "../util/service.utils";

const BASE_URL_PROJECT  = `${API_CONSTANTS.API_BASE_URL}/project`;
const makeHeaders =  (token) => ({
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Authorization': 'Bearer ' + token
    }
})

export const ProjectService = {
    CREATE: (payload, token) => (axios.post(BASE_URL_PROJECT, payload, makeHeaders(token))),
    LIST: (filter, pagination, token) => (
        axios.get(
            `${BASE_URL_PROJECT}?${ServiceUtils.TO_REQUEST_PARAMS(filter)}&${ServiceUtils.TO_REQUEST_PARAMS(pagination)}`,
            makeHeaders(token))
    ),
    FIND_BY_ID: (projectId, token) => (axios.get(`${BASE_URL_PROJECT}/${projectId}`, makeHeaders(token))),
    UPDATE: (projectId, project, token) => (
        axios.put(`${BASE_URL_PROJECT}/${projectId}`, project, makeHeaders(token))
    ),
    UPDATE_PARTICIPANTS: (projectId, participantsIds, token) => (
        axios.put(`${BASE_URL_PROJECT}/${projectId}/participants`, participantsIds, makeHeaders(token))
    ),
    DELETE: (projectId, token) => (axios.delete(`${BASE_URL_PROJECT}/${projectId}`, makeHeaders(token))),
    LIST_PROJECTS_WITHOUT_COMMENTS: (pagination, token) => (
        axios.get(
            `${BASE_URL_PROJECT}/without-comments?${ServiceUtils.TO_REQUEST_PARAMS(pagination)}`,
            makeHeaders(token)
        )
    ),
    LIST_COMMENTED_PROJECTS: (pagination, token) => (
        axios.get(
            `${BASE_URL_PROJECT}/commented?${ServiceUtils.TO_REQUEST_PARAMS(pagination)}`,
            makeHeaders(token)
        )
    ),
    COMMENT: (comment, projectId, token) => (
        axios.post(`${BASE_URL_PROJECT}/comment/${projectId}`, comment, makeHeaders(token))
    ),
}