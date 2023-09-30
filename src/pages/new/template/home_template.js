import React from "react";
import {useNavigate} from "react-router-dom";
import {updateToken} from "../../../service/redux/action/token.action";
import {connect} from "react-redux";
import {ActivityIndicatorComponent} from "../../../components/activity_indicator.component";
import MenuLateralComponent from "../../../components/menu_lateral.component";
import BarraSuperiorComponent from "../../../components/barraSuperior/barra_superior.component";
import {Container} from "react-bootstrap";
import {PaddingStyle} from "../../../style/padding.style";
import {BreadcrumbComponent} from "../../../components/breadcrumb.component";

const HomeTemplate = ({token, user, updateToken, children, steps}) => {
    const navigate = useNavigate();
    const redirectTo = (route) => {
        navigate(route);
    };
    return (
        <_HomeTemplate
            token={token}
            updateToken={updateToken}
            navigateTo={redirectTo}
            children={children}
            steps={steps}
            authenticatedUser={user}
        />
    );
}

class _HomeTemplate extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            showMenu: false,
            steps: props.steps,
            authenticatedUser: props.authenticatedUser,
            token: props.token,
            updateToken: props.updateToken,
            navigateTo: props.redirectTo,
        }
    }

    render() {
        let {authenticatedUser, loading} = this.state
        if (loading) {
            return (<ActivityIndicatorComponent/>);
        }
        return(
            <>
                <BarraSuperiorComponent
                    openLateralMenu={() => this.setState({showMenu: true})}
                    authenticatedUser={authenticatedUser}
                />
                <MenuLateralComponent
                    showMenu={this.state.showMenu}
                    toggleVisionMenu={(state) => {
                        this.setState({showMenu: !state})
                    }}
                />
                <div style={PaddingStyle.makePadding(10)}>
                    <BreadcrumbComponent passos={this.state.steps}/>
                </div>
                <Container>
                    {this.props.children}
                </Container>
            </>
        );
    }
}

const myMapDispatchToProps = {
    updateToken: updateToken,
};
const mapStateToProps = state => (state);

export default connect(mapStateToProps, myMapDispatchToProps)(HomeTemplate);
