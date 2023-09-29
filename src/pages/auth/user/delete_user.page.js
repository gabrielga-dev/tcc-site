import React, {useRef} from 'react';
import {updateToken} from "../../../service/redux/action/token.action";
import {connect} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import {ToastUtils} from "../../../util/toast.utils";
import {ActivityIndicatorComponent} from "../../../components/activity_indicator.component";
import HomeTemplate from "../home.template";
import {Col, Container, Row} from "react-bootstrap";
import {FormEndingComponent} from "../../../components/form_ending.component";
import {UserDto} from "../../../domain/dto/user.dto";
import {UserService} from "../../../service/user.service";

const DeleteUserPage = ({token}) => {
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
            <_DeleteUserPage
                token={token}
                navigateTo={redirectTo}
                showToast={showToast}
                userId={id}
            />
        </>
    );
}

class _DeleteUserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,

            userId: this.props.userId,
            user: new UserDto(),

            token: props.token,

            navigateTo: props.navigateTo,
            showToast: props.showToast,
        };
    }

    componentDidMount() {
        this.setState({loading: true});
        UserService.FIND_BY_ID(this.props.userId, this.state.token)
            .then(response => this.setState({user: response.data}))
            .catch(error => {
                this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                this.state.navigateTo('/');
            })
            .finally(() => this.setState({loading: false}));
    }

    render() {
        let {loading, user, navigateTo} = this.state;

        if (loading) {
            return (<ActivityIndicatorComponent/>)
        }
        return (
            <HomeTemplate steps={['Usuários', 'Listar', 'Deletar']}>
                <Container>
                    <Row>
                        <Col>
                            <h4>Tem certeza que deseja deletar o usuário {user.firstName}?</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormEndingComponent
                                showSecond={false}
                                labelFirst="Não"
                                onClickFirst={() => navigateTo('/user/list')}
                                labelThird="Sim"
                                onClickThird={() => this.deleteUser()}
                            />
                        </Col>
                    </Row>
                </Container>
            </HomeTemplate>
        )
    }

    deleteUser() {
        let {userId, token, navigateTo} = this.state;
        this.setState({loading: true});
        UserService.DELETE(userId, token)
            .then(
                response => navigateTo('/user/list')
            )
            .catch(
                error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
            )
            .finally(
                () => this.setState({loading: false})
            )
    }
}

const myMapDispatchToProps = {
    updateToken: updateToken,
};
const mapStateToProps = state => (state);

export default connect(mapStateToProps, myMapDispatchToProps)(DeleteUserPage);