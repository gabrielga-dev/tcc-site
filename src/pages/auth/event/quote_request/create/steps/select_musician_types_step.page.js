import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {Toast} from "primereact/toast";
import {connect} from "react-redux";
import {Col, Container, Row} from "react-bootstrap";
import {Card} from "primereact/card";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {MusicianTypeService} from "../../../../../../service/new/musician_type.service";
import {MusicianTypeResponse} from "../../../../../../domain/new/musician/response/musician_type.response";
import {ToastUtils} from "../../../../../../util/toast.utils";
import {Button} from "primereact/button";
import {
    QuoteRequestMusicianTypeRequest
} from "../../../../../../domain/new/quote_request/music/request/quote_request_musician_type.request";
import {NumericFieldComponent} from "../../../../../../components/form/input/numeric_field.component";
import './select_musician_types_step.style.css';
import {TextFieldComponent} from "../../../../../../components/form/input/text_field.component";

const SelectMusicianTypesStepPage = ({token, user, currentStep, reference, updateMusiciansTypes}) => {
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
            <_SelectMusicianTypesStepPage
                ref={reference}
                token={token}
                authenticatedUser={user}
                navigateTo={redirectTo}
                showToast={showToast}
                currentStep={currentStep}
                updateMusiciansTypes={updateMusiciansTypes}
            />
        </>
    );
}


class _SelectMusicianTypesStepPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            currentStep: this.props.currentStep,

            musicianTypes: [],
            selectedMusicianTypes: [],

            updateMusiciansTypes: this.props.updateMusiciansTypes,
        }
    }

    componentDidMount() {
        this.findMusicianType();
    }

    updateStep(newStep) {
        this.setState({currentStep: newStep});
    }

    findMusicianType() {
        this.setState({isLoading: true});

        let {token, showToast, navigateTo} = this.state;
        MusicianTypeService.FIND_ALL(token)
            .then(
                response => {
                    const musicianTypes = response.data.map(
                        musicianType => (new MusicianTypeResponse(musicianType))
                    );
                    this.setState({musicianTypes: musicianTypes, isLoading: false});
                }
            )
            .catch(
                error => {
                    showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                    setTimeout(() => navigateTo('/'), 1000);
                }
            );
    }

    render() {
        if (this.state.currentStep !== 2) {
            return (<></>);
        }
        let {isLoading, musicianTypes} = this.state;
        return (
            <Card className='main-card'>
                <Container>
                    <Row>
                        <Col>
                            <DataTable
                                loading={isLoading}
                                value={musicianTypes}
                                responsiveLayout="scroll"
                                size='small'
                                emptyMessage='Nenhum tipo de músico encontrado encontrada 😢'
                                rowHover={true}
                            >
                                <Column style={{width: '20%'}} field='name' header="Nome"/>
                                <Column
                                    style={{width: '10%'}}
                                    header="Seleção"
                                    body={
                                        (musicianType) => this.renderMusicianTypeButtons(musicianType)
                                    }
                                />
                                <Column
                                    style={{width: '20%'}}
                                    header="Quantidade"
                                    body={
                                        (musicianType) => this.renderMusicianTypeQuantityField(musicianType)
                                    }
                                />
                                <Column
                                    style={{width: '50%'}}
                                    header="Observação"
                                    body={
                                        (musicianType) => this.renderMusicianTypeObservationField(musicianType)
                                    }
                                />
                            </DataTable>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p>
                                <b>Importante!</b> Quantidade zero de cada tipo de músico representa a falta de
                                interesse
                                na quantidade de músicos do tipo selecionado!
                            </p>
                        </Col>
                    </Row>
                </Container>
            </Card>
        );
    }

    removeSelectedMusicianType(musicianType) {
        if (musicianType) {
            let {selectedMusicianTypes, updateMusiciansTypes} = this.state;
            selectedMusicianTypes = selectedMusicianTypes.filter(m => (m.musicianTypeUuid !== musicianType.uuid));
            this.setState({selectedMusicianTypes: selectedMusicianTypes});
            updateMusiciansTypes(selectedMusicianTypes);
        }
    }

    addSelectedMusicianType(musicianType) {
        if (musicianType) {
            let {selectedMusicianTypes, updateMusiciansTypes} = this.state;
            selectedMusicianTypes.push(new QuoteRequestMusicianTypeRequest(musicianType));
            this.setState({selectedMusics: selectedMusicianTypes});
            updateMusiciansTypes(selectedMusicianTypes);
        }
    }

    renderMusicianTypeButtons(musicianType) {
        let {isLoading, selectedMusicianTypes} = this.state;

        let isSelected = selectedMusicianTypes.some(mt => (mt.musicianTypeUuid === musicianType.uuid));

        let icon = isSelected ? "pi pi-check" : "pi pi-circle";
        let toolTip = isSelected ? "Desselecionar" : "Selecionar";
        let buttonClass = !isSelected ? "p-button-info" : "p-button-success";

        return (
            <Container>
                <Row>
                    <Col sm={12} md={6} style={{marginBottom: 10}}>
                        <Button
                            disabled={isLoading}
                            tooltip={toolTip}
                            tooltipOptions={{position: 'top'}}
                            icon={icon}
                            className={`p-button-rounded ${buttonClass}`}
                            onClick={() => {
                                if (isSelected) {
                                    this.removeSelectedMusicianType(musicianType);
                                } else {
                                    this.addSelectedMusicianType(musicianType);
                                }
                            }}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }

    renderMusicianTypeQuantityField(musicianType) {
        let {isLoading, selectedMusicianTypes} = this.state;
        let selectedMusicianType = selectedMusicianTypes.filter(mt => (mt.musicianTypeUuid === musicianType.uuid))[0];
        let isSelected = selectedMusicianTypes.some(mt => (mt.musicianTypeUuid === musicianType.uuid));

        return (
            <Container>
                <Row>
                    <Col>
                        <NumericFieldComponent
                            className='musician-type-field'
                            disabled={isLoading || !isSelected}
                            label=''
                            placeHolder={`Insira a quantidade`}
                            value={isSelected ? selectedMusicianType.quantity : null}
                            min={0}
                            onBlur={
                                () => {
                                    if (isSelected) {
                                        if (selectedMusicianType.quantity === 0) {
                                            selectedMusicianType.quantity = null;
                                            this.setState({selectedMusicianTypes: selectedMusicianTypes})
                                        }
                                    }
                                }
                            }
                            onChange={
                                (newValue) => {
                                    if (isSelected) {
                                        if (newValue === 0) {
                                            selectedMusicianType.quantity = null;
                                        } else {
                                            selectedMusicianType.quantity = newValue;
                                        }
                                        this.setState({selectedMusicianTypes: selectedMusicianTypes})
                                    }
                                }
                            }
                        />
                    </Col>
                </Row>
            </Container>
        );
    }

    renderMusicianTypeObservationField(musicianType){
        let {isLoading, selectedMusicianTypes} = this.state;
        let selectedMusicianType = selectedMusicianTypes.filter(mt => (mt.musicianTypeUuid === musicianType.uuid))[0];
        let isSelected = selectedMusicianTypes.some(mt => (mt.musicianTypeUuid === musicianType.uuid));

        return (
            <Container>
                <Row>
                    <Col>
                        <TextFieldComponent
                            className='musician-type-field'
                            disabled={isLoading || !isSelected}
                            label=''
                            placeHolder={`Insira alguma observação`}
                            value={isSelected ? selectedMusicianType.observation : null}
                            onChange={
                                (newValue) => {
                                    if (isSelected) {
                                        if (newValue === 0) {
                                            selectedMusicianType.observation = null;
                                        } else {
                                            selectedMusicianType.observation = newValue;
                                        }
                                        this.setState({selectedMusicianTypes: selectedMusicianTypes})
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
export default connect(mapStateToProps)(SelectMusicianTypesStepPage);
