import React, {useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import {connect} from "react-redux";
import {EventResponse} from "../../../../../domain/new/event/response/event.response";
import {EventService} from "../../../../../service/new/event.service";
import {ToastUtils} from "../../../../../util/toast.utils";
import {ActivityIndicatorComponent} from "../../../../../components/activity_indicator.component";
import HomeTemplate from "../../../../template/home_template";
import {Card} from "primereact/card";
import {Container} from "react-bootstrap";
import {QuoteRequestService} from "../../../../../service/new/quote_request.service";
import {QuoteRequestTypeResponse} from "../../../../../domain/new/quote_request/response/quote_request_type.response";
import {QuoteRequestsTableComponent} from "./quote_request_table.component";

const ListEventQuoteRequestsPage = ({token, user}) => {
    const toast = useRef(null);

    let {event_uuid} = useParams();
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
                eventUuid={event_uuid}
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

            eventUuid: props.eventUuid,
            currentEvent: new EventResponse(),

            quoteRequestTypes: [],
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
                    this.findQuoteRequests()
                }
            ).catch(
            error => {
                showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                setTimeout(() => navigateTo('/'), 1000);
            }
        );
    }

    findQuoteRequests() {
        this.setState({isLoading: true});
        let {eventUuid, token, showToast, navigateTo} = this.state;
        QuoteRequestService.FIND_ALL(eventUuid, token)
            .then(
                response => {
                    let quoteRequestTypes = response.data.map(q => (new QuoteRequestTypeResponse(q)));
                    this.setState({quoteRequestTypes: quoteRequestTypes, isLoading: false});
                }
            ).catch(
            error => {
                showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                setTimeout(() => navigateTo('/eventos'), 1000);
            }
        );
    }

    render() {
        if (this.state.isMasterLoading) {
            return (<ActivityIndicatorComponent/>);
        }
        let {currentEvent, navigateTo, isLoading} = this.state;
        return (
            <HomeTemplate steps={['Home', 'Eventos', 'Meus eventos', currentEvent.name, 'Pedidos de Orçamento']}>
                <Card>
                    <Container>
                        {this.renderQuoteRequestTables()}
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    renderQuoteRequestTables() {
        return this.state.quoteRequestTypes.map(
            type => (
                <QuoteRequestsTableComponent
                    key={type.serviceType.translatedName}
                    type={type.serviceType}
                    quoteRequests={type.quoteRequests}
                    isLoading={this.state.isLoading}
                    token={this.state.token}
                />
            )
        );
    }
}

const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(ListEventQuoteRequestsPage);
