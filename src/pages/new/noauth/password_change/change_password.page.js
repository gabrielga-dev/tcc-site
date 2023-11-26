import React, {useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import HomeTemplate from "../../template/home_template";
import {Card} from "primereact/card";
import {Col, Container, Row} from "react-bootstrap";
import {EmailValidationService} from "../../../../service/new/ms_auth/email_validation.service";
import {ActivityIndicatorComponent} from "../../../../components/activity_indicator.component";
import {ToastUtils} from "../../../../util/toast.utils";
import {UserChangePasswordRequest} from "../../../../domain/new/person/request/user_change_password_request";
import {Password} from "primereact/password";
import {StyleConstants} from "../../../../service/style.constants";
import {Button} from "primereact/button";
import {UserService} from "../../../../service/new/ms_auth/user.service";

export const ChangePasswordPage = () => {
    const toast = useRef(null);
    const navigateTo = useNavigate();
    const {validation_uuid} = useParams();

    const showToast = (body) => {
        toast.current.show(body);
    };

    return (
        <>
            <Toast ref={toast}/>
            <_ChangePasswordPage
                navigateTo={navigateTo}
                showToast={showToast}
                validationUuid={validation_uuid}
            />
        </>
    )
}
export default class _ChangePasswordPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showToast: props.showToast,
            navigateTo: props.navigateTo,
            isLoading: false,
            validationUuid: props.validationUuid,
            request: new UserChangePasswordRequest(),
            passwordChanged: false,
        }
    }

    componentDidMount() {
        let {validationUuid, showToast, navigateTo} = this.state;

        this.setState({isLoading: true});

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
        let {isLoading} = this.state;
        return (
            <HomeTemplate steps={['Redefinir Senha']}>
                {isLoading ? this.renderLoading() : this.renderContent()}
            </HomeTemplate>
        );
    }

    renderLoading() {
        return (<ActivityIndicatorComponent/>);
    }

    renderContent() {
        let {request, passwordChanged} = this.state;
        if (passwordChanged) {
            return this.renderSuccess()
        }
        return (
            <Card>
                <Container className="p-fluid">
                    <Row>
                        <Col style={{marginBottom: 25}}>
                            <h3 align="center">Digite a sua nova senha nos campos abaixo!</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} sm={12} style={{marginBottom: 25}}>
                            <h6>Digite sua nova senha</h6>
                            <Password
                                value={request.password}
                                onChange={(e) => this.setPassword(e.target.value)}
                                toggleMask
                            />
                        </Col>
                        <Col md={6} sm={12} style={{marginBottom: 25}}>
                            <h6>Repita sua nova senha</h6>
                            <Password
                                value={request.passwordRepeated}
                                onChange={(e) => this.setPasswordRepeated(e.target.value)}
                                toggleMask={true}
                                feedback={false}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button
                                label="Enviar"
                                style={StyleConstants.WIDTH_100_PERCENT}
                                onClick={() => this.submitForm()}
                            />
                        </Col>
                    </Row>
                </Container>
            </Card>
        );
    }

    renderSuccess() {
        return (
            <Card>
                <Container>
                    <Row>
                        <Col>
                            <h2 style={{marginBottom: 30}} align="center">
                                Sua senha foi alterada com sucesso!!! 🤩
                            </h2>
                            <p style={{marginBottom: 30}} align="center">
                                Estamos te redirecionando para a tela de login...
                            </p>
                            <ActivityIndicatorComponent/>
                        </Col>
                    </Row>
                </Container>
            </Card>
        );
    }

    setPassword(newValue) {
        let {request} = this.state;
        let newRequest = new UserChangePasswordRequest(newValue, request.passwordRepeated);
        this.setState({request: newRequest})
    }

    setPasswordRepeated(newValue) {
        let {request} = this.state;
        let newRequest = new UserChangePasswordRequest(request.password, newValue);
        this.setState({request: newRequest})
    }

    submitForm() {
        let {validationUuid, request, showToast, navigateTo} = this.state;

        if (!request.isValid()) {
            showToast(
                ToastUtils.BUILD_TOAST_FORM_ERROR('Campos Inválidos!', 'Insira os dados corretamente')
            );
            return;
        }

        this.setState({isLoading: true});
        UserService.CHANGE_PASSWORD(validationUuid, request)
            .then(
                response => {
                    showToast(ToastUtils.BUILD_TOAST_SUCCESS_BODY('Sua senha foi alterada com sucesso!'))
                    this.setState({passwordChanged: true})
                    setTimeout(() => navigateTo('/login'), 2500);
                }
            ).catch(error => showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isLoading: false}))
    }
}
