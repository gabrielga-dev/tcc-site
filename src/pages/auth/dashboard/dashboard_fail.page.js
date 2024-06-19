import {Col, Container, Row} from "react-bootstrap";
import {Button} from "primereact/button";
import {StyleConstants} from "../../../service/style.constants";
import React from "react";

export const DashboardFailPage = ({reload}) => (
    <Container>
        <Row>
            <Col sm={0} md={2}/>
            <Col sm={12} md={8}>
                <h4 align='center' style={{marginBottom: 20, marginTop: 35}}>
                    Ops! Algo deu errado gerando o seu dashboard! 😢
                </h4>
                <Button
                    style={StyleConstants.WIDTH_100_PERCENT}
                    icon='pi pi-refresh'
                    label='Recarregar'
                    onClick={() => reload()}
                />
            </Col>
            <Col sm={0} md={2}/>
        </Row>
    </Container>
);
