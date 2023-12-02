import React, {useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import {updateToken} from "../../../service/redux/action/token.action";
import {updateUser} from "../../../service/redux/action/user.action";
import {connect} from "react-redux";
import HomeTemplate from "../template/home_template";
import {Col, Container, Row} from "react-bootstrap";
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {ChangePersonRequest} from "../../../domain/new/person/request/change_person_request";
import {StyleConstants} from "../../../service/style.constants";
import {Button} from "primereact/button";
import {ActivityIndicatorComponent} from "../../../components/activity_indicator.component";
import {EmailValidationService} from "../../../service/new/ms_auth/email_validation.service";
import {ToastUtils} from "../../../util/toast.utils";
import {UserService} from "../../../service/new/ms_auth/user.service";
import {AuthConstants} from "../../../util/auth.constants";

const ChangeEmailPage = ({token, user, updateToken, updateUser}) => {
    const toast = useRef(null);

    const showToast = (body) => {
        toast.current.show(body);
    };
    const {validation_uuid} = useParams();

    const navigate = useNavigate();
    const navigateTo = (route) => {
        navigate(route);
    };
    return (
        <>
            <Toast ref={toast}/>
            <_ChangeEmailPage
                updateToken={updateToken}
                updateUser={updateUser}
                navigateTo={navigateTo}
                token={token}
                authenticatedUser={user}
                showToast={showToast}
                validationUuid={validation_uuid}
            />
        </>
    );
}

class _ChangeEmailPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            updateToken: props.updateToken,
            updateUser: props.updateUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            isLoading: false,

            validationUuid: props.validationUuid,
            request: new ChangePersonRequest(),
        }
    }

    componentDidMount() {
        this.setState({isLoading: true});
        let {validationUuid, showToast, navigateTo} = this.state;
        EmailValidationService.CHECK_IF_EMAIL_VALIDATION_EXISTS(validationUuid)
            .then(response => this.setState({isLoading: false}))
            .catch(
                error => {
                    showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                    setTimeout(() => navigateTo('/login'), 2500)
                }
            );
    }

    render() {
        let {request, isLoading} = this.state;

        if (isLoading) {
            return (<ActivityIndicatorComponent/>);
        }

        return (
            <HomeTemplate steps={['Redefinir Email']}>
                <Card>
                    <Container>
                        <Row style={{marginBottom: 25}}>
                            <Col>
                                <h3 align="center">Digite o novo email</h3>
                            </Col>
                        </Row>
                        <Row style={{marginBottom: 25}}>
                            <Col md={2} sm={0}/>
                            <Col md={8} sm={12}>
                                <h6>Digite sua nova senha</h6>
                                <InputText
                                    value={request.newEmail}
                                    placeholder="Digite o seu novo email aqui"
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    onChange={(e) => this.setNewEmail(e.target.value)}
                                />
                            </Col>
                            <Col md={2} sm={0}/>
                        </Row>
                        <Row>
                            <Col md={1} sm={0}/>
                            <Col md={10} sm={12}>
                                <Button
                                    label="Enviar"
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    icon="pi pi-send"
                                    onClick={() => this.submitRequest()}
                                />
                            </Col>
                            <Col md={1} sm={0}/>
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    setNewEmail(newEmail) {
        let {request} = this.state;

        request.newEmail = newEmail;

        this.setState({request: request})
    }

    submitRequest() {
        this.setState({isLoading: true});

        let {request, showToast} = this.state;

        if (!request.isValid()) {
            showToast(
                ToastUtils.BUILD_TOAST_FORM_ERROR(
                    'Informação inválida', 'Insira as informações corretamente'
                )
            );
            this.setState({isLoading: false});
            return
        }

        let {validationUuid, token, navigateTo, updateToken, updateUser} = this.state;
        UserService.CHANGE_EMAIL(validationUuid, request, token)
            .then(
                response => {
                    showToast(ToastUtils.BUILD_TOAST_SUCCESS_BODY('Email alterado com sucesso!'));
                    setTimeout(
                        () => {
                            updateUser(null);
                            updateToken(null);
                            navigateTo('/login');
                        }, 2500
                    );
                }
            ).catch(error => showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isLoading: false}));
    }
}

const myMapDispatchToProps = {
    updateToken: updateToken,
    updateUser: updateUser,
};
const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps, myMapDispatchToProps)(ChangeEmailPage);
