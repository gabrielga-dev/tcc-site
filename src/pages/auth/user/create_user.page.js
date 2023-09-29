import {useNavigate} from "react-router-dom";
import React, {useRef} from "react";
import {updateToken} from "../../../service/redux/action/token.action";
import {connect} from "react-redux";
import HomeTemplate from "../home.template";
import {Col, Container, Row} from "react-bootstrap";
import {ActivityIndicatorComponent} from "../../../components/activity_indicator.component";
import {Toast} from "primereact/toast";
import ValidationUtil from "../../../util/validation/validation.util";
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {UserForm} from "../../../domain/form/user.form";
import {StyleConstants} from "../../../service/style.constants";
import {Password} from "primereact/password";
import {FormEndingComponent} from "../../../components/form_ending.component";
import {UserService} from "../../../service/user.service";
import {ToastUtils} from "../../../util/toast.utils";
import {InputSwitch} from "primereact/inputswitch";

const CreateUserPage = ({token, updateToken}) => {
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
            <_CreateUserPage token={token} updateToken={updateToken} navigateTo={redirectTo} showToast={showToast}/>
        </>
    );
}

class _CreateUserPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,

            formValidator: new ValidationUtil(),
            user: new UserForm(),

            token: props.token,

            updateToken: props.updateToken,
            navigateTo: props.redirectTo,
            showToast: props.showToast,
        }
    }

    render() {
        let {loading} = this.state;
        let {firstName, lastName, email, intern, password} = this.state.user;

        if (loading) {
            return (<ActivityIndicatorComponent/>);
        }
        return (
            <HomeTemplate steps={['Usuário', 'Cadastrar']}>
                <Container>
                    <Row>
                        <Card header={this.renderHeader()}>
                            <form onSubmit={(e) => e.preventDefault()} className="p-fluid">
                                <Container>
                                    <Row>
                                        <Col>
                                            <h6>Interno</h6>
                                            <InputSwitch
                                                id="intern"
                                                checked={intern}
                                                onChange={(e) => this.setField('intern', e.value)}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <h6>Nome</h6>
                                            <InputText
                                                id="firstName"
                                                value={firstName}
                                                maxLength={30}
                                                style={StyleConstants.WIDTH_100_PERCENT}
                                                onChange={(e) => this.setField('firstName', e.target.value)}
                                            />
                                        </Col>
                                        <Col>
                                            <h6>Sobrenome</h6>
                                            <InputText
                                                id="lastName"
                                                value={lastName}
                                                maxLength={100}
                                                style={StyleConstants.WIDTH_100_PERCENT}
                                                onChange={(e) => this.setField('lastName', e.target.value)}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <h6>Email</h6>
                                            <InputText
                                                id="email"
                                                value={email}
                                                maxLength={150}
                                                style={StyleConstants.WIDTH_100_PERCENT}
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
                                            <FormEndingComponent
                                                showFirst={false}
                                                showSecond={false}
                                                onClickThird={() => this.submitForm()}
                                            />
                                        </Col>
                                    </Row>
                                </Container>
                            </form>
                        </Card>
                    </Row>
                </Container>
            </HomeTemplate>
        );
    }

    submitForm() {
        let errors = this.validateForm();
        if (errors.length > 0) {
            this.state.showToast(
                ToastUtils.BUILD_TOAST_FORM_ERROR('Campos Inválidos', errors[0])
            )
            return;
        }
        this.setState({loading: true});
        UserService.CREATE(
            this.state.user
        ).then(
            response => {
                this.state.showToast(
                    ToastUtils.BUILD_TOAST_SUCCESS_BODY("Usuário criado com sucesso!")
                )
                this.setState({user: new UserForm()});
            }
        ).catch(
            error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
        ).finally(
            () => this.setState({loading: false})
        )
    }

    validateForm() {
        let {user, formValidator} = this.state;

        return formValidator.validate(user);
    }

    setField(field, value) {
        let {user} = this.state;
        user[field] = value;
        this.setState({user});
    }

    renderHeader() {
        return (
            <>
                <br/>
                <h3 align="center">Cadastro de usuários</h3>
            </>
        );
    }
}

const myMapDispatchToProps = {
    updateToken: updateToken,
};
const mapStateToProps = state => (state);

export default connect(mapStateToProps, myMapDispatchToProps)(CreateUserPage);