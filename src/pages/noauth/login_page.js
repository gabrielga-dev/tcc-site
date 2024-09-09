import React, {useRef} from "react";
import {Button} from "primereact/button";

import "primeflex/primeflex.css"
import {UserService} from "../../service/new/ms_auth/user.service";
import {Toast} from "primereact/toast";
import {Col, Container, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {ToastUtils} from "../../util/toast.utils";
import {updateToken} from "../../service/redux/action/token.action";
import {connect} from "react-redux";
import {updateUser} from "../../service/redux/action/user.action";
import {Divider} from "primereact/divider";
import {UserAuthRequest} from "../../domain/new/person/request/user_auth_request";
import {AuthConstants} from "../../util/auth.constants";
import {TextFieldComponent} from "../../components/form/input/text_field.component";
import {PasswordFieldComponent} from "../../components/form/input/password_field.component";
import {StyleConstants} from "../../service/style.constants";
import HomeTemplate from "../template/home_template";
import {Card} from "primereact/card";
import './login_page.style.css';

const LoginPage = ({updateToken, updateUser}) => {
    const toast = useRef(null);
    const navigate = useNavigate();

    const showToast = (body) => {
        toast.current.show(body);
    };
    const navigateTo = (route) => {
        navigate(route);
    };
    return (
        <>
            <Toast ref={toast}/>
            <_LoginPage
                showToast={showToast}
                navigateTo={navigateTo}
                updateToken={updateToken}
                updateUser={updateUser}
            />
        </>
    )
}

class _LoginPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            request: new UserAuthRequest(),
            showToast: props.showToast,
            navigateTo: props.navigateTo,
            updateToken: props.updateToken,
            updateUser: props.updateUser,
        }
    }

    setUsername(value) {
        let {request} = this.state
        request.username = value;
        this.setState({request})
    }

    setPassword(value) {
        let {request} = this.state
        request.password = value;
        this.setState({request})
    }

    render() {
        let {username, password} = this.state.request
        let {navigateTo} = this.state
        return (
            <HomeTemplate steps={['Login']}>
                <Card className='main-card'>
                    <Container>
                        <Row>
                            <Col sm={0} md={4}/>
                            <Col sm={12} md={4}>
                                <Container>
                                    <Row>
                                        <Col>
                                            <h2 align="center">MyEvents</h2>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <TextFieldComponent
                                                label='Email'
                                                placeHolder='Email'
                                                value={username}
                                                maxLength={100}
                                                onChange={(newValue) => this.setUsername(newValue)}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <PasswordFieldComponent
                                                label='Senha'
                                                placeHolder=''
                                                maxLength={100}
                                                toggleMask={true}
                                                feedback={false}
                                                value={password}
                                                onChange={(newValue) => this.setPassword(newValue)}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Button
                                                style={StyleConstants.WIDTH_100_PERCENT}
                                                onClick={() => this.submitLogin()}
                                                label="Enviar"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Divider type="dashed" align="center">
                                                <span>ou</span>
                                            </Divider>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Button
                                                style={StyleConstants.WIDTH_100_PERCENT}
                                                label="Crie sua conta!"
                                                className="p-button-outlined"
                                                onClick={() => navigateTo('/tipos-cadastro')}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Button
                                                style={StyleConstants.WIDTH_100_PERCENT}
                                                label="Esqueci minha senha!"
                                                className="p-button-text p-button-danger"
                                                onClick={() => navigateTo('/esqueci-senha')}
                                            />
                                            <a href="/cadastre-se"></a>
                                        </Col>
                                    </Row>
                                </Container>
                            </Col>
                            <Col sm={0} md={4}/>
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        )
    }

    submitLogin() {
        let {navigateTo} = this.state
        UserService.LOGIN(this.state.request).then(
            response => {
                this.state.showToast(
                    ToastUtils.BUILD_TOAST_SUCCESS_BODY("Login efetuado com sucesso!")
                )
                this.setPassword('')
                this.setUsername('')
                UserService.GET_AUTHENTICATED_USER(response.data.token)
                    .then(
                        responseAuthUser => {

                            console.log(JSON.parse(JSON.stringify(responseAuthUser.data)))
                            localStorage.setItem(AuthConstants.TOKEN, response.data.token);
                            localStorage.setItem(
                                AuthConstants.USER,
                                JSON.stringify(responseAuthUser.data)
                            );

                            this.state.updateUser(responseAuthUser.data)
                            this.state.updateToken(response.data.token)
                            navigateTo("/")
                        }
                    ).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)));
            }
        ).catch(
            error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
        )
    }
}


const myMapDispatchToProps = {
    updateToken: updateToken,
    updateUser: updateUser,
};
const mapStateToProps = state => {
    return state
};

export default connect(mapStateToProps, myMapDispatchToProps)(LoginPage);
