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
                model={GET_MENU_OPTIONS(updateToken, updateUser, redirectTo, user)}
                style={{width: '100%'}}
            />

        </Sidebar>
    );
}

const GET_MENU_OPTIONS = (updateToken, updateUser, redirectTo, person) => {
    if (!person){
        return generateNonLoggedUser(updateToken, updateUser, redirectTo)
    } else if(person.roles.some(role => (role.name === 'BAND'))){
        return generateBandOwnerOptions(updateToken, updateUser, redirectTo);
    } else if (person.roles.some(role => (role.name === 'MUSICIAN'))) {
        return generateMusicianOptions(updateToken, updateUser, redirectTo);
    } else if (person.roles.some(role => (role.name === 'CONTRACTOR'))) {
        return generateContractorOptions(updateToken, updateUser, redirectTo);
    }
};

function generateNonLoggedUser(updateToken, updateUser, redirectTo) {
    return (
        [
            {
                label: 'Cadastre-se',
                icon: 'pi pi-fw pi-user-plus',
                command: () => redirectTo('/tipos-cadastro')
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

const generateBandOwnerOptions = (updateToken, updateUser, redirectTo) => (
    [
        {
            label: 'Bandas',
            icon: 'pi pi-fw pi-volume-up',
            items: [
                {
                    label: 'Procurar',
                    icon: 'pi pi-fw pi-search',
                    command: () => redirectTo('/bandas')
                },
                {
                    label: 'Cadastrar',
                    icon: 'pi pi-fw pi-plus',
                    command: () => redirectTo('/bandas/criar')
                },
                {
                    label: 'Minhas bandas',
                    icon: 'pi pi-fw pi-list',
                    command: () => redirectTo('/minhas-bandas')
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
const generateMusicianOptions = (updateToken, updateUser, redirectTo) => (
    [
        {
            label: 'Bandas',
            icon: 'pi pi-fw pi-volume-up',
            items: [
                {
                    label: 'Procurar',
                    icon: 'pi pi-fw pi-search',
                    command: () => redirectTo('/bandas')
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
const generateContractorOptions = (updateToken, updateUser, redirectTo) => (
    [
        {
            label: 'Bandas',
            icon: 'pi pi-fw pi-volume-up',
            items: [
                {
                    label: 'Procurar',
                    icon: 'pi pi-fw pi-search',
                    command: () => redirectTo('/bandas')
                },
            ]
        },
        {
            label: 'Eventos',
            icon: 'pi pi-fw pi-calendar',
            items: [
                {
                    label: 'Cadastrar',
                    icon: 'pi pi-fw pi-plus',
                    command: () => redirectTo('/eventos')
                },
                {
                    label: 'Meus eventos',
                    icon: 'pi pi-fw pi-list',
                    command: () => redirectTo('/eventos')
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

const myMapDispatchToProps = {
    updateToken: updateToken,
    updateUser: updateUser,
};
const mapStateToProps = state => (state);

export default connect(mapStateToProps, myMapDispatchToProps)(MenuLateralComponent);
