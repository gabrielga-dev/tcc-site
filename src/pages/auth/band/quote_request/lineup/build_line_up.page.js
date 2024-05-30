import {useNavigate, useParams} from "react-router-dom";
import React, {useRef} from "react";
import {Toast} from "primereact/toast";
import {connect} from "react-redux";
import axios from "axios";
import {BandService} from "../../../../../service/new/band.service";
import {ToastUtils} from "../../../../../util/toast.utils";
import {
    BriefBandQuoteRequestResponse
} from "../../../../../domain/new/quote_request/response/brief/brief_band_quote_request.response";
import {MusicianResponse} from "../../../../../domain/new/musician/response/musician.response";
import {ActivityIndicatorComponent} from "../../../../../components/activity_indicator.component";
import HomeTemplate from "../../../../template/home_template";
import {Card} from "primereact/card";
import {Col, Container, Row} from "react-bootstrap";
import {EventService} from "../../../../../service/new/event.service";
import {WantedMusicianTypeDto} from "../../../../../domain/new/quote_request/wanted_musician_type.dto";
import {Knob} from "primereact/knob";
import './build_line_up.style.css';
import {PickList} from "primereact/picklist";
import {StyleConstants} from "../../../../../service/style.constants";
import {FileService} from "../../../../../service/new/file.service";
import {Tag} from "primereact/tag";
import {FormEndingComponent} from "../../../../../components/form_ending.component";
import {NumericFieldComponent} from "../../../../../components/form/input/numeric_field.component";
import {TextAreaComponent} from "../../../../../components/form/input/text_area.component";
import {AnswerQuoteRequestRequest} from "../../../../../domain/new/quote_request/request/answer_quote_request.request";

const BuildLineupPage = ({token, user}) => {
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
            <_BuildLineupPage
                token={token}
                authenticatedUser={user}
                navigateTo={redirectTo}
                showToast={showToast}
                bandUuid={band_uuid}
                quoteRequestUuid={quote_uuid}
            />
        </>
    );
}

class _BuildLineupPage extends React.Component {

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

            quoteRequestUuid: props.quoteRequestUuid,
            eventName: 'x',

            bandUuid: props.bandUuid,
            bandName: '',

            wantedMusicianTypesProgresses: new Map(),
            availableMusicians: [],
            lineupRequest: [],

            finalValue: 0,
            observation: '',
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
        let {bandUuid, quoteRequestUuid, token, showToast, navigateTo} = this.state;

        axios.all(
            [
                BandService.FIND_QUOTE_REQUEST_BY_UUID(quoteRequestUuid, token),
                BandService.FIND_NAMES([bandUuid], token),
                BandService.FIND_ALL_MUSICIANS(bandUuid, token),
            ]
        ).then(
            responses => {
                let quoteRequest = new BriefBandQuoteRequestResponse(responses[0].data);

                let {wantedMusicianTypesProgresses} = this.state;
                responses[0].data.wantedMusicianTypes.map(
                    m => (new WantedMusicianTypeDto(m))
                ).forEach(
                    mt => {
                        wantedMusicianTypesProgresses.set(mt.typeUuid, mt);
                    }
                );

                this.setState(
                    {
                        quoteRequest: quoteRequest,
                        wantedMusicianTypesProgresses: wantedMusicianTypesProgresses,
                        bandName: responses[1].data[bandUuid],
                        availableMusicians: responses[2].data.map(m => (new MusicianResponse(m)))
                    }
                );
                this.findEventName(quoteRequest.eventUuid)
            }
        ).catch(
            error => {
                showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                setTimeout(() => navigateTo('/'), 1000);
            }
        )
    }

    findEventName(eventUuid) {
        let {token, showToast, navigateTo} = this.state;
        EventService.FIND_NAMES([eventUuid], token)
            .then(
                response => {
                    this.setState({eventName: response.data[eventUuid]});
                    this.setIsLoadingMasterLoading(false);
                }
            ).catch(
            error => {
                showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                setTimeout(() => navigateTo('/'), 1000);
            }
        )
    }

    submitForm() {
        let {finalValue, observation, showToast} = this.state;

        if (finalValue < 0) {
            showToast(ToastUtils.BUILD_TOAST_FORM_ERROR('Valor final inváilido!', 'Digite um valor final válido.'))
            return
        }
        if (observation && observation.length > 1500) {
            showToast(ToastUtils.BUILD_TOAST_FORM_ERROR(
                'Observações inváilidas!',
                'Descreva as observações com até 1500 caracteres.')
            );
            return;
        }
        let {wantedMusicianTypesProgresses, lineupRequest} = this.state;
        let error = null;
        wantedMusicianTypesProgresses.forEach(progress => {
            if (progress.wanted > progress.current) {
                error = ToastUtils.BUILD_TOAST_FORM_ERROR(
                    `Falta(m) músico(s) do tipo ${progress.typeName}!`,
                    `Por favor, adicione mais músicos do tipo ${progress.typeName}, ou cadastre/vincule mais à banda.`
                )
                return;
            }
        });
        if (error) {
            showToast(error);
        }

        let request = new AnswerQuoteRequestRequest(finalValue, observation, lineupRequest);

        let {quoteRequestUuid, token, navigateTo, bandUuid} = this.state;
        this.setState({isLoading: true});
        BandService.ANSWER_QUOTE_REQUEST(quoteRequestUuid, request, token)
            .then(
                () => {
                    showToast(ToastUtils.BUILD_TOAST_SUCCESS_BODY('Orçamento enviado!'));
                    setTimeout(() => navigateTo(`/bandas/${bandUuid}/pedidos-de-orcamento`), 2000)
                }
            ).catch(
                error => {
                    showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                    this.setState({isLoading: false});
                }
        )
    }

    render() {
        if (this.state.isMasterLoading) {
            return (<ActivityIndicatorComponent/>);
        }
        let {bandName, eventName, isLoading} = this.state;
        return (
            <HomeTemplate steps={['Home', 'Bandas', bandName, 'Pedidos de orçamento', eventName, 'Montar escalação']}>
                <Card className='main-card'>
                    <Container>
                        <Row>
                            {this.renderWantedMusicianTypes()}
                        </Row>
                        <Row>
                            {this.renderMusicianSelection()}
                        </Row>
                        {this.renderFields()}
                        <Row>
                            <Col sm={0} md={8}/>
                            <Col sm={12} md={4}>
                                <FormEndingComponent
                                    showSecond={false}
                                    showFirst={false}
                                    onClickThird={() => this.submitForm()}
                                    disableThird={isLoading}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    renderWantedMusicianTypes() {
        let {wantedMusicianTypesProgresses} = this.state;
        return Array.from(wantedMusicianTypesProgresses.values())
            .map(
                wm => (
                    <Col sm={6} md={3} className='text-center'>
                        <h5>{wm.typeName}</h5>
                        <Knob size={75} value={wm.current} max={wm.wanted} readOnly={true}/>
                        {
                            (wm.quantityNotSpecified)
                                ? (<span style={{fontSize: 8}}>Quantidade não especificada</span>)
                                : (<></>)
                        }
                        {
                            (wm.observation && wm.observation.length > 0)
                                ? (<span><b>Obs.:</b> {wm.observation}</span>)
                                : (<></>)
                        }
                    </Col>
                )
            );
    }

    updateMusicianTypesWanted(lineup = []) {
        let {wantedMusicianTypesProgresses} = this.state;

        wantedMusicianTypesProgresses.forEach(progress => {
            progress.current = 0;
            if (progress.quantityNotSpecified) {
                progress.wanted = 1;
            }
        });

        lineup.forEach(
            musician => {
                musician.types.forEach(
                    type => {
                        let progress = wantedMusicianTypesProgresses.get(type.uuid)
                        if (progress) {
                            if (progress.quantityNotSpecified) {
                                progress.current += 1;
                                progress.wanted = progress.current;
                            } else if (progress.wanted > progress.current) {
                                progress.current += 1
                            }
                        }
                    }
                )
            }
        );

        this.setState({wantedMusicianTypesProgresses: wantedMusicianTypesProgresses})
    }

    renderMusicianSelection() {
        let {availableMusicians, lineupRequest, isLoading} = this.state;
        return (
            <Col>
                <h4>Selecione os músicos:</h4>
                <PickList
                    e
                    source={availableMusicians}
                    target={lineupRequest}
                    onChange={
                        (event) => {
                            if (!isLoading) {
                                this.setState(
                                    {availableMusicians: event.source, lineupRequest: event.target}
                                );
                                this.updateMusicianTypesWanted(event.target)
                            }
                        }
                    }
                    itemTemplate={(item) => (this.musicianTemplate(item))}
                />
            </Col>
        );
    }

    musicianTemplate(musician) {
        return (
            <Container>
                <Row>
                    <Col sm={4}>
                        <img
                            style={StyleConstants.SM_IMAGE_STYLE}
                            alt={`Imagem do(a) músico(ista) ${musician.firstName}`}
                            src={FileService.GET_IMAGE_URL(musician.avatarUuid)}
                            onError={(e) => e.target.src = '/images/band_default_icon.png'}
                        />
                    </Col>
                    <Col sm={8}>
                        <Row>
                            <Col>
                                <h6>{musician.firstName} {musician.lastName}</h6>
                                {
                                    musician.types.map(
                                        type => (
                                            <Tag
                                                key={`${musician.uuid}-${type.name}`}
                                                value={type.name}
                                                rounded
                                            />
                                        )
                                    )
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }

    renderFields() {
        let {finalValue, observation, isLoading} = this.state;
        return (
            <>
                <Row>
                    <Col sm={0} md={2}/>
                    <Col>
                        <NumericFieldComponent
                            disabled={isLoading}
                            label='Valor final'
                            placeHolder='Digite aqui o valor do orçamento'
                            value={finalValue}
                            min={0}
                            onChange={(newValue) => this.setState({finalValue: newValue})}
                            onBlur={() => {
                            }}
                        />
                    </Col>
                    <Col sm={0} md={2}/>
                </Row>
                <Row>
                    <Col sm={0} md={2}/>
                    <Col>
                        <TextAreaComponent
                            disabled={isLoading}
                            label='Observações'
                            optional={true}
                            placeHolder='Digite aqui qualquer observação'
                            value={observation}
                            maxLength={1500}
                            onChange={(newValue) => this.setState({observation: newValue})}
                        />
                    </Col>
                    <Col sm={0} md={2}/>
                </Row>
            </>
        )
    }
}

const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(BuildLineupPage);
