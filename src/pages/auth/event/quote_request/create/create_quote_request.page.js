import React, {useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import {connect} from "react-redux";
import {ActivityIndicatorComponent} from "../../../../../components/activity_indicator.component";
import HomeTemplate from "../../../../template/home_template";
import {Card} from "primereact/card";
import {Col, Container, Row} from "react-bootstrap";
import {ToastUtils} from "../../../../../util/toast.utils";
import {BandService} from "../../../../../service/new/band.service";
import {BandProfileResponse} from "../../../../../domain/new/band/response/band_profile.response";

const CreateEventQuoteRequestPage = ({token, user}) => {
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
            <_ListEventQuoteRequestsPage
                token={token}
                authenticatedUser={user}
                navigateTo={redirectTo}
                showToast={showToast}
                bandUuid={band_uuid}
            />
        </>
    );
}

class _ListEventQuoteRequestsPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isMasterLoading: false,
            isLoading: false,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            bandUuid: props.bandUuid,
            bandProfile: null,
        }
    }

    componentDidMount() {
        this.setState({isMasterLoading: true});
        let {bandUuid, token, showToast, navigateTo} = this.state;
        BandService.FIND_PROFILE(bandUuid, token)
            .then(
                response => {
                    this.setState({bandProfile: new BandProfileResponse(response.data), isMasterLoading: false});
                }
            ).catch(
            error => {
                showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
                setTimeout(() => navigateTo('/'), 1500)
            }
        );
    }

    render() {
        if (this.state.isMasterLoading) {
            return (<ActivityIndicatorComponent/>);
        }
        let {currentEvent, navigateTo, isLoading} = this.state;
        return (
            <HomeTemplate
                steps={['Home', 'Bandas', 'Meus eventos', this.state.bandProfile?.name, 'Pedir de Orçamento']}
            >
                <Card>
                    <Container>
                        <Row>
                            <Col>
                                <h4>Escolha seu evento:</h4>
                            {/*    TODO */}
                            </Col>
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
export default connect(mapStateToProps)(CreateEventQuoteRequestPage);
