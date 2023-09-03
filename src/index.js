import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from './components/routes/Home';
import Contact from './components/routes/Contact';
import ErrorPage from './components/page/ErrorPage';
import App from "./App";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App/>,
            errorElement: <ErrorPage/>,
            children: [
                {
                    path: "/",
                    element: <Home/>
                },
                {
                    path: "contact",
                    element: <Contact/>
                }
            ]
        },
    ]
);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
