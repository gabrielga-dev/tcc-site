import {Col, Container, Row} from "react-bootstrap";
import React from "react";


export const FormAreaComponent = ({children}) => (
    <Container>
        <Row>
            <Col>
                {children}
            </Col>
        </Row>
        <Row>
            <Col>
                <span style={{color: 'rgba(145,145,145,0.99)'}}>
                    Campos obrigatórios (*)
                </span>
            </Col>
        </Row>
    </Container>
);
