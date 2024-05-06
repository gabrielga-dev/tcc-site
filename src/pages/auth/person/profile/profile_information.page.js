import {useNavigate, useParams} from "react-router-dom";
import React from "react";
import {updateToken} from "../../../../service/redux/action/token.action";
import {updateUser} from "../../../../service/redux/action/user.action";
import {connect} from "react-redux";
import {Col, Container, Row} from "react-bootstrap";
import {Divider} from "primereact/divider";
import {Button} from "primereact/button";
import {StyleConstants} from "../../../../service/style.constants";
import {UpdateUserRequest} from "../../../../domain/new/person/request/update_user_request";
import ValidationUtil from "../../../../util/validation/validation.util";
import {ToastUtils} from "../../../../util/toast.utils";
import {UserService} from "../../../../service/new/ms_auth/user.service";
import {ActivityIndicatorComponent} from "../../../../components/activity_indicator.component";
import {TextFieldComponent} from "../../../../components/form/input/text_field.component";

const ProfileInformationPage = ({
                                    token, user, showToast = () => {
    }, updateUser
                                }) => {
    let {uuid} = useParams();

    const navigate = useNavigate();
    const navigateTo = (route) => {
        navigate(route);
    };
    return (
        <_ProfileInformationPage
            updateUser={updateUser}
            token={token}
            navigateTo={navigateTo}
            authenticatedUser={user}
            bandUuid={uuid}
            showToast={showToast}
        />
    );
}

class _ProfileInformationPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            updateUser: props.updateUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            request: new UpdateUserRequest(props.authenticatedUser),
            validator: new ValidationUtil(),

            isLoading: false,
            isEditing: false,

            selectedOption: 1
        }
    }

    render() {
        let {isEditing, isLoading} = this.state;
        let {cpf, email} = this.state.authenticatedUser;
        let {firstName, lastName} = this.state.request;

        if (isLoading) {
            return (<ActivityIndicatorComponent/>);
        }

        return (
            <div className="p-fluid">
                <Container>
                    <Row>
                        <Divider align="center">
                            <span>Meus Dados</span>
                        </Divider>
                        <Col md={6} sm={12} style={FIELD_MARGIN}>
                            <TextFieldComponent
                                label='Nome'
                                optional={!isEditing}
                                disabled={!isEditing}
                                value={firstName}
                                maxLength={30}
                                onChange={(e) => this.setField('firstName', e)}
                            />
                        </Col>
                        <Col md={6} sm={12} style={FIELD_MARGIN}>
                            <TextFieldComponent
                                label='Sobrenome'
                                optional={!isEditing}
                                disabled={!isEditing}
                                value={lastName}
                                maxLength={150}
                                onChange={(e) => this.setField('lastName', e)}
                            />
                        </Col>
                        <Col md={6} sm={12} style={FIELD_MARGIN}>
                            <TextFieldComponent
                                label='CPF'
                                optional={true}
                                disabled={true}
                                value={cpf}
                                tooltip='Não é possível modificar o CPF por aqui! Caso queira alterar, entre em contato com o suporte.'
                            />
                        </Col>
                        <Col md={6} sm={12} style={FIELD_MARGIN}>
                            <TextFieldComponent
                                label='Email'
                                optional={true}
                                disabled={true}
                                value={email}
                                tooltip="Não é possível modificar o email por aqui! Caso queira alterar, vá à seção 'Mudar Email'."
                            />
                        </Col>
                    </Row>

                    {this.renderButtons()}
                </Container>
            </div>
        );
    }

    renderButtons() {
        let {isEditing} = this.state;
        if (isEditing) {
            return (
                <Row>
                    <Col md={6} sm={0}/>
                    <Col md={3} sm={12}>
                        <Button
                            label="Voltar"
                            style={StyleConstants.WIDTH_100_PERCENT}
                            className="p-button-danger"
                            icon="pi pi-arrow-left"
                            onClick={() => this.back()}
                        />
                    </Col>
                    <Col md={3} sm={12}>
                        <Button
                            label="Enviar"
                            className="p-button-success"
                            icon="pi pi-check"
                            style={StyleConstants.WIDTH_100_PERCENT}
                            onClick={() => this.submitRequest()}
                        />
                    </Col>
                </Row>
            );
        }
        return (
            <Row>
                <Col md={6} sm={0}/>
                <Col md={6} sm={12}>
                    <Button
                        label="Editar"
                        style={StyleConstants.WIDTH_100_PERCENT}
                        className="p-button-warning"
                        icon="pi pi-pencil"
                        onClick={() => this.setState({isEditing: true})}
                    />
                </Col>
            </Row>
        );
    }

    setField(field, value) {
        let {request} = this.state;
        request[field] = value;
        this.setState({request});
    }

    back() {
        let {request, authenticatedUser} = this.state;
        request.firstName = authenticatedUser.firstName;
        request.lastName = authenticatedUser.lastName;

        this.setState({isEditing: false});
    }

    submitRequest() {
        let {validator, request, showToast} = this.state;
        this.setState({isLoading: true});

        let errors = validator.validate(request);
        if (errors.length > 0) {
            showToast(ToastUtils.BUILD_TOAST_FORM_ERROR(errors[0]))
            this.setState({isLoading: false});
            return;
        }

        let {uuid} = this.state.authenticatedUser;
        let {token} = this.state;
        UserService.UPDATE(uuid, request, token)
            .then(
                () => {
                    showToast(ToastUtils.BUILD_TOAST_SUCCESS_BODY('Edição efetuada com sucesso!'))
                    this.afterUpdate();
                }
            ).catch(
            error => {
                console.log(error)
                showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
            }
        ).finally(() => this.setState({isLoading: false}))
    }

    afterUpdate() {
        let {request, authenticatedUser, updateUser} = this.state;
        authenticatedUser.firstName = request.firstName;
        authenticatedUser.lastName = request.lastName;

        this.setState({authenticatedUser: authenticatedUser, isEditing: false});
        updateUser(authenticatedUser);
    }
}

const FIELD_MARGIN = {marginBottom: 10}

const myMapDispatchToProps = {
    updateToken: updateToken,
    updateUser: updateUser,
};
const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps, myMapDispatchToProps)(ProfileInformationPage);
