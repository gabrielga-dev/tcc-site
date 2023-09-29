import {ReduxConstants} from "../../../util/redux.constants";

const tokenReducer = (state, action) => {
    const newState = {...state};
    if (action.type === ReduxConstants.TOKEN.UPDATE){
        newState.token = action.token;
    }
    if (action.type === ReduxConstants.USER.UPDATE){
        newState.user = action.user;
    }
    return newState;
}

export default tokenReducer;