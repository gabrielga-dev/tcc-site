import React, {useRef} from "react";
import {connect} from "react-redux";
import {updateToken} from "../../../service/redux/action/token.action";
import {updateUser} from "../../../service/redux/action/user.action";
import {useNavigate} from "react-router-dom";
import {Toast} from "primereact/toast";
import HomeTemplate from "../template/home_template";

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
            mainLoading: false,
            loading: false,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            updateToken: props.updateToken,
            navigateTo: props.navigateTo,
            showToast: props.showToast,
        }
    }

    render() {
        return (
            <>
                <HomeTemplate steps={['Home']}>
                    <h1>Hello</h1>
                </HomeTemplate>
            </>
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
