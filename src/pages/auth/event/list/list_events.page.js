import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {Toast} from "primereact/toast";
import {connect} from "react-redux";
import {EventCriteria} from "../../../../domain/new/event/request/event.criteria";
import {ActivityIndicatorComponent} from "../../../../components/activity_indicator.component";
import HomeTemplate from "../../../template/home_template";
import {Card} from "primereact/card";
import {Col, Container, Row} from "react-bootstrap";
import {EventService} from "../../../../service/new/event.service";
import {PaginationRequest} from "../../../../domain/new/commom/request/pagination.request";
import {PageResponse} from "../../../../domain/new/commom/response/page.response";
import {EventResponse} from "../../../../domain/new/event/response/event.response";
import {ToastUtils} from "../../../../util/toast.utils";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {Paginator} from "primereact/paginator";
import {Button} from "primereact/button";
import {EventCriteriaComponent} from "../event_criteria.component";
import {DateUtil} from "../../../../util/date.util";

const ListEventsPage = ({token, user}) => {
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
            <_ListEventsPage
                token={token}
                authenticatedUser={user}
                navigateTo={redirectTo}
                showToast={showToast}
            />
        </>
    );
}

class _ListEventsPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isMasterLoading: false,
            isLoading: false,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            criteria: new EventCriteria(props.authenticatedUser.uuid),
            startDate: null,
            finalDate: null,

            events: [],
            pagination: new PaginationRequest(5),
            pageable: new PageResponse(),
            first: 0,
        }
    }

    componentDidMount() {
        this.findEvents();
    }

    setLoading(status) {
        this.setState({isLoading: status})
    }

    findEvents() {
        this.setLoading(true);
        let {criteria, pagination, token, showToast} = this.state
        EventService.FIND_BY_CRITERIA(criteria, pagination, token)
            .then(
                response => {
                    let events = response.data.content.map(e => (new EventResponse(e)));
                    this.setState({events: events});
                }
            ).catch(error => showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setLoading(false))
    }

    rowClass(event) {
        return {
            'row-accessories': !event.isActive()
        }
    }

    render() {
        if (this.state.isMasterLoading) {
            return (<ActivityIndicatorComponent/>);
        }
        let {pageable, pagination, isLoading, criteria, authenticatedUser} = this.state;
        return (
            <HomeTemplate steps={['Home', 'Eventos', 'Meus eventos']}>
                <Card>
                    <Container>
                        <Row>
                            <Col>
                                <EventCriteriaComponent
                                    criteria={criteria}
                                    isLoading={isLoading}
                                    setValues={(newCriteria) => this.setState({criteria: newCriteria})}
                                    startDate={this.state.startDate}
                                    setStartDate={(newStartDate) => this.setState({startDate: newStartDate})}
                                    finalDate={this.state.finalDate}
                                    setFinalDate={(newFinalDate) => this.setState({finalDate: newFinalDate})}
                                    ownerUuid={authenticatedUser.uuid}
                                    search={() => this.findEvents()}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <DataTable
                                    loading={isLoading}
                                    value={this.state.events}
                                    responsiveLayout="scroll"
                                    size="small"
                                    rowClassName={this.rowClass}
                                    emptyMessage='Nenhum evento encontrado 😢'
                                >
                                    <Column
                                        style={{width: '30%'}}
                                        header="Data"
                                        body={(event) => this.renderEventDate(event)}
                                    />
                                    <Column style={{width: '20%'}} field="name" header="Nome"/>
                                    <Column style={{width: '30%'}} field="description" header="Descrição"/>
                                    <Column
                                        style={{width: '20%'}}
                                        header="Ações"
                                        body={(event) => this.renderActionsActions(event)}
                                    />
                                </DataTable>
                            </Col>
                        </Row>
                        <Row>
                            <Paginator
                                first={this.state.first}
                                number={pagination.page}
                                rows={pagination.quantityPerPage}
                                totalRecords={pageable.totalElements}
                                onPageChange={(e) => {
                                    let {pagination} = this.state;
                                    pagination.page = e.page;
                                    this.setState({pagination: pagination, first: e.first})
                                    this.findEvents()
                                }}/>
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    renderEventDate(event) {
        let date = new Date(event.dateTimestamp);
        return DateUtil.DATE_TO_STRING(date);
    }

    renderActionsActions(event) {
        let {navigateTo} = this.state;
        return (
            <Container>
                <Row>
                    <Col sm={12} md={4} style={{marginBottom: 10}}>
                        <Button
                            tooltip="Visualizar perfil do Evento"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-user"
                            className="p-button-rounded p-button-info"
                            onClick={() => navigateTo(`/eventos/${event.uuid}`)}
                        />
                    </Col>
                    <Col sm={12} md={4} style={{marginBottom: 10}}>
                        <Button
                            disabled={!event.isActive()}
                            tooltip="Editar Evento"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-pencil"
                            className="p-button-rounded p-button-warning"
                            onClick={() => navigateTo(`/eventos/${event.uuid}`)}
                        />
                    </Col>
                    <Col sm={12} md={4} style={{marginBottom: 10}}>
                        <Button
                            disabled={!event.isActive()}
                            tooltip="Visualizar pedidos de orçamentos"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-dollar"
                            className="p-button-rounded p-button-success"
                            onClick={() => navigateTo(`/eventos/${event.uuid}/pedidos-orcamentos`)}
                        />
                    </Col>
                    <Col sm={12} md={4} style={{marginBottom: 10}}>
                        <Button
                            disabled={!event.isActive()}
                            tooltip="Cancelar evento"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-times"
                            className="p-button-rounded p-button-danger"
                            onClick={() => navigateTo(`/eventos/${event.uuid}/cancelar`)}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(ListEventsPage);
