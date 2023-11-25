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
import EditBandPage from "./pages/new/auth/service/band/edit_band.page";
import CreateMusicianPage from "./pages/new/auth/service/band/musician/create_musician.page";
import UploadMusicianProfilePage from "./pages/new/auth/service/band/musician/musician_profile_picture.page";
import {SelectPersonRolePage} from "./pages/new/noauth/select_person_role.page";
import {ValidateEmailPage} from "./pages/new/noauth/validate_email.page";

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
        <Route element={<EditBandPage/>} path="/servicos/bandas/:uuid/editar"/>
        <Route element={<CreateMusicianPage/>} path="/servicos/bandas/:uuid/adicionar-musico"/>
        <Route element={<UploadMusicianProfilePage/>} path="/servicos/bandas/:bandUuid/musico/:musicianUuid/imagem"/>
        <Route element={<UploadMusicianProfilePage/>} path="/servicos/bandas/:bandUuid/musico/:musicianUuid/editar"/>
    </>
)

const nonAuthRoutes = () => (
    <>
        <Route element={<SelectPersonRolePage/>} path="/tipos-cadastro"/>
        <Route element={<CreateAccountPage/>} path="/cadastro/contratante"/>
        <Route element={<CreateAccountPage/>} path="/cadastro/banda"/>
        <Route element={<CreateAccountPage/>} path="/cadastro/musico"/>

        <Route element={<LoginPage/>} path="/login"/>

        <Route element={<ValidateEmailPage/>} path="/verificar/:validation_uuid"/>
    </>
)

const mapStateToProps = state => {
    return {
        token: state.token,
        user: state.user
    }
}

export default connect(mapStateToProps)(AppRoutes);
