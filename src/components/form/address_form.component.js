import {AddressRequest} from "../../domain/new/address/request/address.request";
import {Col, Container, Row} from "react-bootstrap";
import {TextFieldComponent} from "./input/text_field.component";
import React from "react";
import {NumericFieldComponent} from "./input/numeric_field.component";
import {DropDownFieldComponent} from "./input/dropdown_field.component";
import {ActivityIndicatorComponent} from "../activity_indicator.component";
import {LocationService} from "../../service/new/location.service";
import {ToastUtils} from "../../util/toast.utils";
import {StateResponse} from "../../domain/new/location/response/state.response";
import {CityResponse} from "../../domain/new/location/response/city.response";
import {TextMaskFieldComponent} from "./input/text_mask_field.component";


export class AddressFormComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: props.isLoading,
            showToast: props.showToast,

            updateRequest: props.updateRequest ? props.updateRequest : (x) => console.log(x),
            request: this.props.address ? this.props.address : new AddressRequest(),

            selectedState: null,
            states: [],

            selectedCity: null,
            cities: [],
        }
    }

    resetRequest() {
        this.setState({request: new AddressRequest()})
    }

    setRequest(address) {
        this.setState({isLoading: false})
        this.setState({request: new AddressRequest(address)});
        this.componentDidMount()
    }

    componentDidMount() {
        this.setState({isLoading: true});

        let {showToast, request} = this.state;

        LocationService.GET_BRAZIL_STATES()
            .then(
                response => {
                    let newStates = response.data.map(state => (new StateResponse(state)));
                    this.setState({states: newStates});
                    if (!!request.state) {
                        this.setField('stateIso', request.state)
                        this.setState({
                            selectedState: newStates.filter(stt => (stt.iso2 === request.state))[0]
                        });
                        this.getCities(request.state)
                    }
                }
            ).catch(error => showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isLoading: false}))
    }

    render() {
        if (this.state.isLoading) {
            return (<ActivityIndicatorComponent/>);
        }

        let {
            street,
            number,
            neighbour,
            complement,
            zipCode,
        } = this.state.request;
        let {
            isLoading,
            selectedState,
            states,
            selectedCity,
            cities,
        } = this.state

        return (
            <Container>
                <Row style={ROW_STYLE}>
                    <Col md={6} sm={12}>
                        <TextFieldComponent
                            disabled={isLoading}
                            label="Rua"
                            value={street}
                            minLength={3}
                            maxLength={50}
                            placeHolder="Ex.: Rua Junqueira Brito"
                            onChange={(newStreet) => this.setField('street', newStreet)}
                        />
                    </Col>
                    <Col md={6} sm={12}>
                        <NumericFieldComponent
                            disabled={isLoading}
                            label="Número"
                            value={number}
                            placeHolder="Ex.: 320"
                            onChange={(newNumber) => this.setField('number', newNumber)}
                        />
                    </Col>
                </Row>
                <Row style={ROW_STYLE}>
                    <Col md={6} sm={12}>
                        <TextFieldComponent
                            disabled={isLoading}
                            label="Complemento"
                            value={complement}
                            minLength={3}
                            maxLength={10}
                            placeHolder="Ex.: apto 22 (OPCIONAL)"
                            onChange={(newComplement) => this.setField('complement', newComplement)}
                        />
                    </Col>
                    <Col md={6} sm={12}>
                        <TextFieldComponent
                            disabled={isLoading}
                            label="Bairro"
                            value={neighbour}
                            minLength={3}
                            maxLength={50}
                            placeHolder="Ex.: Centro"
                            onChange={(newNeighbour) => this.setField('neighbour', newNeighbour)}
                        />
                    </Col>
                </Row>
                <Row style={ROW_STYLE}>
                    <Col md={6} sm={12}>
                        <DropDownFieldComponent
                            disabled={isLoading}
                            label="Estado"
                            placeHolder="Selecione um estado"
                            value={selectedState}
                            options={states}
                            onChange={
                                (newState) => {
                                    this.setField('stateIso', newState.iso2);
                                    this.setState({selectedState: newState});
                                    this.getCities(newState.iso2)
                                }
                            }
                        />
                    </Col>
                    <Col md={6} sm={12}>
                        <DropDownFieldComponent
                            disabled={!selectedState || isLoading}
                            label="Cidade"
                            placeHolder="Selecione uma cidade"
                            value={selectedCity}
                            options={cities}
                            onChange={
                                (newCity) => {
                                    this.setField('cityId', newCity.id);
                                    this.setState({selectedCity: newCity});
                                }
                            }
                        />
                    </Col>
                </Row>
                <Row style={ROW_STYLE}>
                    <Col md={6} sm={12}>
                        <TextMaskFieldComponent
                            disabled={isLoading}
                            label="CEP"
                            value={zipCode}
                            placeHolder="Ex.: 35.574-021"
                            mask="99.999-999"
                            onChange={(newZipCode) => {
                                if (!newZipCode)
                                    return
                                this.setField('zipCode', newZipCode)
                            }}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }

    getCities(stateIso) {
        this.setState({isLoading: true});
        let {showToast, request} = this.state;
        LocationService.GET_STATE_CITIES(stateIso)
            .then(
                response => {
                    let newCities = response.data.map(city => (new CityResponse(city)));
                    this.setState({cities: newCities});
                    if (!!request.cityId) {
                        this.setState({
                            selectedCity: newCities.filter(city => (city.id === request.cityId))[0]
                        });
                        this.setField('cityId', request.cityId);
                    }
                }
            ).catch(error => {
            showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
        }).finally(() => this.setState({isLoading: false}))
    }

    setField(field, newValue) {
        let auxRequest = new AddressRequest(this.state.request);
        auxRequest[field] = newValue;
        this.setState({request: auxRequest});
        this.state.updateRequest(auxRequest);
    }
}

const ROW_STYLE = {
    marginBottom: 20
}
