import {useNavigate, useParams} from "react-router-dom";
import React, {useRef} from "react";
import {Toast} from "primereact/toast";
import {ActivityIndicatorComponent} from "../../../../../components/activity_indicator.component";
import HomeTemplate from "../../../../template/home_template";
import {Card} from "primereact/card";
import {Col, Container, Row} from "react-bootstrap";
import {connect} from "react-redux";
import axios from "axios";
import {BandService} from "../../../../../service/new/band.service";
import {ToastUtils} from "../../../../../util/toast.utils";
import {EventService} from "../../../../../service/new/event.service";
import {Accordion, AccordionTab} from "primereact/accordion";
import {EventResponse} from "../../../../../domain/new/event/response/event.response";
import {TextFieldComponent} from "../../../../../components/form/input/text_field.component";
import {DateUtil} from "../../../../../util/date.util";
import {TextAreaComponent} from "../../../../../components/form/input/text_area.component";
import {DataTable} from "primereact/datatable";
import {
    BriefBandQuoteRequestResponse
} from "../../../../../domain/new/quote_request/response/brief/brief_band_quote_request.response";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {StyleConstants} from "../../../../../service/style.constants";
import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";
import {FileUtil} from "../../../../../util/file.util";

const BriefQuoteRequestPage = ({token, user}) => {
    let {band_uuid, quote_uuid} = useParams();
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
            <_BriefQuoteRequestPage
                token={token}
                authenticatedUser={user}
                navigateTo={redirectTo}
                showToast={showToast}
                bandUuid={band_uuid}
                quote_uuid={quote_uuid}
            />
        </>
    );
}

class _BriefQuoteRequestPage extends React.Component {

    constructor(props) {
        super(props)

        this.addressComponentRef = React.createRef();
        this.state = {
            isMasterLoading: true,
            isLoading: false,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            bandUuid: props.bandUuid,
            bandName: '',
            quoteUuid: props.quote_uuid,
            quoteRequest: null,
            event: new EventResponse(),
        }
    }

    setIsLoading(isLoading) {
        this.setState({isLoading: isLoading});
    }

    setIsLoadingMasterLoading(isLoading) {
        this.setState({isMasterLoading: isLoading});
    }

    componentDidMount() {
        this.setIsLoadingMasterLoading(true);
        let {bandUuid, quoteUuid, token, showToast, navigateTo} = this.state;

        axios.all(
            [
                BandService.FIND_QUOTE_REQUEST_BY_UUID(quoteUuid, token),
                BandService.FIND_NAMES([bandUuid], token),
            ]
        ).then(
            responses => {
                let quoteRequest = new BriefBandQuoteRequestResponse(responses[0].data);
                this.setState({quoteRequest: quoteRequest, bandName: responses[1].data[bandUuid]});
                this.findEventNames(quoteRequest.eventUuid, token);
            }
        ).catch(
            error => {
                showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                setTimeout(() => navigateTo('/'), 1000);
            }
        )
    }

    findEventNames(eventUuid, token) {
        let {showToast, navigateTo} = this.state;
        EventService.FIND_BY_UUID(eventUuid, token)
            .then(
                response => {
                    this.setState({event: new EventResponse(response.data)});
                    this.setIsLoadingMasterLoading(false);
                }
            )
            .catch(
                error => {
                    showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                    setTimeout(() => navigateTo('/'), 1000);
                }
            );
    }

    declineQuoteRequest(quoteRequestUuid) {
        this.setIsLoading(true);
        let {token, showToast, navigateTo, bandUuid} = this.state;
        BandService.DECLINE_QUOTE_REQUEST(quoteRequestUuid, token)
            .then(
                () => {
                    showToast(ToastUtils.BUILD_TOAST_SUCCESS_BODY("Pedido de orçamento negado com sucesso!"));
                    navigateTo(`/bandas/${bandUuid}/pedidos-de-orcamento`);
                }
            ).catch(
            error => showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
        ).finally(() => this.setIsLoading(false));

    }

    render() {
        if (this.state.isMasterLoading) {
            return (<ActivityIndicatorComponent/>);
        }
        let {bandName, event} = this.state;
        return (
            <HomeTemplate steps={['Home', 'Bandas', bandName, 'Pedidos de orçamento', event.name]}>
                <Card className='main-card'>
                    <Container>
                        <ConfirmDialog/>
                        {this.renderBaseActions()}
                        <Row>
                            <Col>
                                {this.renderEventInfo()}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {this.renderPlaylist()}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {this.renderMusicianTypes()}
                            </Col>
                        </Row>
                        {this.renderBaseActions()}
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    renderBaseActions(){
        let {quoteUuid} = this.state;
        return(
            <Row>
                <Col md={8} sm={0}/>
                <Col md={2} sm={12}>
                    <Button
                        style={StyleConstants.WIDTH_100_PERCENT}
                        className="p-button-danger"
                        tooltip="Negar"
                        icon="pi pi-times"
                        label="Negar"
                        tooltipOptions={{position: 'top'}}
                        onClick={
                            () => confirmDialog({
                                message: 'Tem certeza que deseja que deseja negar este pedido de orçamento?',
                                header: 'Negar pedido de orçamento',
                                icon: 'pi pi-exclamation-triangle',
                                acceptClassName: 'p-button-danger',
                                rejectClassName: 'p-button-success p-button-text',
                                accept: () => this.declineQuoteRequest(quoteUuid),
                                reject: () => {
                                }
                            })
                        }
                    />
                </Col>
                <Col md={2} sm={12}>
                    <Button
                        style={StyleConstants.WIDTH_100_PERCENT}
                        className="p-button-success"
                        tooltip="Aceitar"
                        icon="pi pi-check"
                        label="Aceitar"
                        tooltipOptions={{position: 'top'}}
                    />
                </Col>
            </Row>
        );
    }

    renderEventInfo() {
        let {event} = this.state;
        return (
            <Accordion activeIndex={0}>
                <AccordionTab header="Evento">
                    <Container>
                        <Row>
                            <Col>
                                <TextFieldComponent
                                    disabled={true}
                                    optional={true}
                                    label='Nome'
                                    value={event.name}
                                />
                            </Col>
                            <Col>
                                <TextFieldComponent
                                    disabled={true}
                                    optional={true}
                                    label='Data'
                                    value={DateUtil.DATE_TO_STRING(new Date(event.dateTimestamp))}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <TextAreaComponent
                                    disabled={true}
                                    optional={true}
                                    label='Endereço'
                                    value={event.address.format()}
                                />
                            </Col>
                        </Row>
                    </Container>
                </AccordionTab>
            </Accordion>
        );
    }

    renderPlaylist() {
        let {quoteRequest} = this.state;
        return (
            <Accordion activeIndex={0}>
                <AccordionTab header="Repertório">
                    <Container>
                        <Row>
                            <Col md={11} sm={0}/>
                            <Col md={1} sm={12}>
                                <Button
                                    className="p-button-danger"
                                    icon='pi pi-file-pdf'
                                    tooltip='Baixar PDF'
                                    tooltipOptions={{position: 'top'}}
                                    onClick={() => this.downloadPlaylistPdf()}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <DataTable
                                    value={quoteRequest.playlist}
                                >
                                    <Column
                                        style={{width: '5%'}}
                                        header="#"
                                        field="order"
                                    />
                                    <Column
                                        style={{width: '20%'}}
                                        header="Nome"
                                        field="musicName"
                                    />
                                    <Column
                                        style={{width: '20%'}}
                                        header="Artista"
                                        field="musicArtist"
                                    />
                                    <Column
                                        style={{width: '20%'}}
                                        header="Autor"
                                        field="musicAuthor"
                                    />
                                    <Column
                                        style={{width: '35%'}}
                                        header="Observação"
                                        field="observation"
                                    />
                                </DataTable>
                            </Col>
                        </Row>
                    </Container>
                </AccordionTab>
            </Accordion>
        );
    }

    downloadPlaylistPdf(){
        let {quoteUuid, token, showToast} = this.state;

        showToast(ToastUtils.BUILD_TOAST_INFO_BODY('Arquivo solicitado!'));
        BandService.DOWNLOAD_PLAYLIST_PDF(quoteUuid, token)
            .then(response => {
                FileUtil.DOWNLOAD_PDF('playlist.pdf', response.data);
            }).catch(error => showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)));
    }

    renderMusicianTypes() {
        let {quoteRequest} = this.state;
        return (
            <Accordion activeIndex={0}>
                <AccordionTab header="Tipos de músicos">
                    <Container>
                        <Row>
                            <Col>
                                <DataTable
                                    value={quoteRequest.wantedMusicianTypes}
                                >
                                    <Column
                                        style={{width: '20%'}}
                                        header="Nome"
                                        field="musicianTypeName"
                                    />
                                    <Column
                                        style={{width: '30%'}}
                                        header="Quantidade"
                                        field="quantity"
                                    />
                                    <Column
                                        style={{width: '50%'}}
                                        header="Observação"
                                        field="observation"
                                    />
                                </DataTable>
                            </Col>
                        </Row>
                    </Container>
                </AccordionTab>
            </Accordion>
        );
    }
}


const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(BriefQuoteRequestPage);
