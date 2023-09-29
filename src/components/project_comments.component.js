import React from 'react';

import {Dialog} from "primereact/dialog";
import {Col, Container, Row} from "react-bootstrap";
import {FormEndingComponent} from "./form_ending.component";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";


export const ProjectCommentsComponent = (
    {token, showDialog, hideDialog, navigateTo, selectedProject}
) => {

    return (
        <Dialog visible={showDialog} onHide={hideDialog} draggable={false}>
            <Container>
                <Row>
                    <Col>
                        <h4>Comentários do projeto {selectedProject ? selectedProject.name : ''}:</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <DataTable value={selectedProject.comments} responsiveLayout="scroll"
                                   currentPageReportTemplate="" scrollable={true}
                                   rows={selectedProject.comments ? selectedProject.comments.length : 0}
                                   emptyMessage="Nenhum comentário encontrado">
                            <Column field="title" header="Título" style={{width: '25%'}}/>
                            <Column field="content" header="Conteúdo" style={{width: '25%'}}/>
                            <Column field="author.firstName" header="Autor" style={{width: '25%'}}/>
                        </DataTable>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormEndingComponent
                            onClickFirst={hideDialog}
                            labelFirst="Fechar"
                            showSecond={false}
                            showThird={false}
                        />
                    </Col>
                </Row>
            </Container>
        </Dialog>
    );
}