import {useNavigate} from "react-router-dom";
import React, {useRef} from "react";
import HomeTemplate from "../../../template/home_template";
import {updateToken} from "../../../../service/redux/action/token.action";
import {updateUser} from "../../../../service/redux/action/user.action";
import {connect} from "react-redux";
import {Card} from "primereact/card";
import {Col, Container, Row} from "react-bootstrap";
import {Button} from "primereact/button";
import {Divider} from "primereact/divider";
import ProfileInformationPage from "./profile_information.page";
import {Toast} from "primereact/toast";
import ChangePersonEmailPage from "./change_person_email.page";
import PersonRoleInformationPage from "./person_role_information.page";

const AuthenticatedPersonProfilePage = ({token, user}) => {
    const toast = useRef(null);

    const showToast = (body) => {
        toast.current.show(body);
    };

    const navigate = useNavigate();
    const navigateTo = (route) => {
        navigate(route);
    };
    return (
        <>

            <Toast ref={toast}/>
            <_AuthenticatedPersonProfilePage
                token={token}
                navigateTo={navigateTo}
                authenticatedUser={user}
                showToast={showToast}
            />
        </>
    );
}

class _AuthenticatedPersonProfilePage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            navigateTo: props.navigateTo,
            showToast: props.showToast,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            isLoading: false,

            selectedOption: 1
        }
    }

    isDisabled(option) {
        let {selectedOption} = this.state;
        return option === selectedOption;
    }

    setOption(option) {
        this.setState({selectedOption: option});
    }

    render() {
        let {authenticatedUser, token} = this.state;
        return (
            <HomeTemplate
                user={authenticatedUser}
                token={token}
                steps={['Home', 'Meu Perfil']}
            >
                <Card>
                    <Container>
                        <Row>
                            <Col md={3}>
                                <div className="flex">
                                    <Col>
                                        <Button
                                            disabled={this.isDisabled(1)}
                                            label="Meus dados"
                                            style={BUTTON_STYLE}
                                            icon="pi pi-user"
                                            onClick={() => this.setOption(1)}
                                        />
                                        <Button
                                            disabled={this.isDisabled(2)}
                                            label="Mudar email"
                                            style={BUTTON_STYLE}
                                            icon="pi pi-envelope"
                                            onClick={() => this.setOption(2)}
                                        />
                                        <Button
                                            disabled={this.isDisabled(3)}
                                            label="Permissões"
                                            style={BUTTON_STYLE}
                                            icon="pi pi-book"
                                            onClick={() => this.setOption(3)}
                                        />
                                    </Col>
                                    <Divider layout="vertical"/>
                                </div>
                            </Col>
                            <Col md={9}>
                                {this.renderContent()}
                            </Col>
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    renderContent() {
        let {selectedOption, showToast} = this.state;
        switch (selectedOption) {
            case 1:
                return (<ProfileInformationPage showToast={showToast}/>);
            case 2:
                return (<ChangePersonEmailPage showToast={showToast}/>);
            case 3:
                return (<PersonRoleInformationPage />);
        }
    }
}

const BUTTON_STYLE = {
    width: '100%',
    marginBottom: 15,
};

const myMapDispatchToProps = {
    updateToken: updateToken,
    updateUser: updateUser,
};
const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps, myMapDispatchToProps)(AuthenticatedPersonProfilePage);
