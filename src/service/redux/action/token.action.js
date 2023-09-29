import {ReduxConstants} from "../../../util/redux.constants";

export const updateToken = (token) => ({
    type: ReduxConstants.TOKEN.UPDATE,
    token: token,
});