import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {CreateAccountPage} from "./pages/noauth/create_person/create_account.page";
import {connect} from "react-redux";
import LoginPage from "./pages/noauth/login_page";
import HomePage from "./pages/both/home_page";
import {SearchServicesPage} from "./pages/both/service/search_service_page";
import {SearchBandsPage} from "./pages/both/service/band/search_band_page";
import CreateServicePage from "./pages/auth/service/create_service.page";
import {SearchAuthenticatedServices} from "./pages/auth/service/search_authenticated_person_service.page";
import SearchAuthenticatedPersonBandsPage from "./pages/auth/service/band/search_authenticated_person_band.page";
import EditBandPage from "./pages/auth/service/band/edit_band.page";
import CreateMusicianPage from "./pages/auth/service/band/musician/create_musician.page";
import UploadMusicianProfilePage from "./pages/auth/service/band/musician/musician_profile_picture.page";
import {SelectPersonRolePage} from "./pages/noauth/create_person/select_person_role.page";
import {ValidateEmailPage} from "./pages/noauth/validate_email/validate_email.page";
import {RequestPasswordChangePage} from "./pages/noauth/password_change/request_password_change.page";
import {ChangePasswordPage} from "./pages/noauth/password_change/change_password.page";
import AuthenticatedPersonProfilePage from "./pages/auth/person/profile/authenticated_person_profile.page";
import ChangeEmailPage from "./pages/both/change_email.page";
import {updateToken} from "./service/redux/action/token.action";
import {updateUser} from "./service/redux/action/user.action";
import ListBandsPage from "./pages/both/band/list/list_bands.page";
import CreateBandPage from "./pages/auth/band/create/create_band.page";
import ListOwnBandsPage from "./pages/auth/band/list/list_own_bands.page";
import BandProfilePage from "./pages/both/band/profile/band_profile.page";

const AppRoutes = ({token, user}) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<HomePage/>} path="/"/>
                <Route element={<ChangeEmailPage/>} path="/mudar-email"/>
                {
                    (token)
                        ? authRoutes(user)
                        : nonAuthRoutes()
                }
                <Route element={<SearchServicesPage/>} path="/servicos"/>
                <Route element={<SearchBandsPage/>} path="/servicos/bandas"/>
                <Route element={<BandProfilePage/>} path="/servicos/bandas/:uuid"/>
                <Route element={<h1>Página não encontrada</h1>} path="*"/>
            </Routes>
        </BrowserRouter>
    );
}

const authRoutes = (user) => (
    <>
        <Route element={<AuthenticatedPersonProfilePage/>} path="/meu-perfil"/>
        <Route element={<ChangeEmailPage/>} path="/mudar-email/:validation_uuid"/>

        {generateBandOwnerRoutes(user)}

        <Route element={<SearchAuthenticatedServices/>} path="/meus-servicos"/>
        <Route element={<SearchAuthenticatedPersonBandsPage/>} path="/meus-servicos/banda"/>
        <Route element={<CreateServicePage/>} path="/servico/criar"/>
        <Route element={<EditBandPage/>} path="/servicos/bandas/:uuid/editar"/>
        <Route element={<CreateMusicianPage/>} path="/servicos/bandas/:uuid/adicionar-musico"/>
        <Route element={<UploadMusicianProfilePage/>} path="/servicos/bandas/:bandUuid/musico/:musicianUuid/imagem"/>
        <Route element={<UploadMusicianProfilePage/>} path="/servicos/bandas/:bandUuid/musico/:musicianUuid/editar"/>
    </>
)

const generateBandOwnerRoutes = (user) => (
    (!user.roles.some(role => (role.name === 'BAND')))
        ? (<></>)
        : (
            <>
                <Route element={<ListBandsPage/>} path="/bandas"/>
                <Route element={<ListOwnBandsPage/>} path="/minhas-bandas"/>
                <Route element={<CreateBandPage/>} path="/bandas/cadastrar"/>
                <Route element={<CreateBandPage/>} path="/bandas/:band_uuid/editar"/>
            </>
        )

);

const nonAuthRoutes = () => (
    <>
        <Route element={<SelectPersonRolePage/>} path="/tipos-cadastro"/>
        <Route element={<CreateAccountPage/>} path="/cadastro/contratante"/>
        <Route element={<CreateAccountPage/>} path="/cadastro/banda"/>
        <Route element={<CreateAccountPage/>} path="/cadastro/musico"/>

        <Route element={<LoginPage/>} path="/login"/>

        <Route element={<ValidateEmailPage/>} path="/verificar/:validation_uuid"/>
        <Route element={<RequestPasswordChangePage/>} path="/esqueci-senha"/>
        <Route element={<ChangePasswordPage/>} path="/mudar-senha/:validation_uuid"/>
    </>
)

const mapStateToProps = state => {
    return {
        token: state.token,
        user: state.user
    }
}

const myMapDispatchToProps = {
    updateToken: updateToken,
    updateUser: updateUser,
};

export default connect(mapStateToProps, myMapDispatchToProps)(AppRoutes);
