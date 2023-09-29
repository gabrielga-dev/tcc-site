import React from "react";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {Col, Container, Row} from "react-bootstrap";
import {updateToken} from "../../service/redux/action/token.action";
import {connect} from "react-redux";
import {useNavigate} from "react-router-dom";
import {StyleConstants} from "../../service/style.constants";
import {updateUser} from "../../service/redux/action/user.action";

const PerfilDialogComponent = ({authenticatedUser, showDialog, hideDialog, updateToken, updateUser}) => {
    const navigate = useNavigate();
    return (
        <Dialog visible={showDialog} onHide={hideDialog} draggable={false}>
            <Container>
                <Row>
                    <Col>
                        <h4>{`${authenticatedUser.firstName} ${authenticatedUser.lastName}`}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button
                            label="Perfil"
                            icon="pi pi-user"
                            style={StyleConstants.WIDTH_100_PERCENT}
                            onClick={() => navigate('/profile')}
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
                                    updateToken(null);
                                    navigate('/');
                                }
                            }/>
                    </Col>
                </Row>
            </Container>
        </Dialog>
    );
}


const myMapDispatchToProps = {
    updateToken: updateToken,
    updateUser: updateUser,
};
const mapStateToProps = state => (state);

export default connect(mapStateToProps, myMapDispatchToProps)(PerfilDialogComponent);
