import React from 'react';

import {Dialog} from "primereact/dialog";
import {Col, Container, Row} from "react-bootstrap";
import {StyleConstants} from "../service/style.constants";
import {InputTextarea} from "primereact/inputtextarea";
import {FormEndingComponent} from "./form_ending.component";
import {InputText} from "primereact/inputtext";
import {CommentForm} from "../domain/form/comment.form";


export const CommentOnProjectComponent = (
    {token, showDialog, hideDialog, navigateTo, selectedProject, comment, onChangeComment, onSubmmit}
) => {
    return (
        <Dialog
            visible={showDialog}
            onHide={() => {
                comment = new CommentForm();
                onChangeComment(comment);
                hideDialog();
            }}
            draggable={false}
        >
            <Container>
                <Row>
                    <Col>
                        <h3>{selectedProject ? selectedProject.name : ''}</h3>
                        <h4>Digite o comentário:</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h6>Título</h6>
                        <InputText
                            style={StyleConstants.WIDTH_100_PERCENT}
                            value={comment.title}
                            maxLength={100}
                            onChange={e => {
                                comment.title = e.target.value;
                                onChangeComment(comment)
                            }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h6>Conteúdo</h6>
                        <InputTextarea
                            style={StyleConstants.WIDTH_100_PERCENT}
                            value={comment.content}
                            maxLength={5000}
                            onChange={e => {
                                comment.content = e.target.value;
                                onChangeComment(comment)
                            }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormEndingComponent
                            onClickFirst={() => {
                                comment = new CommentForm();
                                onChangeComment(comment);
                                hideDialog();
                            }}
                            onClickThird={onSubmmit}
                            showSecond={false}
                        />
                    </Col>
                </Row>
            </Container>
        </Dialog>
    );
}