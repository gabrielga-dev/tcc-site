import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {CreateAccountPage} from "./pages/new/noauth/create_account.page";
import {connect} from "react-redux";
import LoginPage from "./pages/new/noauth/login_page";
import HomePage from "./pages/new/both/home_page";
import {SearchServicesPage} from "./pages/new/both/service/search_service_page";
import {SearchBandsPage} from "./pages/new/both/service/band/search_band_page";
import BandProfilePage from "./pages/new/both/service/band/band_profile.page";
import CreateServicePage from "./pages/new/auth/service/create_service.page";
import CreateBandPage from "./pages/new/auth/service/band/create_band.page";
import {SearchAuthenticatedServices} from "./pages/new/auth/service/search_authenticated_person_service.page";
import SearchAuthenticatedPersonBandsPage from "./pages/new/auth/service/band/search_authenticated_person_band.page";

const AppRoutes = ({token, user}) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<HomePage/>} path="/"/>
                <Route element={<SearchServicesPage/>} path="/servicos"/>
                <Route element={<SearchBandsPage/>} path="/servicos/bandas"/>
                <Route element={<BandProfilePage/>} path="/servicos/bandas/:uuid"/>
                {
                    (token)
                        ? authRoutes()
                        : nonAuthRoutes()
                }
                <Route element={<h1>Página não encontrada</h1>} path="*"/>
            </Routes>
        </BrowserRouter>
    );
}

const authRoutes = () => (
    <>
        <Route element={<SearchAuthenticatedServices/>} path="/meus-servicos"/>
        <Route element={<SearchAuthenticatedPersonBandsPage/>} path="/meus-servicos/banda"/>
        <Route element={<CreateServicePage/>} path="/servico/criar"/>
        <Route element={<CreateBandPage/>} path="/servico/criar/banda"/>
    </>
)

const nonAuthRoutes = () => (
    <>
        <Route element={<CreateAccountPage/>} path="/cadastre-se" exact={true}/>
        <Route element={<LoginPage/>} path="/login"/>
    </>
)

const mapStateToProps = state => {
    return {
        token: state.token,
        user: state.user
    }
}

export default connect(mapStateToProps)(AppRoutes);
