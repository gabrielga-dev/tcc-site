import React from "react";

import {Sidebar} from 'primereact/sidebar';
import {PanelMenu} from "primereact/panelmenu";
import {Button} from "primereact/button";
import {updateToken} from "../service/redux/action/token.action";
import {connect} from "react-redux";
import {useNavigate} from "react-router-dom";
import {updateUser} from "../service/redux/action/user.action";

const MenuLateralComponent = ({showMenu = false, toggleVisionMenu, updateToken, updateUser, user}) => {
    const navigate = useNavigate();
    const redirectTo = (route) => {
        navigate(route);
    };
    return (
        <Sidebar visible={showMenu} onHide={() => toggleVisionMenu(showMenu)}>

            <Button icon="pi pi-home" style={{width: '100%'}} onClick={() => redirectTo('/')}/>
            <PanelMenu
                model={
                    user
                        ? generateLoggedUser(updateToken, updateUser, redirectTo)
                        : generateNonLoggedUser(updateToken, updateUser, redirectTo)
                }
                style={{width: '100%'}}
            />

        </Sidebar>
    );
}

function generateLoggedUser(updateToken, updateUser, redirectTo) {
    return (
        [
            {
                label: 'Serviços',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Procurar',
                        icon: 'pi pi-fw pi-search',
                        command: () => redirectTo('/servicos')
                    },
                    {
                        label: 'Cadastrar',
                        icon: 'pi pi-fw pi-plus',
                        command: () => console.log("a")
                    },
                    {
                        label: 'Meus serviços',
                        icon: 'pi pi-fw pi-list',
                        command: () => console.log("a")
                    },
                ]
            },
            {
                label: 'Sair',
                icon: 'pi pi-fw pi-sign-out',
                command: () => {
                    updateUser(null)
                    updateToken(null)
                    redirectTo("/login")
                }
            },
        ]
    );
}

function generateNonLoggedUser(updateToken, updateUser, redirectTo) {
    return (
        [
            {
                label: 'Cadastre-se',
                icon: 'pi pi-fw pi-user-plus',
                command: () => redirectTo('/cadastre-se')
            },
            {
                label: 'Login',
                icon: 'pi pi-fw pi-sign-in',
                command: () => redirectTo('/login')
            },
            {
                label: 'Serviços',
                icon: 'pi pi-fw pi-briefcase',
                command: () => redirectTo('/servicos')
            },
            {
                label: 'Sobre nós',
                icon: 'pi pi-fw pi-info',
                command: () => redirectTo('/sobre-nos')
            },
        ]
    );
}

function generateMenuItemsIntern(updateToken, updateUser, redirectTo) {
    return [
        {
            label: 'Projeto',
            icon: 'pi pi-fw pi-file',
            items: [
                {
                    label: 'Cadastrar',
                    icon: 'pi pi-fw pi-plus',
                    command: () => redirectTo('/project/create')
                },
                {
                    label: 'Listar',
                    icon: 'pi pi-fw pi-list',
                    command: () => redirectTo('/project/list')
                },
                {
                    label: 'Administrar',
                    icon: 'pi pi-fw pi-chart-line',
                    command: () => redirectTo('/project/manage')
                }
            ]
        },
        {
            label: 'Usuarios',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Cadastrar',
                    icon: 'pi pi-fw pi-user-plus',
                    command: () => redirectTo('/user/create')
                },
                {
                    label: 'Listar',
                    icon: 'pi pi-fw pi-users',
                    command: () => redirectTo('/user/list')
                }
            ]
        },
        {
            label: 'Sair',
            icon: 'pi pi-fw pi-sign-out',
            command: () => {
                redirectTo('/')
                updateUser(null)
                updateToken(null)
            }
        }
    ];
}

function generateMenuItemsExtern(updateToken, updateUser, redirectTo) {
    return [
        {
            label: 'Sair',
            icon: 'pi pi-fw pi-sign-out',
            command: () => {
                redirectTo('/')
                updateUser(null)
                updateToken(null)
            }
        }
    ];
}

const myMapDispatchToProps = {
    updateToken: updateToken,
    updateUser: updateUser,
};
const mapStateToProps = state => (state);

export default connect(mapStateToProps, myMapDispatchToProps)(MenuLateralComponent);
