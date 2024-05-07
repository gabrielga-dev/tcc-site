import {connect} from "react-redux";
import React, {useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import {ActivityIndicatorComponent} from "../../../../../components/activity_indicator.component";
import {BandService} from "../../../../../service/new/band.service";
import axios from "axios";
import {QuoteRequestCriteria} from "../../../../../domain/new/quote_request/request/quote_request.criteria";
import {PaginationRequest} from "../../../../../domain/new/commom/request/pagination.request";
import {PageResponse} from "../../../../../domain/new/commom/response/page.response";
import HomeTemplate from "../../../../template/home_template";
import {Card} from "primereact/card";
import {Col, Container, Row} from "react-bootstrap";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {BandQuoteRequestResponse} from "../../../../../domain/new/quote_request/response/band_quote_request.response";
import {EventService} from "../../../../../service/new/event.service";
import {ToastUtils} from "../../../../../util/toast.utils";
import {QuoteRequestStatusType} from "../../../../../domain/new/quote_request/quote_request_status.type";
import {Button} from "primereact/button";
import './list_quote_request.style.css'

const ListQuoteRequestsPage = ({token, user}) => {
    let {band_uuid} = useParams();
    const toast = useRef(null);
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
            <_ListQuoteRequestsPage
                token={token}
                authenticatedUser={user}
                navigateTo={redirectTo}
                showToast={showToast}
                bandUuid={band_uuid}
            />
        </>
    );
}

class _ListQuoteRequestsPage extends React.Component {

    constructor(props) {
        super(props)

        this.addressComponentRef = React.createRef();
        this.state = {
            isMasterLoading: false,
            isLoading: false,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            bandUuid: props.bandUuid,
            bandName: '',

            eventNames: {},

            criteria: new QuoteRequestCriteria(),

            isTableLoading: false,
            bands: [],
            pagination: new PaginationRequest(5),
            pageable: new PageResponse(),
            first: 0,
        }
    }

    componentDidMount() {
        this.setIsLoadingMasterLoading(true);
        let {bandUuid, criteria, pagination, token} = this.state;

        axios.all(
            [
                BandService.FIND_QUOTE_REQUESTS(bandUuid, criteria, pagination, token),
                BandService.FIND_NAMES([bandUuid], token)
            ]
        ).then(
            responses => {
                let newPageable = new PageResponse(responses[0].data);
                let quoteRequests = responses[0].data.content.map(b => (new BandQuoteRequestResponse(b)))
                this.setState(
                    {
                        bandName: responses[1].data[bandUuid],
                        quoteRequests: quoteRequests,
                        pageable: newPageable
                    }
                );
                this.findEventNames(quoteRequests.map(qr => (qr.eventUuid)), token);
            }
        )
    }

    findEventNames(eventUuids, token) {
        this.setIsLoadingMasterLoading(false);
        let {navigateTo, showToast} = this.state;
        EventService.FIND_NAMES(eventUuids, token)
            .then(
                response => {
                    this.setState({eventNames: response.data})
                    this.setIsLoadingMasterLoading(false);
                }
            )
            .catch(
                error => {
                    showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                    navigateTo('/')
                }
            );
    }

    setIsLoading(isLoading) {
        this.setState({isLoading: isLoading});
    }

    setIsLoadingMasterLoading(isLoading) {
        this.setState({isMasterLoading: isLoading});
    }

    render() {
        if (this.state.isMasterLoading) {
            return (<ActivityIndicatorComponent/>);
        }
        let {bandName} = this.state;
        return (
            <HomeTemplate steps={['Home', 'Bandas', bandName, 'Pedidos de orçamento']}>
                <Card className='main-card'>
                    <Container>
                        <Row>
                            <Col>
                                {this.renderTable()}
                            </Col>
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    renderTable() {
        let {quoteRequests, isLoading, eventNames} = this.state;
        return (
            <DataTable
                loading={isLoading}
                value={quoteRequests}
                responsiveLayout="scroll"
                size="small"
                rowHover={true}
                emptyMessage='Nenhum pedido encontrado 😢'
            >
                <Column
                    style={{width: '20%'}}
                    header="Evento"
                    body={(qr) => (<h6>{eventNames[qr.eventUuid]}</h6>)}
                />
                <Column
                    style={{width: '20%'}}
                    header="Data"
                    body={(qr) => (<h6>{qr.creationDate}</h6>)}
                />
                <Column
                    style={{width: '20%'}}
                    header="Status"
                    body={(qr) => this.renderStatus(qr)}
                />
                <Column
                    style={{width: '40%'}}
                    header="Ações"
                    body={(qr) => this.renderActions(qr)}
                />
            </DataTable>
        );
    }

    renderActions(qr) {
        switch (qr.status) {
            case QuoteRequestStatusType.NON_ANSWERED:
                return this.renderNonAnsweredButtons(qr);
            case QuoteRequestStatusType.ACCEPTED:
                return this.renderAcceptedQuoteButtons(qr);
            case QuoteRequestStatusType.DECLINED:
                return (<h6>Nenhuma ação disponível</h6>);
        }
    }

    //todo button actions
    renderNonAnsweredButtons(qr){
        return (
            <Container>
                <Row>
                    <Col>
                        <Button
                            style={{marginRight: 20}}
                            tooltip="Negar"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-times"
                            className="p-button-rounded p-button-danger"
                        />
                        <Button
                            tooltip="Aceitar"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-check"
                            className="p-button-rounded p-button-success"
                        />
                    </Col>
                </Row>
            </Container>
        );
    }

    //todo button actions
    renderAcceptedQuoteButtons(qr) {
        return (
            <Container>
                <Row>
                    <Col>
                        <Button
                            style={{marginRight: 20}}
                            tooltip="Gerar PDF repertório"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-list"
                            className="p-button-rounded p-button-info"
                        />
                        <Button
                            style={{marginRight: 20}}
                            tooltip="Gerar PDF da escalação"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-users"
                            className="p-button-rounded p-button-info"
                        />
                        <Button
                            style={{marginRight: 20}}
                            tooltip="Gerar PDF do contrato"
                            tooltipOptions={{position: 'top'}}
                            className="contract-button"
                        />
                    </Col>
                </Row>
            </Container>
        );
    }

    renderStatus(qr) {
        switch (qr.status) {
            case QuoteRequestStatusType.NON_ANSWERED:
                return (<h6>{qr.status.translatedName}</h6>);
            case QuoteRequestStatusType.ACCEPTED:
                return (<h6 style={{color: 'green'}}>Aceito</h6>);
            case QuoteRequestStatusType.DECLINED:
                return (<h6 style={{color: 'red'}}>Negado</h6>);
        }
    }
}

const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(ListQuoteRequestsPage);
