import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import {Button} from "primereact/button";
import {StyleConstants} from "../service/style.constants";

export const FormEndingComponent = (
    {
        onClickFirst = () => {
        }, labelFirst = 'Cancelar', showFirst = true, disableFirst = false,
        onClickSecond = () => {
        }, labelSecond = 'Limpar', showSecond = true, disableSecond = false,
        onClickThird = () => {
        }, labelThird = 'Submeter', showThird = true, disableThird = false,
    }
) => (
    <Container>
        <Row>
            {
                showFirst
                    ? (
                        <Col>
                            <Button style={StyleConstants.WIDTH_100_PERCENT}
                                    disabled={disableFirst}
                                    className="p-button-danger"
                                    label={labelFirst}
                                    onClick={onClickFirst} icon="pi pi-times"
                            />
                        </Col>
                    )
                    : null
            }
            {
                showSecond
                    ? (
                        <Col>
                            <Button style={StyleConstants.WIDTH_100_PERCENT}
                                    disabled={disableSecond}
                                    className="p-button-warning"
                                    label={labelSecond}
                                    onClick={onClickSecond} icon="pi pi-trash"
                            />
                        </Col>
                    )
                    : null
            }
            {
                showThird
                    ? (
                        <Col>
                            <Button style={StyleConstants.WIDTH_100_PERCENT}
                                    disabled={disableThird}
                                    className="p-button-success"
                                    label={labelThird}
                                    onClick={onClickThird} icon="pi pi-check"
                            />
                        </Col>
                    )
                    : null
            }
        </Row>
    </Container>
)
