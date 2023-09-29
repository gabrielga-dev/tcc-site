import {ReduxConstants} from "../../../util/redux.constants";

export const updateUser = (user) => ({
    type: ReduxConstants.USER.UPDATE,
    user: user,
});