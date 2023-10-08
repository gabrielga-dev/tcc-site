import React, {useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {updateToken} from "../../../../service/redux/action/token.action";
import {updateUser} from "../../../../service/redux/action/user.action";
import {connect} from "react-redux";
import HomeTemplate from "../../template/home_template";
import {Card} from "primereact/card";
import {MarginStyle} from "../../../../style/margin.style";
import {Button} from "primereact/button";
import {Col, Container, Row} from "react-bootstrap";
import {StyleConstants} from "../../../../service/style.constants";

const CreateServicePage = ({token, user}) => {
    let {uuid} = useParams();

    const toast = useRef(null);
    const showToast = (body) => {
        toast.current.show(body);
    };

    const navigate = useNavigate();
    const redirectTo = (route) => {
        navigate(route);
    };
    return (
        <_CreateServicePage
            token={token}
            navigateTo={redirectTo}
            authenticatedUser={user}
            bandUuid={uuid}
            showToast={showToast}
        />
    );
}

class _CreateServicePage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,
        }
    }

    render() {
        let {navigateTo} = this.state
        return (
            <HomeTemplate steps={['Serviços', 'Cadastrar']}>
                <Container>
                    <Row>
                        <Col lg={4} md={6} sm={12}>
                            <Card style={MarginStyle.makeMargin(0, 10, 0,10)}>
                                <Container>
                                    <Row>
                                        <Col>
                                            <h3 align="center">Criar Banda</h3>
                                        </Col>
                                    </Row><Row>
                                        <Col>
                                            <p className="m-0" style={{textAlign: 'justify', textJustify: 'inter-word'}}>
                                                Crie agora o perfil de sua banda para que seus ouvintes consigam lhe
                                                ver e contratar seus serviços musicais com maior facilidade!
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Button
                                                icon="pi pi-save"
                                                style={StyleConstants.WIDTH_100_PERCENT}
                                                label="Criar"
                                                onClick={() => navigateTo("/servico/criar/banda")}
                                            />
                                        </Col>
                                    </Row>
                                </Container>
                            </Card>
                        </Col>
                        <Col lg={4} md={6} sm={12}>
                            <Card style={MarginStyle.makeMargin(0, 10, 0,10)}>
                                <Container>
                                    <Row>
                                        <Col>
                                            <h3 align="center">Criar Buffet</h3>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <p className="m-0" style={{textAlign: 'justify', textJustify: 'inter-word'}}>
                                                Crie agora o perfil de seu buffet para que seus clientes consigam lhe
                                                ver e contratar seus pratos com maior facilidade!
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Button
                                                icon="pi pi-save"
                                                style={StyleConstants.WIDTH_100_PERCENT}
                                                label="Criar"
                                            />
                                        </Col>
                                    </Row>
                                </Container>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </HomeTemplate>
        );
    }
}

const myMapDispatchToProps = {
    updateToken: updateToken,
    updateUser: updateUser,
};
const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps, myMapDispatchToProps)(CreateServicePage);
