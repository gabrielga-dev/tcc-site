import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {Toast} from "primereact/toast";
import HomeTemplate from "../../template/home_template";
import {Card} from "primereact/card";
import {Col, Row} from "react-bootstrap";
import {InputText} from "primereact/inputtext";
import {EmailValidationRequest} from "../../../../domain/new/email_validation/request/email_validation.request";
import {StyleConstants} from "../../../../service/style.constants";
import {Button} from "primereact/button";
import {ToastUtils} from "../../../../util/toast.utils";
import {EmailValidationService} from "../../../../service/new/ms_auth/email_validation.service";
import {ActivityIndicatorComponent} from "../../../../components/activity_indicator.component";

export const RequestPasswordChangePage = () => {
    const toast = useRef(null);
    const navigateTo = useNavigate();

    const showToast = (body) => {
        toast.current.show(body);
    };

    return (
        <>
            <Toast ref={toast}/>
            <_RequestPasswordChangePage
                navigateTo={navigateTo}
                showToast={showToast}
            />
        </>
    )
}
export default class _RequestPasswordChangePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showToast: props.showToast,
            navigateTo: props.navigateTo,
            isLoading: false,
            request: new EmailValidationRequest()
        }
    }

    render() {
        let {isLoading} = this.state;
        return (
            <HomeTemplate steps={['Recuperar Senha']}>
                {isLoading ? this.renderIsLoading() : this.renderContent()}
            </HomeTemplate>
        );
    }

    renderIsLoading() {
        return (<ActivityIndicatorComponent/>);
    }

    renderContent() {
        let {request} = this.state;
        return (
            <Card>
                <Row style={{marginBottom: 20}}>
                    <Col md={3} sm={0}/>
                    <Col md={6} sm={12}>
                        <h2 align="center">Recuperar senha</h2>
                    </Col>
                    <Col md={3} sm={0}/>
                </Row>
                <Row style={{marginBottom: 10}}>
                    <Col md={3} sm={0}/>
                    <Col md={6} sm={12}>
                        <p style={{textAlign: 'justify'}}>
                            Insira seu endereço email abaixo e enviaremos um email para que você possa alterar sua
                            senha!
                        </p>
                    </Col>
                    <Col md={3} sm={0}/>
                </Row>
                <Row>
                    <Col md={3} sm={0}/>
                    <Col md={6} sm={12}>
                        <InputText
                            id="email"
                            placeholder="meu_email@email.com"
                            value={request.email}
                            maxLength={30}
                            style={StyleConstants.WIDTH_100_PERCENT}
                            onChange={(e) => this.setEmail(e)}
                        />
                    </Col>
                    <Col md={3} sm={0}/>
                </Row>
                <Row style={{marginTop: 25}}>
                    <Col md={4} sm={0}/>
                    <Col md={4} sm={12}>
                        <Button
                            label="Enviar"
                            style={StyleConstants.WIDTH_100_PERCENT}
                            onClick={() => this.submitRequest()}
                        />
                    </Col>
                    <Col md={4} sm={0}/>
                </Row>
            </Card>
        );
    }

    setEmail(e) {
        this.setState({request: new EmailValidationRequest(e.target.value)})
    }

    submitRequest() {
        let {request, showToast} = this.state;
        if ((request.email == null) || (request.email.length === 0)) {
            showToast(ToastUtils.BUILD_TOAST_FORM_ERROR('Campos Inválidos!', 'Insira um email válido!'));
        }
        EmailValidationService.REQUEST_PASSWORD_CHANGE(request)
            .then(
                response => showToast(ToastUtils.BUILD_TOAST_SUCCESS_BODY('Mensagem enviada!'))
            ).catch(
            error => showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
        );
    }
}
