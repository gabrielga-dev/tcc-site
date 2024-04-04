import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {ServiceType} from "../../../../../domain/new/quote_request/service.type";
import {ToastUtils} from "../../../../../util/toast.utils";
import {Button} from "primereact/button";
import {QuoteRequestStatusType} from "../../../../../domain/new/quote_request/quote_request_status.type";

export const QuoteRequestsTableComponent = (
    {
        type = ServiceType.BAND,
        quoteRequests = [],
        isLoading = false,
        token = '',
        showToast, navigateTo
    }
) => (
    <_QuoteRequestsTableComponent
        type={type}
        quoteRequests={quoteRequests}
        isLoading={isLoading}
        token={token}
        showToast={showToast}
        navigateTo={navigateTo}
    />
);

class _QuoteRequestsTableComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            token: props.token,
            showToast: props.showToast,
            navigateTo: props.navigateTo,

            type: props.type,
            quoteRequests: props.quoteRequests,
            isLoading: props.isLoading,
            isLocalLoading: false,
            names: {},
        }
    }

    componentDidMount() {
        this.setState({isLocalLoading: true});
        let {type, quoteRequests, token, showToast, navigateTo} = this.state;

        if (type.service) {
            let uuids = quoteRequests.map(r => r.serviceUuid);
            type.service.FIND_NAMES(uuids, token)
                .then(
                    response => {
                        this.setState({names: response.data, isLocalLoading: false});
                    }
                ).catch(
                error => {
                    showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                    setTimeout(() => navigateTo('/eventos'), 1000);
                }
            );
        } else {
            this.setState({isLocalLoading: false});
        }
    }

    render() {
        let {quoteRequests, isLoading, isLocalLoading, type, names} = this.state;
        return (
            <Row>
                <Col>
                    <h1>{type.translatedName}</h1>
                    <DataTable
                        value={quoteRequests}
                        scrollable
                        scrollHeight="400px"
                        loading={isLoading || isLocalLoading}
                        scrollDirection="vertical"
                        className="mt-3"
                        emptyMessage="Nenhum pedido de orçamento registrado."
                        size='small'
                        rowHover={true}
                    >
                        <Column
                            header="Nome"
                            style={{width: '160px'}}
                            frozen
                            body={(quoteRequest) => (names[quoteRequest.serviceUuid])}
                        />
                        <Column
                            header="Status"
                            field="statusDescription"
                            style={{width: '50px'}}
                            frozen
                        />
                        <Column
                            header="Ações"
                            style={{width: '100px'}}
                            frozen
                            body={
                                (quoteRequest) => (
                                    <Container>
                                        <Row>
                                            {this.renderActions(quoteRequest)}
                                        </Row>
                                    </Container>
                                )
                            }
                        />
                    </DataTable>
                </Col>
            </Row>
        );
    }

    renderActions(quoteRequest) {
        let {navigateTo, eventUuid} = this.state;
        switch (quoteRequest.status) {
            case QuoteRequestStatusType.ACCEPTED:
                return (
                    <Col sm={12} md={4} style={{marginBottom: 10}}>
                        <Button
                            tooltip="Visualizar perfil do Evento"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-user"
                            className="p-button-rounded p-button-info"
                            onClick={() => navigateTo(`/eventos/${eventUuid}/quote-request/${quoteRequest.quoteUuid}`)}
                        />
                    </Col>
                );
            default:
                return (
                    <Col>
                        <p style={{marginTop: 10}}>Nenhuma ação disponível</p>
                    </Col>
                );
        }
    }
}
