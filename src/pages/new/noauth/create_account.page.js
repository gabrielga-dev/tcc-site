import React, {useRef} from "react";
import {Col, Row} from "react-bootstrap";
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {Toast} from 'primereact/toast';
import {UserRequest} from "../../../domain/new/person/request/user_request";
import {UserService} from "../../../service/new/ms_auth/user.service";
import ValidationUtil from "../../../util/validation/validation.util";
import {useNavigate} from 'react-router-dom';
import {ToastUtils} from "../../../util/toast.utils";
import {InputMask} from "primereact/inputmask";
import HomeTemplate from "../template/home_template";
import {Divider} from "primereact/divider";
import {RoleEnum} from "../../../domain/new/enum/role.enum";

export const CreateAccountPage = () => {
    const toast = useRef(null);
    const navigateTo = useNavigate();

    const showToast = (body) => {
        toast.current.show(body);
    };

    return (
        <>
            <Toast ref={toast}/>
            <_CreateAccountPage
                navigateTo={navigateTo}
                showToast={showToast}
            />
        </>
    )
}
export default class _CreateAccountPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: new UserRequest(),
            formValidator: new ValidationUtil(),
            showToast: props.showToast,
            navigateTo: props.navigateTo
        }
    }

    getRegistrationTypeLabel() {
        let splitUrl = window.location.href.split('/');
        let type = splitUrl[(splitUrl.length - 1)].split('?')[0]
        return type.charAt(0).toUpperCase() + type.slice(1)
    }

    getRegistrationType() {
        let type = this.getRegistrationTypeLabel();
        return RoleEnum.getFromName(type)
    }

    render() {
        return (
            <HomeTemplate steps={['Cadastrar', this.getRegistrationTypeLabel()]}>
                <Card>
                    <div className="p-fluid">
                        <div>
                            <Divider type="dashed" align="center">
                                <label>Seus dados</label>
                            </Divider>
                            {this.personForm()}
                        </div>
                        <div style={{marginTop: 10}}>
                            <Button
                                label="Enviar" icon="pi pi-check" iconPos="right"
                                onClick={() => this.submitForm()}
                            />
                        </div>
                    </div>
                </Card>
            </HomeTemplate>
        );
    }

    personForm() {
        let {firstName, lastName, cpf, email, password, passwordRepeated} = this.state.user;
        return (
            <>
                <Row>
                    <Col md={6} sm={12} style={FIELD_MARGIN}>
                        <h6>Nome</h6>
                        <InputText
                            id="firstName"
                            value={firstName}
                            maxLength={30}
                            onChange={(e) => this.setField('firstName', e.target.value)}
                        />
                    </Col>
                    <Col md={6} sm={12} style={FIELD_MARGIN}>
                        <h6>Sobrenome</h6>
                        <InputText
                            value={lastName}
                            maxLength={150}
                            onChange={(e) => this.setField('lastName', e.target.value)}
                        />
                    </Col>
                    <Col md={6} sm={12} style={FIELD_MARGIN}>
                        <h6>CPF:</h6>
                        <InputMask
                            value={cpf}
                            mask="999.999.999-99"
                            placeholder="xxx.xxx.xxx-xx"
                            onChange={(e) => this.setField('cpf', e.target.value)}
                        />
                    </Col>
                    <Col md={6} sm={12} style={FIELD_MARGIN}>
                        <h6>Email</h6>
                        <InputText
                            value={email}
                            placeholder="exemplo@gmail.com"
                            maxLength={100}
                            onChange={(e) => this.setField('email', e.target.value)}
                        />
                    </Col>
                    <Col md={6} sm={12} style={FIELD_MARGIN}>
                        <h6>Senha</h6>
                        <Password
                            value={password}
                            maxLength={100}
                            onChange={(e) => this.setField('password', e.target.value)}
                            toggleMask={true}
                            feedback={false}
                        />
                    </Col>
                    <Col md={6} sm={12} style={FIELD_MARGIN}>
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
            </>
        );
    }

    setField(field, value) {
        let {user} = this.state;
        user[field] = value;
        this.setState({user});
    }

    submitForm() {
        let errors = this.validateForm();
        if (errors.length > 0) {
            this.state.showToast(
                ToastUtils.BUILD_TOAST_FORM_ERROR('Campos Inválidos', errors[0])
            )
            return;
        }
        UserService.CREATE(
            this.state.user, this.getRegistrationType()
        ).then(
            response => {
                this.state.showToast(
                    ToastUtils.BUILD_TOAST_SUCCESS_BODY("Usuário criado com sucesso!")
                )
                this.setState({user: new UserRequest()});
                setTimeout(
                    () => {
                        this.state.navigateTo('/login')
                    },
                    1500
                );
            }
        ).catch(
            error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
        )
    }

    validateForm() {
        let {user, formValidator} = this.state;

        return formValidator.validate(user);
    }
}

const FIELD_MARGIN = {marginBottom: 10}
