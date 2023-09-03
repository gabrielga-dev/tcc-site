import React from "react";
import Cookies from "js-cookie";
import LoadingPage from "../LoadingPage";

class BandListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: Cookies.get('jwtToken'),
            isLoading: false
        }
    }

    componentDidMount() {

    }

    render() {
        let {
            token, isLoading
        } = this.state;

        if (isLoading){
            return (<LoadingPage />)
        }
        return (
            <h1>Bandas</h1>
        );
    }
}

export default BandListPage;
