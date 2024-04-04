import React, {useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import {ActivityIndicatorComponent} from "../../../../components/activity_indicator.component";
import HomeTemplate from "../../../template/home_template";
import {Card} from "primereact/card";
import {Col, Container, Row} from "react-bootstrap";
import {EventResponse} from "../../../../domain/new/event/response/event.response";
import {EventService} from "../../../../service/new/event.service";
import {ToastUtils} from "../../../../util/toast.utils";
import {connect} from "react-redux";
import {Button} from "primereact/button";
import {StyleConstants} from "../../../../service/style.constants";

const CancelEventPage = ({token, user}) => {
    const toast = useRef(null);
    const showToast = (body) => {
        toast.current.show(body);
    };
    let {event_uuid} = useParams();

    const navigate = useNavigate();
    const redirectTo = (route) => {
        navigate(route);
    };
    return (
        <>
            <Toast ref={toast} id="toast"/>
            <_CancelEventPage
                token={token}
                authenticatedUser={user}
                navigateTo={redirectTo}
                showToast={showToast}
                eventUuid={event_uuid}
            />
        </>
    );
}

class _CancelEventPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isMasterLoading: false,
            isLoading: false,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            eventUuid: props.eventUuid,
            currentEvent: new EventResponse(),
        }
    }

    componentDidMount() {
        this.setState({isMasterLoading: true});

        let {eventUuid, token, showToast, navigateTo} = this.state;
        EventService.FIND_BY_UUID(eventUuid, token)
            .then(
                response => {
                    let eventResponse = new EventResponse(response.data);
                    this.setState({currentEvent: eventResponse, isMasterLoading: false});
                }
            ).catch(
            error => {
                showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                setTimeout(() => navigateTo('/'), 1000);
            }
        );
    }

    render() {
        if (this.state.isMasterLoading) {
            return (<ActivityIndicatorComponent/>);
        }
        let {currentEvent, navigateTo, isLoading} = this.state;
        return (
            <HomeTemplate steps={['Home', 'Eventos', 'Meus eventos', currentEvent.name, 'Cancelar']}>
                <Card>
                    <Container>
                        <Row>
                            <Col>
                                <h3>Deseja cancelar o evento {currentEvent.name}?</h3>
                                <p>Lembre-se que esta ação não pode ser desfeita!</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    disabled={isLoading}
                                    label='Não'
                                    icon='pi pi-times'
                                    className="p-button-success"
                                    onClick={() => navigateTo('/eventos')}
                                />
                            </Col>
                            <Col>
                                <Button
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    disabled={isLoading}
                                    label='Sim'
                                    icon='pi pi-trash'
                                    className="p-button-danger"
                                    onClick={() => this.cancelEvent()}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    cancelEvent() {
        this.setState({isLoading: true});
        let {eventUuid, token, showToast, navigateTo} = this.state;
        EventService.CANCEL(eventUuid, token)
            .then(
                () => {
                    showToast(ToastUtils.BUILD_TOAST_SUCCESS_BODY('Evento cancelado com sucesso!'));
                    setTimeout(() => navigateTo('/eventos'), 1000);
                }
            ).catch(
            error => {
                showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                setTimeout(() => navigateTo('/'), 1000);
            }
        );
    }
}

const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(CancelEventPage);
