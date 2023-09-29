import React from 'react';

import {Menubar} from 'primereact/menubar';
import {Avatar} from 'primereact/avatar';
import {Button} from "primereact/button";
import './remove_navbar_button.css'
import PerfilDialogComponent from "./perfil_dialog.component";

export default class BarraSuperiorComponent extends React.Component {
    constructor(props) {
        super(props);

        let {
            openLateralMenu,
            authenticatedUser
        } = props;

        this.state = {
            openLateralMenu,
            authenticatedUser,
            showDialog: false
        }
    }

    render() {
        let {authenticatedUser, openLateralMenu, showDialog} = this.state;
        return (
            <>
                <Menubar
                    start={
                        <Button
                            onClick={openLateralMenu}
                            label="MyEvents"
                            className="p-button-secondary p-button-text"
                            style={innerStyle}
                        />
                    }
                    end={
                        <Avatar
                            label={authenticatedUser ? authenticatedUser.firstName[0] : ''}
                            size="normal"
                            onClick={() => this.setState({showDialog: true})}
                        />
                    }
                />
                {
                    authenticatedUser ?
                        (
                            <PerfilDialogComponent
                                authenticatedUser={authenticatedUser}
                                showDialog={showDialog}
                                hideDialog={() => this.setState({showDialog: false})}
                            />
                        ):
                        null
                }
            </>
        );
    }
}

const innerStyle =
    {
        margin: 0
    }
