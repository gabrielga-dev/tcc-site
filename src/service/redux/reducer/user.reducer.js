import {ReduxConstants} from "../../../util/redux.constants";

const userReducer = (state, action) => {
    const newState = {...state};
    console.log('AAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHH')
    if (action.type === ReduxConstants.USER.UPDATE){
        newState.user = action.user;
    }
    return newState;
}

export default userReducer;