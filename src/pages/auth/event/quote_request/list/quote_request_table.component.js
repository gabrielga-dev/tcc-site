import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {ToastUtils} from "../../../../../util/toast.utils";
import {Button} from "primereact/button";
import {QuoteRequestStatusType} from "../../../../../domain/new/quote_request/quote_request_status.type";
import {confirmDialog} from "primereact/confirmdialog";
import {EventService} from "../../../../../service/new/event.service";
import {FileUtil} from "../../../../../util/file.util";

export const QuoteRequestsTableComponent = (
    {
        type,
        quoteRequests = [],
        isLoading = false,
        token = '',
        showToast, navigateTo,
        hireQuote = (q, type) => {
            console.log(q, type)
        },
        declineQuote = (q, type) => {
            console.log(q, type)
        },
    }
) => (
    <_QuoteRequestsTableComponent
        type={type}
        quoteRequests={quoteRequests}
        isLoading={isLoading}
        token={token}
        showToast={showToast}
        navigateTo={navigateTo}
        hireQuote={hireQuote}
        declineQuote={declineQuote}
    />
);

class _QuoteRequestsTableComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            token: props.token,
            showToast: props.showToast,
            navigateTo: props.navigateTo,

            hireQuote: props.hireQuote,
            declineQuote: props.declineQuote,

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
            if (uuids.length > 0) {
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
        let {hireQuote, declineQuote, token, showToast} = this.state;
        switch (quoteRequest.status) {
            case QuoteRequestStatusType.ANSWERED:
                return (
                    <Col style={{marginBottom: 10}}>
                        <Button
                            tooltip="Visualizar resposta"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-eye"
                            className="p-button-rounded p-button-info"
                            onClick={
                                () => confirmDialog({
                                    header: 'Visualizar resposta',
                                    message: `Preço: ${quoteRequest.price} \n ${quoteRequest.observation}`,
                                    icon: 'pi pi-info-circle',
                                    acceptLabel: 'Contratar',
                                    acceptClassName: 'p-button-success',
                                    accept: () => hireQuote(quoteRequest),
                                    rejectLabel: 'Não contratar ainda',
                                    rejectClassName: 'p-button-danger p-button-text',
                                    reject: () => {
                                    }
                                })
                            }
                        />
                        <Button
                            style={{marginLeft: 5}}
                            tooltip="Contratar"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-check"
                            className="p-button-rounded p-button-success"
                            onClick={
                                () => confirmDialog({
                                    header: 'Contratar orçamento',
                                    message: `Você deseja contratar o orçamento de preço ${quoteRequest.price}?`,
                                    icon: 'pi pi-info-circle',
                                    acceptLabel: 'Contratar',
                                    acceptClassName: 'p-button-success',
                                    accept: () => hireQuote(quoteRequest),
                                    rejectLabel: 'Não contratar ainda',
                                    rejectClassName: 'p-button-danger',
                                    reject: () => {
                                    }
                                })
                            }
                        />
                        <Button
                            style={{marginLeft: 5}}
                            tooltip="Rejeitar"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-times"
                            className="p-button-rounded p-button-danger"
                            onClick={
                                () => confirmDialog({
                                    header: 'Rejeitar',
                                    message: `Você deseja rejeitar o orçamento de ${quoteRequest.price}?`,
                                    icon: 'pi pi-info-circle',
                                    acceptLabel: 'Rejeitar',
                                    acceptClassName: 'p-button-danger',
                                    accept: () => declineQuote(quoteRequest),
                                    rejectLabel: 'Não rejeitar ainda',
                                    rejectClassName: 'p-button-success p-button-text',
                                    reject: () => {
                                    }
                                })
                            }
                        />
                    </Col>
                );
            case QuoteRequestStatusType.HIRED:
                return (
                    <Button
                        style={{marginLeft: 5}}
                        tooltip="Baixar contrato"
                        tooltipOptions={{position: 'top'}}
                        icon="pi pi-file-pdf"
                        className="p-button-rounded p-button-danger"
                        onClick={
                            () => {
                                EventService.GENERATE_CONTRACT(quoteRequest.quoteRequestUuid, token)
                                    .then(
                                        response => {
                                            showToast(ToastUtils.BUILD_TOAST_SUCCESS_BODY('Contrato gerado com sucesso!'))
                                            FileUtil.DOWNLOAD_PDF('contrato.pdf', response.data);
                                        }
                                    ).catch(
                                        error => showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
                                    )
                            }
                        }
                    />
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
