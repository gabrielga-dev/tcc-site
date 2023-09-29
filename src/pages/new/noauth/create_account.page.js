import React, {useRef} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {Toast} from 'primereact/toast';
import {User_form} from "../../../domain/new/form/user/user_form";
import {UserService} from "../../../service/new/user.service";
import {ToastComponent} from "../../../components/toast.component";
import ValidationUtil from "../../../util/validation/validation.util";
import {useNavigate} from 'react-router-dom';
import {ToastUtils} from "../../../util/toast.utils";
import {InputMask} from "primereact/inputmask";

export const CreateAccountPage = (props) => {
    const toast = useRef(null);
    const navigate = useNavigate();

    const showToast = (body) => {
        toast.current.show(body);
    };
    const redirectToLogin = () => {
        navigate('/login');
    };
    return (
        <>
            <Toast ref={toast}/>
            <_CreateAccountPage showToast={showToast} redirectToLogin={redirectToLogin}/>
        </>
    )
}
export default class _CreateAccountPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: new User_form(),
            formValidator: new ValidationUtil(),
            showToast: props.showToast,
            redirectToLogin: props.redirectToLogin
        }
    }

    render() {
        let {firstName, lastName, cpf, email, password, passwordRepeated} = this.state.user;
        let {show, toastBody} = this.state;
        return (
            <Container>
                <ToastComponent show={show} toastBody={toastBody}/>
                <Row/>
                <Row>
                    <Card header={this.renderHeader()}>
                        <form onSubmit={(e) => this.submitForm(e)} className="p-fluid">
                            <Container>
                                <Row>
                                    <Col>
                                        <h6>Nome</h6>
                                        <InputText
                                            id="firstName"
                                            value={firstName}
                                            maxLength={30}
                                            onChange={(e) => this.setField('firstName', e.target.value)}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <h6>Sobrenome</h6>
                                        <InputText
                                            value={lastName}
                                            maxLength={150}
                                            onChange={(e) => this.setField('lastName', e.target.value)}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <h6>CPF:</h6>
                                        <InputMask
                                            value={cpf}
                                            mask="999.999.999-99"
                                            placeholder="xxx.xxx.xxx-xx"
                                            onChange={(e) => this.setField('cpf', e.target.value)}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <h6>Email</h6>
                                        <InputText
                                            value={email}
                                            placeholder="exemplo@gmail.com"
                                            maxLength={100}
                                            onChange={(e) => this.setField('email', e.target.value)}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <h6>Senha</h6>
                                        <Password
                                            value={password}
                                            maxLength={100}
                                            onChange={(e) => this.setField('password', e.target.value)}
                                            toggleMask={true}
                                            feedback={false}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <h6>Repita sua senha</h6>
                                        <Password
                                            value={passwordRepeated}
                                            maxLength={100}
                                            onChange={(e) => this.setField('passwordRepeated', e.target.value)}
                                            toggleMask={true}
                                            feedback={false}
                                        />
                                    </Col>
                                </Row>
                            </Container>
                            <Button
                                type="submit" label="Enviar" icon="pi pi-check" iconPos="right"
                                onClick={() => this.setState({show: true})}
                            />
                        </form>
                    </Card>
                </Row>
                <Row/>
            </Container>
        );
    }

    setField(field, value) {
        let {user} = this.state;
        user[field] = value;
        this.setState({user});
    }

    submitForm(e) {
        let errors = this.validateForm();
        if (errors.length > 0) {
            this.state.showToast(
                ToastUtils.BUILD_TOAST_FORM_ERROR('Campos Inválidos', errors[0])
            )
            e.preventDefault()
            return;
        }
        UserService.CREATE(
            this.state.user
        ).then(
            response => {
                this.state.showToast(
                    ToastUtils.BUILD_TOAST_SUCCESS_BODY("Usuário criado com sucesso!")
                )
                this.setState({user: new User_form()});
                setTimeout(
                    () => {
                        this.state.redirectToLogin()
                    },
                    1500
                );
            }
        ).catch(
            error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
        )
        e.preventDefault()
    }

    renderHeader() {
        return (
            <>
                <br/>
                <h3 align="center">Crie sua conta</h3>
            </>
        );
    }

    validateForm() {
        let {user, formValidator} = this.state;

        return formValidator.validate(user);
    }
}
