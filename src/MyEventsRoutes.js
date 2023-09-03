import React from "react";
import Cookies from 'js-cookie';
import ErrorPage from "./components/page/ErrorPage";
import CreatePersonPage from "./components/page/non_auth/CreatePersonPage";
import Home from "./components/routes/Home";
import Contact from "./components/routes/Contact";
import App from "./App";
import BandListPage from "./components/page/band/BandListPage";
import BuffetListPage from "./components/page/buffet/BuffetListPage";

const MyEventsRoutes = () => {
    let token = Cookies.get('jwtToken')
    return [
        {
            path: "/",
            element: <App/>,
            errorElement: <ErrorPage/>,
            children: [
                {
                    path: "/bands",
                    element: <BandListPage/>
                },
                {
                    path: "/buffets",
                    element: <BuffetListPage/>
                },
                ...(!!token) ? AuthRoutes : NonAuthRoutes
            ]
        }
    ]
}

const NonAuthRoutes = [
    {
        path: "/",
        element: <Home/>
    },
    {
        path: "/create-account",
        element: <CreatePersonPage/>
    }
]

const AuthRoutes = [
    {
        path: "/",
        element: <Home/>
    },
    {
        path: "contact",
        element: <Contact/>
    }
]

export default MyEventsRoutes;
