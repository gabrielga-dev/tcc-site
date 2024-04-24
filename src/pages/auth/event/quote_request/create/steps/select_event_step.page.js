import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {Toast} from "primereact/toast";
import {connect} from "react-redux";
import {Col, Container, Row} from "react-bootstrap";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {DateUtil} from "../../../../../../util/date.util";
import {Button} from "primereact/button";
import {EventService} from "../../../../../../service/new/event.service";
import {EventResponse} from "../../../../../../domain/new/event/response/event.response";
import {ToastUtils} from "../../../../../../util/toast.utils";
import {EventCriteria} from "../../../../../../domain/new/event/request/event.criteria";
import {PaginationRequest} from "../../../../../../domain/new/commom/request/pagination.request";
import {Paginator} from "primereact/paginator";
import {PageResponse} from "../../../../../../domain/new/commom/response/page.response";

const SelectEventStep = ({token, user, currentStep, selectEventAction, selectedEventUuid, reference}) => {
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
            <_SelectEventStep
                ref={reference}
                token={token}
                authenticatedUser={user}
                navigateTo={redirectTo}
                showToast={showToast}
                currentStep={currentStep}
                selectedEventUuid={selectedEventUuid}
                selectEventAction={selectEventAction}
            />
        </>
    );
}

class _SelectEventStep extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            selectEventAction: props.selectEventAction,

            pagination: new PaginationRequest(5),
            pageable: new PageResponse(),

            events: [],
            selectedEventUuid: this.props.selectedEventUuid,
            currentStep: this.props.currentStep,
        }
    }

    updateStep(newStep){
        this.setState({currentStep: newStep});
    }

    componentDidMount() {
        this.findEvents();
    }

    findEvents() {
        // return
        this.setState({isLoading: true})
        let {authenticatedUser, token, pagination, showToast, navigateTo} = this.state
        EventService.FIND_BY_CRITERIA(
            new EventCriteria(authenticatedUser.uuid), pagination, token
        ).then(
            response => {
                let events = response.data.content.map(e => (new EventResponse(e)));
                this.setState({events: events, isLoading: false});
            }
        ).catch(error => {
            showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
            setTimeout(() => navigateTo('/'), 1000);
        });
    }

    render() {
        if (this.state.currentStep !== 0){
            return (<></>);
        }
        let {isLoading, events, pageable, pagination} = this.state;
        return (
            <Container>
                <Row>
                    <Col>
                        <h4>Escolha o evento:</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <DataTable
                            loading={isLoading}
                            value={events}
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
        );
    }

    renderEventDate(event) {
        let date = new Date(event.dateTimestamp);
        return DateUtil.DATE_TO_STRING(date);
    }

    renderActionsActions(event) {
        let {selectEventAction, selectedEventUuid} = this.state;
        let isSelected = event.uuid === selectedEventUuid;
        return (
            <Container>
                <Row>
                    <Col sm={12} md={4} style={{marginBottom: 10}}>
                        <Button
                            tooltip={
                                isSelected
                                    ? "Desselecionar este Evento"
                                    : "Selecionar este Evento"
                            }
                            tooltipOptions={{position: 'top'}}
                            icon={
                                isSelected
                                    ? "pi pi-check"
                                    : "pi pi-circle"
                            }
                            className={
                                isSelected
                                    ? "p-button-rounded p-button-success"
                                    : "p-button-rounded p-button-info"
                            }
                            onClick={
                                () => {
                                    if (isSelected) {
                                        this.setState({selectedEventUuid: null});
                                        selectEventAction(null);
                                    } else {
                                        this.setState({selectedEventUuid: event.uuid});
                                        selectEventAction(event.uuid);
                                    }
                                }
                            }
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
export default connect(mapStateToProps)(SelectEventStep);
