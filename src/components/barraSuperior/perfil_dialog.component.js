import React from "react";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {Col, Container, Row} from "react-bootstrap";
import {updateToken} from "../../service/redux/action/token.action";
import {connect} from "react-redux";
import {useNavigate} from "react-router-dom";
import {StyleConstants} from "../../service/style.constants";
import {updateUser} from "../../service/redux/action/user.action";
import {AuthConstants} from "../../util/auth.constants";

const PerfilDialogComponent = ({authenticatedUser, showDialog, hideDialog, updateToken, updateUser}) => {
    const navigateTo = useNavigate();
    return (
        <Dialog
            header="Opções"
            visible={showDialog}
            onHide={hideDialog}
            draggable={false}
            style={{width: '50%', marginLeft: '25%', marginRight: '25%'}}
        >
            <Container>
                <Row>
                    <Col>
                        <h5>{`${getSalutation()}, ${authenticatedUser.firstName}!`}</h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>Você, atualmente, está com as seguintes permissão:</p>
                        <ul>
                            {getPermissions(authenticatedUser)}
                        </ul>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button
                            label="Minha conta"
                            icon="pi pi-user"
                            style={StyleConstants.WIDTH_100_PERCENT}
                            onClick={() => navigateTo('/meu-perfil')}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button
                            label="Sair"
                            icon="pi pi-power-off"
                            className="p-button-danger"
                            style={StyleConstants.WIDTH_100_PERCENT}
                            onClick={
                                () => {
                                    updateUser(null)
                                    updateToken(null)
                                    localStorage.removeItem(AuthConstants.TOKEN);
                                    localStorage.removeItem(AuthConstants.USER);
                                    navigateTo('/login')
                                }
                            }/>
                    </Col>
                </Row>
            </Container>
        </Dialog>
    );
}

const getSalutation = () => {
    const now = new Date();
    const hour = now.getHours();

    let salutation;

    if (hour >= 5 && hour < 12) {
        salutation = 'Bom dia';
    } else if (hour >= 12 && hour < 18) {
        salutation = 'Boa tarde';
    } else {
        salutation = 'Boa noite';
    }

    return salutation;
}

const getPermissions = (person) => {
    if (person.roles.some(role => (role.name === 'BAND'))) {
        return (<li>Responsável por bandas</li>);
    } else if (person.roles.some(role => (role.name === 'MUSICIAN'))) {
        return (<li>Músico autônomo</li>);
    } else if (person.roles.some(role => (role.name === 'CONTRACTOR'))) {
        return (<li>Contratante de serviços</li>);
    }
}

const myMapDispatchToProps = {
    updateToken: updateToken,
    updateUser: updateUser,
};
const mapStateToProps = state => (state);

export default connect(mapStateToProps, myMapDispatchToProps)(PerfilDialogComponent);
