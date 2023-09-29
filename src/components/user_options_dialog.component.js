import React from 'react';

import {Dialog} from "primereact/dialog";
import {Col, Container, Row} from "react-bootstrap";
import {Button} from "primereact/button";
import {StyleConstants} from "../service/style.constants";
import {useNavigate} from "react-router-dom";

export const UserOptionsDialogComponent = ({token, showDialog, hideDialog, navigateTo, selectedUser}) => {
    const navigate = useNavigate();

    return (
        <Dialog visible={showDialog} onHide={hideDialog} draggable={false}>
            <Container>
                <Row>
                    <Col>
                        <h3>{selectedUser ? selectedUser.firstName : ''}:</h3>
                        <h4>Selecione uma das opções:</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Row>
                            <Col>
                                <Button
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    className="p-button-warning"
                                    icon="pi pi-user-edit"
                                    label="Editar"
                                    onClick={() => {
                                        navigate(`/user/edit/${selectedUser.id}`);
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    className="p-button-danger"
                                    icon="pi pi-trash"
                                    label="Excluir"
                                    onClick={() => navigate(`/user/delete/${selectedUser.id}`)}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Dialog>
    );
}