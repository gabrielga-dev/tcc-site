import {useNavigate, useParams} from "react-router-dom";
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
import {UserEditForm} from "../../../domain/form/user_edit.form";
import {Constants} from "../../../util/constants";

const EditUserPage = ({token, user, updateToken}) => {
    let {id} = useParams();
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
            <_EditUserPage
                token={token}
                updateToken={updateToken}
                navigateTo={redirectTo}
                showToast={showToast}
                userId={id}
                authenticatedUser={user}
            />
        </>
    );
}

class _EditUserPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,

            formValidator: new ValidationUtil(),
            userId: props.userId,
            user: new UserForm(),

            token: props.token,

            updateToken: props.updateToken,
            navigateTo: props.navigateTo,
            showToast: props.showToast,
            authenticatedUserIsIntern: Constants.IS_INTERN_USER(props.authenticatedUser),
        }
    }

    componentDidMount() {
        let {token, userId} = this.state;
        this.setState({loading: true});
        UserService.FIND_BY_ID(userId, token)
            .then(
                response => {
                    let toEdit = response.data;
                    let user = new UserEditForm();

                    user.intern = toEdit.roles.map(role => (role.name)).includes('INTERNO');
                    user.firstName = toEdit.firstName
                    user.lastName = toEdit.lastName
                    user.email = toEdit.email

                    this.setState({user: user})
                })
            .catch(
                error => {
                    this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                }
            )
            .finally(() => this.setState({loading: false}));
    }

    render() {
        let {loading, authenticatedUserIsIntern} = this.state;
        let {firstName, lastName, email, intern, password} = this.state.user;

        if (loading) {
            return (<ActivityIndicatorComponent/>);
        }
        return (
            <HomeTemplate steps={['Usuário', 'Listar', 'Editar']}>
                <Container>
                    <Row>
                        <Card header={this.renderHeader()}>
                            <form onSubmit={(e) => e.preventDefault()} className="p-fluid">
                                <Container>
                                    {
                                        authenticatedUserIsIntern
                                            ? (
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
                                            )
                                            : null
                                    }
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
                                                showSecond={false}
                                                onClickFirst={() => this.goBack()}
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
        let {userId, user, token, navigateTo} = this.state;
        this.setState({loading: true});
        UserService.UPDATE(userId, user, token)
            .then(response => this.goBack())
            .catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({loading: false}))
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
                <h3 align="center">Edição de usuários</h3>
            </>
        );
    }

    goBack() {
        if (this.state.authenticatedUserIsIntern) {
            this.state.navigateTo('/user/list');
        } else {
            this.state.navigateTo('/');
        }
    }
}

const myMapDispatchToProps = {
    updateToken: updateToken,
};
const mapStateToProps = state => (state);

export default connect(mapStateToProps, myMapDispatchToProps)(EditUserPage);