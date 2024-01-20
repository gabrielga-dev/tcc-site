import React from "react";
import {Accordion, AccordionTab} from "primereact/accordion";
import {Col, Container, Row} from "react-bootstrap";
import {InputText} from "primereact/inputtext";
import {ListBandCriteria} from "../../../../../../domain/new/band/criteria/list_band.criteria";
import {StyleConstants} from "../../../../../../service/style.constants";
import {Dropdown} from "primereact/dropdown";
import {LocationService} from "../../../../../../service/new/location.service";
import {ToastUtils} from "../../../../../../util/toast.utils";
import {StateResponse} from "../../../../../../domain/new/location/response/state.response";
import {ActivityIndicatorComponent} from "../../../../../../components/activity_indicator.component";
import {CityResponse} from "../../../../../../domain/new/location/response/city.response";
import {FormEndingComponent} from "../../../../../../components/form_ending.component";


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
                        <Col md={4} sm={12} style={FIELD_MARGIN}>
                            <h5>Nome</h5>
                            <InputText
                                style={StyleConstants.WIDTH_100_PERCENT}
                                value={this.state.criteria.name}
                                maxLength={100}
                                onChange={(e) => this.setName(e.target.value)}
                            />
                        </Col>
                        <Col md={4} sm={12} style={FIELD_MARGIN}>
                            <h5>Estado</h5>
                            <Dropdown
                                style={StyleConstants.WIDTH_100_PERCENT}
                                optionLabel="name"
                                value={selectedState}
                                options={states}
                                onChange={(e) => this.setStateLocation(e.value)}
                                placeholder="Selecione um estado"
                                emptyMessage="Nenhum estado encontrado"
                                filter={true}
                            />
                        </Col>
                        <Col md={4} sm={12} style={FIELD_MARGIN}>
                            <h5>Cidade</h5>
                            <Dropdown
                                disabled={!selectedState}
                                style={StyleConstants.WIDTH_100_PERCENT}
                                optionLabel="name"
                                value={selectedCity}
                                options={cities}
                                onChange={(e) => this.setCityLocation(e.value)}
                                placeholder="Selecione uma cidade"
                                emptyMessage="Nenhuma cidade encontrada"
                                filter={true}
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

const FIELD_MARGIN = {marginBottom: 20};
