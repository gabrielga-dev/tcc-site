import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '../src/App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createStore} from 'redux'
import {persistReducer, persistStore} from "redux-persist";
import storageLocal from 'redux-persist/es/storage/index'
import tokenReducer from "./service/redux/reducer/token.reducer";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";

//redux persist
const persistConfig = {
    key: 'my-events-persist',
    storage: storageLocal,
};
const persistedReducer = persistReducer(persistConfig, tokenReducer);

//redux
const store = createStore(persistedReducer);
const persistor = persistStore(store);

//app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App/>
            </PersistGate>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
