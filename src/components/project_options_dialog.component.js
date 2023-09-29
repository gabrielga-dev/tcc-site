import React from 'react';

import {Dialog} from "primereact/dialog";
import {Col, Container, Row} from "react-bootstrap";
import {Button} from "primereact/button";
import {StyleConstants} from "../service/style.constants";
import {useNavigate} from "react-router-dom";

export const ProjectOptionsDialogComponent = ({token, showDialog, hideDialog, navigateTo, selectedProject}) => {
    const navigate = useNavigate();

    return (
        <Dialog visible={showDialog} onHide={hideDialog} draggable={false}>
            <Container>
                <Row>
                    <Col>
                        <h3>{selectedProject ? selectedProject.name : ''}:</h3>
                        <h4>Selecione uma das opções:</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Row>
                            <Col>
                                <Button
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    icon="pi pi-user"
                                    label="Gerenciar participantes"
                                    onClick={() => {
                                        navigate(`/project/manage/${selectedProject.id}`);
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    className="p-button-warning"
                                    icon="pi pi-user-edit"
                                    label="Editar"
                                    onClick={() => {
                                        navigate(`/project/edit/${selectedProject.id}`);
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
                                    onClick={() => navigate(`/project/delete/${selectedProject.id}`)}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Dialog>
    );
}