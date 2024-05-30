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
import {Paginator} from "primereact/paginator";
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import {Checkbox} from "primereact/checkbox";
import {Accordion, AccordionTab} from "primereact/accordion";
import {StyleConstants} from "../../../../../service/style.constants";
import {CalendarFieldComponent} from "../../../../../components/form/input/calendar_field.component";
import {DateUtil} from "../../../../../util/date.util";

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
            activeIndex: null,

            isTableLoading: false,
            bands: [],
            pagination: new PaginationRequest(5),
            pageable: new PageResponse(),
            first: 0,
        }
    }

    componentDidMount() {
        this.setIsLoadingMasterLoading(true);
        let {bandUuid, criteria, pagination, token, showToast, navigateTo} = this.state;

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
        ).catch(
            error => {
                showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                setTimeout(() => navigateTo('/'), 1000);
            }
        )
    }

    findQuoteRequests() {
        this.setIsLoading(true);
        let {bandUuid, criteria, pagination, token, showToast, navigateTo} = this.state;

        BandService.FIND_QUOTE_REQUESTS(bandUuid, criteria, pagination, token)
            .then(
                response => {
                    let newPageable = new PageResponse(response.data);
                    let quoteRequests = response.data.content.map(b => (new BandQuoteRequestResponse(b)))
                    this.setState(
                        {
                            quoteRequests: quoteRequests,
                            pageable: newPageable
                        }
                    );
                    this.findEventNames(quoteRequests.map(qr => (qr.eventUuid)), token);
                }
            ).catch(
            error => {
                showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                setTimeout(() => navigateTo('/'), 1000);
            }
        ).finally(() => this.setIsLoading(false))
    }

    findEventNames(eventUuids, token) {
        if (!eventUuids || eventUuids.length === 0) {
            this.setIsLoadingMasterLoading(false);
            return
        }
        let {showToast} = this.state;
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
                                {this.renderFilters()}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {this.renderTable()}
                                <ConfirmDialog/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {this.renderPaginator()}
                            </Col>
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    renderFilters() {
        let {activeIndex, criteria} = this.state;
        return (

            <Accordion
                activeIndex={activeIndex}
                onTabChange={(e) => this.setState({activeIndex: e.index})}
            >
                <AccordionTab header="Filtros">
                    <Container>
                        <Row>
                            <Col>
                                <CalendarFieldComponent
                                    label='Pedidos a partir de'
                                    optional={true}
                                    placeHolder='Pedidos relizados a partir de...'
                                    value={new Date(criteria.startDate)}
                                    onChange={newDate => {
                                        criteria.startDate = DateUtil.DATE_TO_EPOCH(newDate);
                                        this.setState({criteria: criteria});
                                    }}
                                    minDate={null}
                                    maxDate={criteria.endDate ? new Date(criteria.endDate) : null}
                                />
                            </Col>
                            <Col>
                                <CalendarFieldComponent
                                    label='Pedidos até'
                                    optional={true}
                                    placeHolder='Pedidos relizados até...'
                                    value={new Date(criteria.endDate)}
                                    onChange={newDate => {
                                        criteria.endDate = DateUtil.DATE_TO_EPOCH(newDate);
                                        this.setState({criteria: criteria});
                                    }}
                                    minDate={criteria.startDate ? new Date(criteria.startDate) : null}
                                    maxDate={null}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Checkbox
                                    inputId="status_01"
                                    value={QuoteRequestStatusType.NON_ANSWERED}
                                    onChange={(e) => {
                                        if (e.checked) {
                                            criteria.addStatus(QuoteRequestStatusType.NON_ANSWERED);
                                        } else {
                                            criteria.removeStatus(QuoteRequestStatusType.NON_ANSWERED);
                                        }
                                        this.setState({criteria: criteria});
                                    }}
                                    checked={criteria.hasStatus(QuoteRequestStatusType.NON_ANSWERED)}
                                />
                                <label htmlFor="status_01" className="p-checkbox-label">Não respondido</label>
                            </Col>
                            <Col>
                                <Checkbox
                                    inputId="status_02"
                                    value={QuoteRequestStatusType.DECLINED}
                                    onChange={(e) => {
                                        if (e.checked) {
                                            criteria.addStatus(QuoteRequestStatusType.DECLINED);
                                        } else {
                                            criteria.removeStatus(QuoteRequestStatusType.DECLINED);
                                        }
                                        this.setState({criteria: criteria});
                                    }}
                                    checked={criteria.hasStatus(QuoteRequestStatusType.DECLINED)}
                                />
                                <label htmlFor="status_02" className="p-checkbox-label">Negado</label>
                            </Col>
                            <Col>
                                <Checkbox
                                    inputId="status_02"
                                    value={QuoteRequestStatusType.ACCEPTED}
                                    onChange={(e) => {
                                        if (e.checked) {
                                            criteria.addStatus(QuoteRequestStatusType.ACCEPTED);
                                        } else {
                                            criteria.removeStatus(QuoteRequestStatusType.ACCEPTED);
                                        }
                                        this.setState({criteria: criteria});
                                    }}
                                    checked={criteria.hasStatus(QuoteRequestStatusType.ACCEPTED)}
                                />
                                <label htmlFor="status_02" className="p-checkbox-label">Aceito</label>
                            </Col>
                        </Row>
                        <Row style={{marginTop: 10}}>
                            <Col md={8} sm={0}/>
                            <Col md={2} sm={12} style={{marginBottom: 10}}>
                                <Button
                                    label='Limpar'
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    icon='pi pi-trash'
                                    className='p-button-warning'
                                    onClick={() => {
                                        this.setState({criteria: new QuoteRequestCriteria([])})
                                    }}
                                />
                            </Col>
                            <Col md={2} sm={12}>
                                <Button
                                    label='Buscar'
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    icon='pi pi-search'
                                    onClick={() => this.findQuoteRequests()}
                                />
                            </Col>
                        </Row>
                    </Container>
                </AccordionTab>
            </Accordion>
        )
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

    renderPaginator() {
        let {pagination, pageable} = this.state;
        return (
            <Paginator
                first={this.state.first}
                number={pagination.page}
                rows={pagination.quantityPerPage}
                totalRecords={pageable.totalElements}
                onPageChange={(e) => {
                    let {pagination} = this.state;
                    pagination.page = e.page;
                    this.setState({pagination: pagination, first: e.first})
                    this.findQuoteRequests()
                }}/>
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
    renderNonAnsweredButtons(qr) {
        let {navigateTo, bandUuid} = this.state;
        return (
            <Container>
                <Row>
                    <Col>
                        <Button
                            style={{marginRight: 20}}
                            tooltip="Visualizar"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-file"
                            className="p-button-rounded p-button-info"
                            onClick={
                                () => navigateTo(`/bandas/${bandUuid}/pedidos-de-orcamento/${qr.quoteRequestUuid}`)
                            }
                        />
                        <Button
                            style={{marginRight: 20}}
                            tooltip="Negar"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-times"
                            className="p-button-rounded p-button-danger"
                            onClick={
                                () => confirmDialog({
                                    message: 'Tem certeza que deseja que deseja negar este pedido de orçamento?',
                                    header: 'Negar pedido de orçamento',
                                    icon: 'pi pi-exclamation-triangle',
                                    acceptLabel: 'Sim',
                                    rejectLabel: 'Não',
                                    acceptClassName: 'p-button-danger',
                                    rejectClassName: 'p-button-success p-button-text',
                                    accept: () => this.declineQuoteRequest(qr),
                                    reject: () => {
                                    }
                                })
                            }
                        />
                        <Button
                            tooltip="Aceitar"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-check"
                            className="p-button-rounded p-button-success"
                            onClick={
                                () => confirmDialog({
                                    message: 'Deseja prosseguir para escalação da banda?',
                                    header: 'Aceitar pedido de orçamento',
                                    icon: 'pi pi-exclamation-triangle',
                                    acceptLabel: 'Sim',
                                    rejectLabel: 'Não',
                                    acceptClassName: 'p-button-success',
                                    rejectClassName: 'p-button-danger p-button-text',
                                    accept: () => {
                                        navigateTo(`/bandas/${bandUuid}/pedidos-de-orcamento/${qr.quoteRequestUuid}/escalacao`)
                                    },
                                    reject: () => {
                                    }
                                })
                            }
                        />
                    </Col>
                </Row>
            </Container>
        );
    }

    declineQuoteRequest(quoteRequest) {
        this.setIsLoading(true);
        let {token, showToast} = this.state;
        BandService.DECLINE_QUOTE_REQUEST(quoteRequest.quoteRequestUuid, token)
            .then(
                () => {
                    showToast(ToastUtils.BUILD_TOAST_SUCCESS_BODY("Pedido de orçamento negado com sucesso!"));
                    this.findQuoteRequests()
                }
            ).catch(
            error => showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
        ).finally(() => this.setIsLoading(false));

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
