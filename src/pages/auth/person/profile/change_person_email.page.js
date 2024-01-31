import React from "react";
import {useNavigate} from "react-router-dom";
import {updateToken} from "../../../../service/redux/action/token.action";
import {updateUser} from "../../../../service/redux/action/user.action";
import {connect} from "react-redux";
import {Col, Container, Row} from "react-bootstrap";
import {Divider} from "primereact/divider";
import {Button} from "primereact/button";
import {StyleConstants} from "../../../../service/style.constants";
import {ActivityIndicatorComponent} from "../../../../components/activity_indicator.component";
import {EmailValidationService} from "../../../../service/new/ms_auth/email_validation.service";
import {EmailChangeRequest} from "../../../../domain/new/email_validation/request/email_change.request";
import {ToastUtils} from "../../../../util/toast.utils";

const ChangePersonEmailPage = ({token, user, updateToken, updateUser, showToast}) => {
    const navigate = useNavigate();
    const navigateTo = (route) => {
        navigate(route);
    };
    return (
        <>
            <_ChangePersonEmailPage
                navigateTo={navigateTo}
                showToast={showToast}
                updateToken={updateToken}
                updateUser={updateUser}
                token={token}
                authenticatedUser={user}
            />
        </>
    );
}

class _ChangePersonEmailPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            updateToken: props.updateToken,
            updateUser: props.updateUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            request: new EmailChangeRequest(props.authenticatedUser.uuid),

            isLoading: false,

            selectedOption: 1
        }
    }

    render() {
        if (this.state.isLoading) {
            return (<ActivityIndicatorComponent/>);
        }
        return (
            <Container>
                <Row>
                    <Divider align="center">
                        <span><b>ATENÇÃO</b></span>
                    </Divider>
                    <Col>
                        <p>
                            Para que você possa alterar o seu email clique no botão abaixo e enviaremos um email
                            com um link que te levará até a página de alteração de endereço de email.
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button
                            label="Enviar email"
                            style={StyleConstants.WIDTH_100_PERCENT}
                            icon="pi pi-send"
                            onClick={() => this.requestEmailChange()}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }

    requestEmailChange() {
        let {request, showToast, token} = this.state;
        this.setState({isLoading: true});
        EmailValidationService.REQUEST_EMAIL_CHANGE(request, token)
            .then(
                response =>
                    showToast(
                        ToastUtils.BUILD_TOAST_SUCCESS_BODY(
                            'Pronto! O email que enviamos já já estará em sua caixa de entrada atual do email atual'
                        )
                    )
            ).catch(error => showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isLoading: false}))
    }
}

const myMapDispatchToProps = {
    updateToken: updateToken,
    updateUser: updateUser,
};
const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps, myMapDispatchToProps)(ChangePersonEmailPage);
