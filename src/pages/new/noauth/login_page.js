import React, {useRef} from "react";

import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Card} from 'primereact/card';

import {FlexStyle} from "../../../style/flex.style";
import {Button} from "primereact/button";

import "primeflex/primeflex.css"
import {MarginStyle} from "../../../style/margin.style";
import {UserService} from "../../../service/new/user.service";
import {Login_form} from "../../../domain/new/form/user/login_form";
import {Toast} from "primereact/toast";
import {Container} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {ToastUtils} from "../../../util/toast.utils";
import {updateToken} from "../../../service/redux/action/token.action";
import {connect} from "react-redux";
import {updateUser} from "../../../service/redux/action/user.action";

const LoginPage = ({updateToken, updateUser}) => {
    const toast = useRef(null);
    const navigate = useNavigate();

    const showToast = (body) => {
        toast.current.show(body);
    };
    const redirectTo = (route) => {
        navigate(route);
    };
    return (
        <>
            <Toast ref={toast}/>
            <_LoginPage
                showToast={showToast}
                redirectTo={redirectTo}
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
            email: 'exemplo@email.com',
            senha: '12345678',
            showToast: props.showToast,
            redirectTo: props.redirectTo,
            updateToken: props.updateToken,
            updateUser: props.updateUser,
        }
    }

    setEmail(valor) {
        this.setState({email: valor})
    }

    setSenha(valor) {
        this.setState({senha: valor})
    }

    render() {
        let {email, senha, toast} = this.state
        return (
            <>
                <Toast ref={toast}/>
                <Container>
                    <br/>
                    <div style={MarginStyle.makeMargin(0, 10, 0, 0)}
                         className="flex flex-row flex-wrap justify-content-center">
                        <Card header={this.renderHeader()}>
                            <div style={FlexStyle.makeFlex(1)}>
                                <form onSubmit={(e) => this.submitLogin(e)} className="p-fluid">
                                    <div style={MarginStyle.makeMargin(0, 10, 0, 10)}>
                                        <h5>Email:</h5>
                                        <InputText
                                            value={email}
                                            maxLength={100}
                                            onChange={(e) => this.setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div style={MarginStyle.makeMargin(0, 10, 0, 10)}>
                                        <h5>Senha:</h5>
                                        <Password
                                            value={senha}
                                            maxLength={100}
                                            onChange={(e) => this.setSenha(e.target.value)}
                                            toggleMask={true}
                                            feedback={false}
                                        />
                                    </div>
                                    <Button type="submit" label="Enviar" icon="pi pi-check" iconPos="left"/>
                                    <a href="/cadastre-se">Crie sua conta!</a>
                                    <div
                                        className="flex flex-row flex-wrap"
                                        style={MarginStyle.makeMargin(0, 10, 0, 0)}
                                    >
                                    </div>
                                </form>
                            </div>
                        </Card>
                    </div>
                </Container>
            </>
        )
    }

    renderHeader() {
        return (
            <>
                <br/>
                <h3 align="center">Login</h3>
            </>
        );
    }

    submitLogin(e) {
        let {email, senha, redirectTo} = this.state
        UserService.LOGIN(
            new Login_form(email, senha)
        ).then(
            response => {
                this.state.showToast(
                    ToastUtils.BUILD_TOAST_SUCCESS_BODY("Login efetuado com sucesso!")
                )
                this.setSenha('')
                this.setEmail('')
                UserService.GET_AUTHENTICATED_USER(response.data.token)
                    .then(
                        responseAuthUser => {
                            this.state.updateUser(responseAuthUser.data)
                            this.state.updateToken(response.data.token)
                            redirectTo("/")
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
