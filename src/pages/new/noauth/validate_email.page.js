import React, {useRef} from "react";
import {Card} from "primereact/card";
import {Toast} from 'primereact/toast';
import {useNavigate, useParams} from 'react-router-dom';
import HomeTemplate from "../template/home_template";
import {Col, Container, Row} from "react-bootstrap";
import {ActivityIndicatorComponent} from "../../../components/activity_indicator.component";
import {Button} from "primereact/button";
import {StyleConstants} from "../../../service/style.constants";
import {EmaiValidationService} from "../../../service/new/ms_auth/email_validation.service";
import {ToastUtils} from "../../../util/toast.utils";

export const ValidateEmailPage = () => {
    const toast = useRef(null);
    const navigateTo = useNavigate();

    const {validation_uuid} = useParams();

    const showToast = (body) => {
        toast.current.show(body);
    };

    return (
        <>
            <Toast ref={toast}/>
            <_ValidateEmailPage
                navigateTo={navigateTo}
                showToast={showToast}
                validationUuid={validation_uuid}
            />
        </>
    )
}
export default class _ValidateEmailPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showToast: props.showToast,
            navigateTo: props.navigateTo,

            validationUuid: props.validationUuid,

            validationStatus: 1
            /*
            1: searching validation,
            2: validation not found,
            3: validation found,
            4: client error not validated,
            5: server error not validated,
            6: validated,
            */
        }
    }

    componentDidMount() {
        let {validationUuid, showToast} = this.state;
        EmaiValidationService.CHECK_IF_EMAIL_VALIDATION_EXISTS(validationUuid)
            .then(
                response => {
                    this.validateEmailValidation()
                }
            ).catch(
            error => {
                if ((400 <= error.response.status) && (error.response.status < 500)) {
                    this.setState({validationStatus: 2});
                } else if ((500 <= error.response.status) && (error.response.status < 600)) {
                    this.setState({validationStatus: 5});
                }
                showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
            }
        );
    }

    validateEmailValidation() {
        let {validationUuid, showToast} = this.state;
        EmaiValidationService.VALIDATE(validationUuid)
            .then(
                response => this.setState({validationStatus: 6})
            ).catch(
            error => {
                if ((400 <= error.response.status) && (error.response.status < 500)) {
                    this.setState({validationStatus: 4});
                } else if ((500 <= error.response.status) && (error.response.status < 600)) {
                    this.setState({validationStatus: 5});
                }
                showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
            }
        );
    }

    render() {
        return (
            <HomeTemplate steps={['Validar Email']}>
                <Card>
                    {this.renderContent()}
                </Card>
            </HomeTemplate>
        );
    }

    renderContent() {
        let {validationStatus} = this.state;

        /*
            1: searching validation,
            2: validation not found,
            3: validation found,
            4: client error not validated,
            5: server error not validated,
            6: validated,
        */
        switch (validationStatus) {
            case 1:
                return this.validating();
            case 2:
                return this.notValidated();
            case 3:
                return this.validating();
            case 4:
                return this.notValidated();
            case 5:
                return this.serverError();
            case 6:
                return this.validated();
        }
    }

    validating() {
        return (
            <Container>
                <Row>
                    <Col>
                        <h2 align="center">Estamos verificando seu email</h2>
                        <ActivityIndicatorComponent/>
                    </Col>
                </Row>
            </Container>
        );
    }


    notValidated() {
        let {navigateTo} = this.state;
        return (
            <Container>
                <Row>
                    <Col md={3} sm={0}/>
                    <Col md={6} sm={12} style={{textAlign: 'center'}}>
                        <h2>Seu email não foi verificado</h2>
                        <h2 style={{marginBottom: 20}}>😢</h2>
                        <p style={{marginBottom: 20}}>Tente criar uma conta ou entre em contato com o suporte!</p>
                    </Col>
                    <Col md={3} sm={0}/>
                </Row>
            </Container>
        );
    }

    serverError() {
        return (
            <Container>
                <Row>
                    <Col style={{textAlign: 'center'}}>
                        <h2 style={{marginBottom: 20}}>Ops! 😵‍💫</h2>
                        <p>
                            Aconteceu algo com nossos serviroes, estamos tentando o mais rápido possível, resolver isto!
                        </p>
                        <ActivityIndicatorComponent/>
                    </Col>
                </Row>
            </Container>
        );
    }

    validated() {
        let {navigateTo} = this.state;
        return (
            <Container>
                <Row>
                    <Col md={4} sm={0}/>
                    <Col md={4} sm={12} style={{textAlign: 'center'}}>
                        <h2 style={{marginBottom: 20}}>Seu email foi verificado!</h2>
                        <Button
                            style={StyleConstants.WIDTH_100_PERCENT}
                            label="Clique aqui para efetuar o login"
                            className="p-button-outlined"
                            onClick={() => navigateTo('/login')}
                        />
                    </Col>
                    <Col md={4} sm={0}/>
                </Row>
            </Container>
        );
    }

}
const STYLE_ALIGN_ITEM_CENTER = {display: 'flex', alignItems: 'center', justifyContent: 'center'};
