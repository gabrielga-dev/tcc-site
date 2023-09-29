import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import {Button} from "primereact/button";
import {StyleConstants} from "../service/style.constants";

export const FormEndingComponent = (
    {
        onClickFirst = () => {
        }, labelFirst = 'Cancelar', showFirst = true,
        onClickSecond = () => {
        }, labelSecond = 'Limpar', showSecond = true,
        onClickThird = () => {
        }, labelThird = 'Submeter', showThird = true,
    }
) => (
    <Container>
        <Row>
            {
                showFirst
                    ? (
                        <Col>
                            <Button style={StyleConstants.WIDTH_100_PERCENT}
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