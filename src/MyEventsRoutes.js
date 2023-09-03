import React from "react";
import Cookies from 'js-cookie';
import LoginPage from "./components/page/non_auth/LoginPage";
import ErrorPage from "./components/page/ErrorPage";
import CreatePersonPage from "./components/page/non_auth/CreatePersonPage";
import App from "./App";
import Home from "./components/routes/Home";
import Contact from "./components/routes/Contact";

const MyEventsRoutes = () => {
    let token = Cookies.get('jwtToken')
    return (!!token) ? AuthRoutes : NonAuthRoutes
}

const NonAuthRoutes = [
    {
        path: "/",
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "/",
                element: <LoginPage/>
            },
            {
                path: "/create-account",
                element: <CreatePersonPage/>
            }
        ]
    },
]

const AuthRoutes = [
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

export default MyEventsRoutes;
