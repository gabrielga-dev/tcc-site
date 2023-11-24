import React from 'react';

import {Menubar} from 'primereact/menubar';
import {Avatar} from 'primereact/avatar';
import {Button} from "primereact/button";
import './remove_navbar_button.css'
import PerfilDialogComponent from "./perfil_dialog.component";
import {Col, Container, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

export const BarraSuperiorComponent = ({openLateralMenu, authenticatedUser}) => {
    const navigate = useNavigate();
    const redirectTo = (route) => {
        navigate(route);
    };
    return (
        <_BarraSuperiorComponent
            openLateralMenu={openLateralMenu}
            authenticatedUser={authenticatedUser}
            redirectTo={redirectTo}
        />
    );
}

class _BarraSuperiorComponent extends React.Component {
    constructor(props) {
        super(props);

        let {
            openLateralMenu,
            authenticatedUser,
            redirectTo
        } = props;

        this.state = {
            openLateralMenu,
            authenticatedUser,
            redirectTo,
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
                        authenticatedUser
                            ? (this.renderAvatar(authenticatedUser))
                            : (this.renderNonAuthOptions())
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
                        ) :
                        null
                }
            </>
        );
    }

    renderNonAuthOptions() {
        let {redirectTo} = this.state;
        return (
            <Container>
                <Row>
                    <Col>
                        <Button
                            label="Login"
                            className="p-button-sm"
                            onClick={() => redirectTo('/login')}
                        />
                        <Button
                            label="Cadastre-se"
                            className="p-button-text p-button-sm"
                            onClick={() => redirectTo('/tipos-cadastro')}
                        />
                    </Col>
                </Row>
            </Container>
        )
    }

    renderAvatar(authenticatedUser) {
        return (
            <Avatar
                label={authenticatedUser ? authenticatedUser.firstName[0] : ''}
                size="normal"
                onClick={() => this.setState({showDialog: true})}
            />
        )
    }
}

const innerStyle =
    {
        margin: 0
    }
