import React, {useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import {ActivityIndicatorComponent} from "../../../../components/activity_indicator.component";
import HomeTemplate from "../../../template/home_template";
import {Container, Row} from "react-bootstrap";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {connect} from "react-redux";

export const CreateMusicPage = ({token, user}) => {
    const toast = useRef(null);
    let {band_uuid} = useParams();
    const showToast = (body) => {
        toast.current.show(body);
    };

    const navigate = useNavigate();
    const redirectTo = (route) => {
        navigate(route);
    };
    return (
        <>
            <Toast ref={toast} id="toast"/>
            <_CreateMusicPage
                token={token}
                authenticatedUser={user}
                navigateTo={redirectTo}
                showToast={showToast}
                bandUuid={band_uuid}
            />
        </>
    );
}

class _CreateMusicPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bandUuid: props.bandUuid,
            isMasterLoading: false,
            isLoading: false,
            token: props.token,
            authenticatedUser: props.authenticatedUser,
            navigateTo: props.navigateTo,
            showToast: props.showToast,
        }
    }

    render() {
        let {isMasterLoading} = this.state;
        if (isMasterLoading) {
            return (<ActivityIndicatorComponent/>)
        }
        return (
            <HomeTemplate steps={['Home', 'Bandas', this.state.bandProfile?.name, 'Gerenciar Músicos']}>
                <Card>
                    <Container>
                        <Row>
                            <Button
                                label='test'
                            />
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }
}

const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(CreateMusicPage);
