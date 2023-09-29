import {combineReducers} from "redux";
import tokenReducer from "./reducer/token.reducer";
import userReducer from "./reducer/user.reducer";

export const rootReducer =  combineReducers({
    token: tokenReducer,
    user: userReducer,
});