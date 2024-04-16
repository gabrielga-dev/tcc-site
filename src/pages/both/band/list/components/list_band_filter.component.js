import React from "react";
import {Accordion, AccordionTab} from "primereact/accordion";
import {Col, Container, Row} from "react-bootstrap";
import {ListBandCriteria} from "../../../../../domain/new/band/criteria/list_band.criteria";
import {LocationService} from "../../../../../service/new/location.service";
import {ToastUtils} from "../../../../../util/toast.utils";
import {StateResponse} from "../../../../../domain/new/location/response/state.response";
import {ActivityIndicatorComponent} from "../../../../../components/activity_indicator.component";
import {CityResponse} from "../../../../../domain/new/location/response/city.response";
import {FormEndingComponent} from "../../../../../components/form_ending.component";
import {TextFieldComponent} from "../../../../../components/form/input/text_field.component";
import {DropDownFieldComponent} from "../../../../../components/form/input/dropdown_field.component";


export class ListBandFilterComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            showToast: props.showToast,
            isLoading: false,

            activeIndex: null,
            criteria: new ListBandCriteria(),

            selectedState: null,
            states: [],

            selectedCity: null,
            cities: [],

            search: props.search,
        }
    }

    componentDidMount() {
        let {showToast} = this.state;
        this.setState({isLoading: true});
        LocationService.GET_BRAZIL_STATES()
            .then(response => {
                let newStates = response.data.map(state => (new StateResponse(state)))
                this.setState({states: newStates})
            }).catch(error => showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isLoading: false}));
    }

    setName(value) {
        let obj = new ListBandCriteria(this.state.criteria);
        obj.name = value;
        this.setState({criteria: obj});
    }

    render() {
        let {activeIndex} = this.state;
        return (
            <Accordion
                activeIndex={activeIndex}
                onTabChange={(e) => this.setState({activeIndex: e.index})}
            >
                {
                    this.state.isLoading
                        ? (<ActivityIndicatorComponent/>)
                        : (this.renderFilters())
                }
            </Accordion>
        );
    }

    renderFilters() {
        let {selectedState, states} = this.state;
        let {selectedCity, cities} = this.state;
        return (
            <AccordionTab header="Filtros">
                <Container>
                    <Row>
                        <Col md={4} sm={12}>
                            <TextFieldComponent
                                label='Nome'
                                placeHolder='Digite o nome da banda'
                                optional={true}
                                value={this.state.criteria.name}
                                maxLength={100}
                                onChange={(e) => this.setName(e)}
                            />
                        </Col>
                        <Col md={4} sm={12}>
                            <DropDownFieldComponent
                                label='Estado'
                                optional={true}
                                placeHolder="Selecione um estado"
                                emptyMessage="Nenhum estado encontrado"
                                value={selectedState}
                                options={states}
                                optionLabel="name"
                                onChange={(e) => this.setStateLocation(e)}
                            />
                        </Col>
                        <Col md={4} sm={12}>
                            <DropDownFieldComponent
                                disabled={!selectedState}
                                label='Cidade'
                                optional={true}
                                placeHolder="Selecione uma cidade"
                                emptyMessage="Nenhuma cidade encontrada"
                                value={selectedCity}
                                options={cities}
                                optionLabel="name"
                                onChange={(e) => this.setCityLocation(e)}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={5} sm={0}/>
                        <Col>
                            <FormEndingComponent
                                showFirst={false}
                                onClickSecond={() => this.clearFilters()}
                                onClickThird={() => this.search()}
                            />
                        </Col>
                    </Row>
                </Container>
            </AccordionTab>
        );
    }

    setStateLocation(newState) {
        this.setState({
            selectedState: newState,
            selectedCity: null,
        });
        this.findCities(newState.iso2)
    }

    setCityLocation(newCity) {
        this.setState({selectedCity: newCity});
    }

    findCities(stateIso) {
        let {showToast} = this.state;
        this.setState({isLoading: true});
        LocationService.GET_STATE_CITIES(stateIso)
            .then(response => {
                let newCities = response.data.map(city => (new CityResponse(city)))
                this.setState({cities: newCities})
            }).catch(error => showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isLoading: false}));
    }

    clearFilters() {
        this.setState({
            criteria: new ListBandCriteria(),
            selectedState: null,
            selectedCity: null,
        });
    }

    search() {
        let {search, criteria} = this.state;
        let {selectedState, selectedCity} = this.state;

        let newCriteria = new ListBandCriteria(criteria);
        if (selectedState) {
            newCriteria.stateIso = selectedState.iso2;
        }
        if (selectedCity) {
            newCriteria.cityId = selectedCity.id;
        }

        search(newCriteria);
    }
}
