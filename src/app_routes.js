import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {CreateAccountPage} from "./pages/new/noauth/create_account.page";
import {connect} from "react-redux";
import LoginPage from "./pages/new/noauth/login_page";
import CreateProjectPage from "./pages/auth/project/create_project.page";
import HomePage from "./pages/new/both/home_page";
import ListProjectPage from "./pages/auth/project/list_project.page";
import EditProjectPage from "./pages/auth/project/edit_project.page";
import SelectProjectToManagePage from "./pages/auth/project/select_project_to_manage.page";
import ManageProjectPage from "./pages/auth/project/manage_project.page";
import DeleteProjectPage from "./pages/auth/project/delete_project.page";
import CreateUserPage from "./pages/auth/user/create_user.page";
import ListUserPage from "./pages/auth/user/list_user.page";
import DeleteUserPage from "./pages/auth/user/delete_user.page";
import EditUserPage from "./pages/auth/user/edit_user.page";
import ProfilePage from "./pages/auth/user/profile.page";
import {SearchServicesPage} from "./pages/new/both/service/search_service_page";
import {SearchBandsPage} from "./pages/new/both/service/band/search_band_page";

const AppRoutes = ({token, user}) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<HomePage/>} path="/"/>
                <Route element={<SearchServicesPage/>} path="/servicos"/>
                <Route element={<SearchBandsPage/>} path="/servicos/bandas"/>
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
        <Route element={<HomePage/>} path="/" exact={true}/>
    </>
)

const nonAuthRoutes = () => (
    <>
        <Route element={<CreateAccountPage/>} path="/cadastre-se" exact={true}/>
        <Route element={<LoginPage/>} path="/login"/>
    </>
)

const projectRoutes = [
    <Route element={<CreateProjectPage/>} path="/project/create"/>,
    <Route element={<EditProjectPage/>} path="/project/edit/:id"/>,
    <Route element={<SelectProjectToManagePage/>} path="/project/manage"/>,
    <Route element={<ManageProjectPage/>} path="/project/manage/:id"/>,
    <Route element={<DeleteProjectPage/>} path="/project/delete/:id"/>,
    <Route element={<ListProjectPage/>} path="/project/list"/>,
];

const userRoutes = [
    <Route element={<CreateUserPage/>} path="/user/create"/>,
    <Route element={<ListUserPage/>} path="/user/list"/>,
    <Route element={<EditUserPage/>} path="/user/edit/:id"/>,
    <Route element={<DeleteUserPage/>} path="/user/delete/:id"/>,
    <Route element={<ProfilePage/>} path="/profile"/>,
];

const mapStateToProps = state => {
    return {
        token: state.token,
        user: state.user
    }
}

export default connect(mapStateToProps)(AppRoutes);
