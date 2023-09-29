import {useNavigate} from "react-router-dom";
import React, {useRef} from "react";
import {updateToken} from "../../../service/redux/action/token.action";
import {connect} from "react-redux";
import HomeTemplate from "../home.template";
import {Col, Container, Row} from "react-bootstrap";
import {Card} from "primereact/card";
import {Toast} from "primereact/toast";
import {UserDto} from "../../../domain/dto/user.dto";
import {ActivityIndicatorComponent} from "../../../components/activity_indicator.component";
import {UserService} from "../../../service/user.service";
import {InputText} from "primereact/inputtext";
import {StyleConstants} from "../../../service/style.constants";
import {Button} from "primereact/button";

const ProfilePage = ({token}) => {
    const navigate = useNavigate();
    const toast = useRef(null);
    const redirectTo = (route) => {
        navigate(route);
    };
    const showToast = (body) => {
        toast.current.show(body);
    };
    return (
        <>
            <Toast ref={toast}/>
            <_ProfilePage token={token} updateToken={updateToken} navigateTo={redirectTo} showToast={showToast}/>
        </>
    );
}

class _ProfilePage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,

            user: new UserDto(),

            token: props.token,

            updateToken: props.updateToken,
            navigateTo: props.navigateTo,
            showToast: props.showToast,
        }
    }

    componentDidMount() {
        let {token} = this.state;
        this.setState({loading: true})
        UserService.GET_AUTHENTICATED_USER(token)
            .then(res => {
                this.setState({user: res.data})
            }).catch(
            error => {
                this.state.updateToken(null)
            }
        ).finally(() => this.setState({loading: false}))

    }

    render() {
        let {loading, user, navigateTo} = this.state;

        if (loading) {
            return (<ActivityIndicatorComponent/>)
        }
        return (
            <HomeTemplate steps={['Perfil']}>
                <Container>
                    <Row>
                        <Card header={profileHeader}>
                            <Container>
                                <Row>
                                    <Col>
                                        <h6>Nome</h6>
                                        <InputText
                                            id="firstName"
                                            value={user.firstName}
                                            disabled={true}
                                            style={StyleConstants.WIDTH_100_PERCENT}
                                        />
                                    </Col>
                                    <Col>
                                        <h6>Sobrenome</h6>
                                        <InputText
                                            id="lastName"
                                            value={user.lastName}
                                            disabled={true}
                                            style={StyleConstants.WIDTH_100_PERCENT}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <h6>Email</h6>
                                        <InputText
                                            id="email"
                                            value={user.email}
                                            disabled={true}
                                            style={StyleConstants.WIDTH_100_PERCENT}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button style={StyleConstants.WIDTH_100_PERCENT}
                                                className="p-button-warning"
                                                label="Editar"
                                                icon="pi pi-user-edit"
                                                onClick={() => navigateTo(`/user/edit/${user.id}`)}
                                        />
                                    </Col>
                                </Row>
                            </Container>
                        </Card>
                    </Row>
                </Container>
            </HomeTemplate>
        );
    }
}

const profileHeader = (
    <>
        <br/>
        <h3 align="center">Perfil</h3>
    </>
);

const myMapDispatchToProps = {
    updateToken: updateToken,
};
const mapStateToProps = state => (state);

export default connect(mapStateToProps, myMapDispatchToProps)(ProfilePage);