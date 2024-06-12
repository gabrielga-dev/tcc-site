import React, {useRef} from "react";
import '../../App.css';
import {connect} from "react-redux";
import {updateToken} from "../../service/redux/action/token.action";
import {updateUser} from "../../service/redux/action/user.action";
import {useNavigate} from "react-router-dom";
import {Toast} from "primereact/toast";
import HomeTemplate from "../template/home_template";
import {RoleEnum} from "../../domain/new/enum/role.enum";
import {Col, Container, Row} from "react-bootstrap";
import {BandDashboardPage} from "../auth/dashboard/band_dashboard.page";
import {DashboardFailPage} from "../auth/dashboard/dashboard_fail.page";

const HomePage = ({token, updateToken, user}) => {
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
            <_HomePage
                token={token}
                updateToken={updateToken}
                navigateTo={redirectTo}
                showToast={showToast}
                authenticatedUser={user}
            />
        </>
    );
}

class _HomePage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
            loading: false,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            updateToken: props.updateToken,
            navigateTo: props.navigateTo,
            showToast: props.showToast,

            dashboardType: null,
            dashboardError: false,
            dashboard: {},
        }
    }

    getDashboardType() {
        let {authenticatedUser} = this.state;
        if (authenticatedUser.roles.some(role => (role.name === RoleEnum.BAND))) {
            this.setState({dashboardType: RoleEnum.BAND});
            return true;
        } else if (authenticatedUser.roles.some(role => (role.name === RoleEnum.CONTRACTOR))) {
            this.setState({dashboardType: RoleEnum.CONTRACTOR});
            return true;
        }
        return false;
    }

    componentDidMount() {
        this.setState({isLoading: true});
        let {authenticatedUser} = this.state;

        if (!authenticatedUser) {
            this.setState({dashboardType: RoleEnum.ANON});
            return;
        }
        let hasRole = this.getDashboardType();
        if (!hasRole) {
            this.setState({dashboardType: RoleEnum.ANON});
        }
    }

    render() {
        let {dashboardError} = this.state;
        return (
            <>
                <HomeTemplate steps={['Home']}>
                    {dashboardError ? this.renderError() : this.renderDashboard()}
                </HomeTemplate>
            </>
        );
    }

    renderError() {
        return (<DashboardFailPage reload={() => this.componentDidMount()}/>);
    }

    renderDashboard() {
        let {dashboardType, dashboard, token, authenticatedUser} = this.state;
        switch (dashboardType) {
            case RoleEnum.ANON:
                return (this.renderWellCome());
            case RoleEnum.BAND:
                return (
                    <BandDashboardPage
                        dashboard={dashboard}
                        token={token}
                        user={authenticatedUser}
                    />
                );
        }
        return (<></>)
    }

    renderWellCome() {
        return (
            <Container>
                <Row>
                    <Col sm={0} md={2}/>
                    <Col sm={12} md={8}>
                        <h4 align='center' style={{marginBottom: 20, marginTop: 35}}>
                            Seja bem vindo(a) ao MyEvents!
                        </h4>
                    </Col>
                    <Col sm={0} md={2}/>
                </Row>
            </Container>
        );
    }
}

const myMapDispatchToProps = {
    updateToken: updateToken,
    updateUser: updateUser,
};
const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps, myMapDispatchToProps)(HomePage);
