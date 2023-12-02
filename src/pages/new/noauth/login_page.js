import React, {useRef} from "react";

import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Card} from 'primereact/card';
import {Button} from "primereact/button";

import "primeflex/primeflex.css"
import {MarginStyle} from "../../../style/margin.style";
import {UserService} from "../../../service/new/ms_auth/user.service";
import {Toast} from "primereact/toast";
import {Container} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {ToastUtils} from "../../../util/toast.utils";
import {updateToken} from "../../../service/redux/action/token.action";
import {connect} from "react-redux";
import {updateUser} from "../../../service/redux/action/user.action";
import {Divider} from "primereact/divider";
import {UserAuthRequest} from "../../../domain/new/person/request/user_auth_request";
import {AuthConstants} from "../../../util/auth.constants";

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
            <Container>
                <Card header={this.renderHeader()}>
                    <form onSubmit={(e) => this.submitLogin(e)} className="p-fluid">
                        <div style={MarginStyle.makeMargin(0, 10, 0, 10)}>
                            <h5>Email:</h5>
                            <InputText
                                value={username}
                                maxLength={100}
                                onChange={(e) => this.setUsername(e.target.value)}
                            />
                        </div>
                        <div style={MarginStyle.makeMargin(0, 10, 0, 10)}>
                            <h5>Senha:</h5>
                            <Password
                                value={password}
                                maxLength={100}
                                onChange={(e) => this.setPassword(e.target.value)}
                                toggleMask={true}
                                feedback={false}
                            />
                        </div>
                        <Button type="submit" label="Enviar"/>
                        <Divider type="dashed" align="center">
                            <span>ou</span>
                        </Divider>
                        <Button
                            label="Crie sua conta!"
                            className="p-button-outlined"
                            onClick={() => navigateTo('/tipos-cadastro')}
                        />
                        <Button
                            label="Esqueci minha senha!"
                            className="p-button-text p-button-danger"
                            onClick={() => navigateTo('/esqueci-senha')}
                        />
                        <a href="/cadastre-se"></a>
                    </form>
                </Card>
            </Container>
        )
    }

    renderHeader() {
        return (
            <div style={{marginTop: 25}}>
                <p align="center" style={{fontSize: 40}}>Login</p>
            </div>
        );
    }

    submitLogin(e) {
        let {navigateTo} = this.state
        UserService.LOGIN(this.state.request).then(
            response => {
                e.preventDefault()
                this.state.showToast(
                    ToastUtils.BUILD_TOAST_SUCCESS_BODY("Login efetuado com sucesso!")
                )
                this.setPassword('')
                this.setUsername('')
                UserService.GET_AUTHENTICATED_USER(response.data.token)
                    .then(
                        responseAuthUser => {

                            localStorage.setItem(AuthConstants.TOKEN, response.data.token);
                            localStorage.setItem(AuthConstants.USER, responseAuthUser.data);

                            this.state.updateUser(responseAuthUser.data)
                            this.state.updateToken(response.data.token)
                            navigateTo("/")
                        }
                    ).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)));
            }
        ).catch(
            error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
        )
        e.preventDefault()
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
