import React, {useRef} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {Toast} from 'primereact/toast';
import {UserRequest} from "../../../domain/new/person/request/user_request";
import {UserService} from "../../../service/new/ms_auth/user.service";
import ValidationUtil from "../../../util/validation/validation.util";
import {useNavigate} from 'react-router-dom';
import {ToastUtils} from "../../../util/toast.utils";
import HomeTemplate from "../../template/home_template";
import {Divider} from "primereact/divider";
import {RoleEnum} from "../../../domain/new/enum/role.enum";
import './create_account.style.css'
import {TextFieldComponent} from "../../../components/form/input/text_field.component";
import {TextMaskFieldComponent} from "../../../components/form/input/text_mask_field.component";
import {PasswordFieldComponent} from "../../../components/form/input/password_field.component";

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
                <Card className='main-card'>
                    <div className="p-fluid">
                        <div>
                            <Divider type="dashed" align="center">
                                <label>Seus dados</label>
                            </Divider>
                            {this.personForm()}
                        </div>
                        <span> * Campos obrigatórios</span>
                        <Container>
                            <Row>
                                <Col md={6} sm={0}/>
                                <Col md={6} sm={12}>
                                    <Button
                                        label="Enviar" icon="pi pi-send"
                                        onClick={() => this.submitForm()}
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </Card>
            </HomeTemplate>
        );
    }

    personForm() {
        let {isLoading} = this.state;
        let {firstName, lastName, cpf, email, password, passwordRepeated} = this.state.user;
        return (
            <Row>
                <Col md={6} sm={12} style={FIELD_MARGIN}>
                    <TextFieldComponent
                        label='Nome'
                        optional={false}
                        disabled={isLoading}
                        value={firstName}
                        maxLength={30}
                        onChange={(e) => this.setField('firstName', e)}
                    />
                </Col>
                <Col md={6} sm={12} style={FIELD_MARGIN}>
                    <TextFieldComponent
                        label='Sobrenome'
                        optional={false}
                        disabled={isLoading}
                        value={lastName}
                        maxLength={150}
                        onChange={(e) => this.setField('lastName', e)}
                    />
                </Col>
                <Col md={6} sm={12} style={FIELD_MARGIN}>
                    <TextMaskFieldComponent
                        label='CPF'
                        mask="999.999.999-99"
                        placeholder="xxx.xxx.xxx-xx"
                        optional={false}
                        disabled={isLoading}
                        value={cpf}
                        maxLength={150}
                        onChange={(e) => this.setField('cpf', e)}
                    />
                </Col>
                <Col md={6} sm={12} style={FIELD_MARGIN}>
                    <TextFieldComponent
                        label='Email'
                        placeholder="exemplo@gmail.com"
                        optional={false}
                        disabled={isLoading}
                        value={email}
                        maxLength={100}
                        onChange={(e) => this.setField('email', e)}
                    />
                </Col>
                <Col md={6} sm={12} style={FIELD_MARGIN}>
                    <PasswordFieldComponent
                        label='Senha'
                        placeHolder=''
                        optional={false}
                        maxLength={100}
                        toggleMask={true}
                        feedback={true}
                        value={password}
                        onChange={(e) => this.setField('password', e)}
                    />
                </Col>
                <Col md={6} sm={12} style={FIELD_MARGIN}>
                    <PasswordFieldComponent
                        label='Repita sua senha'
                        placeHolder=''
                        optional={false}
                        maxLength={100}
                        toggleMask={true}
                        feedback={false}
                        value={passwordRepeated}
                        onChange={(e) => this.setField('passwordRepeated', e)}
                    />
                </Col>
            </Row>
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
            () => {
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
