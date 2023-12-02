import React from "react";
import {connect} from "react-redux";
import {Col, Container, Row} from "react-bootstrap";
import {AuthConstants} from "../../../../../util/auth.constants";

const PersonRoleInformationPage = ({user}) => (
    <Container>
        <Row>
            <Col>
                <p>A sua permissão atual é: <b>{AuthConstants.GET_ROLE_NAME(user)}</b></p>
                <p>Ela permite que você:</p>
                {GET_PERMISSIONS(user)}
            </Col>
        </Row>
    </Container>
);

const GET_PERMISSIONS = (person) => {
    if (person.roles.some(role => (role.name === 'BAND'))) {
        return GET_BAND_PERMISSIONS;
    } else if (person.roles.some(role => (role.name === 'MUSICIAN'))) {
        return GET_MUSICIAN_PERMISSIONS;
    } else if (person.roles.some(role => (role.name === 'CONTRACTOR'))) {
        return GET_CONTRACTOR_PERMISSIONS;
    }
}

const GET_BAND_PERMISSIONS = (
    <ul>
        <li>Criar quantas bandas for necessário;</li>
        <li>Contribuir ao acervo de músicas na plataforma;</li>
        <li>Adicionar seus músicos;</li>
    </ul>
);

const GET_MUSICIAN_PERMISSIONS = (
    <ul>
        <li>Se mostrar disponível para eventos toda plataforma</li>
    </ul>
);

const GET_CONTRACTOR_PERMISSIONS = (
    <ul>
        <li>Criar seus eventos;</li>
        <li>Contratar qualque serviço disponibilizado na plataforma;</li>
        <li>Solicitar orçamentos para qualquer serviço de forma gratuita;</li>
    </ul>
);

const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(PersonRoleInformationPage);
