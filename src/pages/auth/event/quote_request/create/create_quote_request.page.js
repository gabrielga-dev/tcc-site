import React, {useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import {connect} from "react-redux";
import {ActivityIndicatorComponent} from "../../../../../components/activity_indicator.component";
import HomeTemplate from "../../../../template/home_template";
import {Card} from "primereact/card";
import {Col, Container, Row} from "react-bootstrap";
import {ToastUtils} from "../../../../../util/toast.utils";
import {BandService} from "../../../../../service/new/band.service";
import {BandProfileResponse} from "../../../../../domain/new/band/response/band_profile.response";
import {Timeline} from "primereact/timeline";
import './create_quote_request.style.css';
import {Button} from "primereact/button";
import {StyleConstants} from "../../../../../service/style.constants";
import SelectEventStep from "./steps/select_event_step.page";
import {QuoteRequestRequest} from "../../../../../domain/new/quote_request/music/request/quote_request.request";
import SelectMusicsStep from "./steps/select_musics_step.page";

const CreateEventQuoteRequestPage = ({token, user}) => {
    const toast = useRef(null);

    let {band_uuid} = useParams();
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
                bandUuid={band_uuid}
            />
        </>
    );
}

class _ListEventQuoteRequestsPage extends React.Component {

    constructor(props) {
        super(props)

        this.refSteps = [
            React.createRef(),
            React.createRef(),
            React.createRef(),
            React.createRef(),
        ];

        this.steps = [
            'Evento',
            'Repertório',
            'Músicos',
            'Resumo',
        ];

        this.state = {
            isMasterLoading: false,
            isLoading: false,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            step: 0,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            bandUuid: props.bandUuid,
            bandProfile: null,

            request: new QuoteRequestRequest(),
        }
    }

    componentDidMount() {
        this.setState({isMasterLoading: true});
        let {bandUuid, token, showToast, navigateTo} = this.state;
        BandService.FIND_PROFILE(bandUuid, token)
            .then(
                response => {
                    this.setState({bandProfile: new BandProfileResponse(response.data), isMasterLoading: false});
                }
            ).catch(
            error => {
                showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
                setTimeout(() => navigateTo('/'), 1500)
            }
        );
    }

    render() {
        if (this.state.isMasterLoading) {
            return (<ActivityIndicatorComponent/>);
        }
        return (
            <HomeTemplate
                steps={['Home', 'Bandas', 'Meus eventos', this.state.bandProfile?.name, 'Pedir de Orçamento']}
            >
                <Card className='main-card'>
                    <Container>
                        <Row>
                            <Col>
                                <Timeline
                                    value={this.steps}
                                    className="customized-timeline"
                                    layout="horizontal"
                                    align="bottom"
                                    marker={(item, index) => this.renderMarker(item, index)}
                                    content={(item) => item}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {this.renderStep()}
                            </Col>
                        </Row>

                        <Row>
                            <Col md={8} sm={0}/>
                            {this.renderButtons()}
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    renderStep() {
        let {step, request} = this.state;
        return (
            <>
                <SelectEventStep
                    reference={this.refSteps[0]}
                    currentStep={step}
                    selectedEventUuid={request.eventUuid}
                    selectEventAction={
                        (newUuid, ) => {
                            let {request} = this.state;
                            request.eventUuid = newUuid;
                            this.setState({request: request});
                        }
                    }/>
                <SelectMusicsStep
                    reference={this.refSteps[1]}
                    currentStep={step}
                    selectedEventUuid={request.eventUuid}
                    updatePlaylist={(newPlaylist => {
                        let {request} = this.state;
                        request.playlist = newPlaylist;
                        this.setState({request: request});
                    })}
                />
            </>
        );
    }

    renderMarker(item, index) {
        let {step} = this.state;

        if (step === index) {
            return (<i className='pi pi-circle-fill selected-marker'/>);
        }
        return (<i className='pi pi-circle'/>);
    }

    renderButtons() {
        let {step, request} = this.state;
        if (step === 0) {
            return (
                <Col md={4} sm={6}>
                    <Button
                        style={StyleConstants.WIDTH_100_PERCENT}
                        label='Próximo'
                        icon='pi pi-arrow-right'
                        iconPos='right'
                        disabled={!request.eventUuid}
                        onClick={() => this.nextStep()}
                    />
                </Col>
            )
        } else if (step === (this.steps.length - 1)) {
            return (
                <>
                    <Col md={2} sm={6}>
                        <Button
                            style={StyleConstants.WIDTH_100_PERCENT}
                            label='Voltar'
                            icon='pi pi-arrow-left'
                            iconPos='left'
                            onClick={() => this.previousStep()}
                        />
                    </Col>
                    <Col md={2} sm={6}>
                        <Button
                            style={StyleConstants.WIDTH_100_PERCENT}
                            label='Subemeter'
                            icon='pi pi-send'
                            iconPos='right'
                            className='p-button-success'
                        />
                    </Col>
                </>
            );
        }
        return (
            <>
                <Col md={2} sm={6}>
                    <Button
                        style={StyleConstants.WIDTH_100_PERCENT}
                        label='Voltar'
                        icon='pi pi-arrow-left'
                        iconPos='left'
                        onClick={() => this.previousStep()}
                    />
                </Col>
                <Col md={2} sm={6}>
                    <Button
                        style={StyleConstants.WIDTH_100_PERCENT}
                        label='Próximo'
                        icon='pi pi-arrow-right'
                        iconPos='right'
                        onClick={() => this.nextStep()}
                    />
                </Col>
            </>
        );
    }

    nextStep() {
        let {step} = this.state;
        this.refSteps
            .filter(step => !!step.current)
            .forEach(stepRef => stepRef.current.updateStep(step + 1));
        this.setState({step: step + 1})
    }

    previousStep() {
        let {step} = this.state;
        this.refSteps
            .filter(step => !!step.current)
            .forEach(
                stepRef => stepRef.current.updateStep(step - 1)
            );
        this.setState({step: step - 1})
    }
}

const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(CreateEventQuoteRequestPage);
