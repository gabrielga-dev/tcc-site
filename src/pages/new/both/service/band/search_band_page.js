import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";
import HomeTemplate from "../../../template/home_template";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {MarginStyle} from "../../../../../style/margin.style";

import 'primeflex/primeflex.css';
import {Col, Container, Row} from "react-bootstrap";
import {Accordion, AccordionTab} from "primereact/accordion";
import {StyleConstants} from "../../../../../service/style.constants";
import {Dropdown} from "primereact/dropdown";
import {FormEndingComponent} from "../../../../../components/form_ending.component";
import {LocationService} from "../../../../../service/new/location.service";
import {ToastUtils} from "../../../../../util/toast.utils";
import {StateDto} from "../../../../../domain/new/dto/state.dto";
import {CityDto} from "../../../../../domain/new/dto/city.dto";
import {BandFilter} from "../../../../../domain/new/filter/band.filter";
import axios from "axios";
import {BandService} from "../../../../../service/new/band.service";
import {BandDto} from "../../../../../domain/new/dto/band/band.dto";
import {ActivityIndicatorComponent} from "../../../../../components/activity_indicator.component";
import {Avatar} from "primereact/avatar";
import {FileService} from "../../../../../service/new/file.service";
import {PaginationDto} from "../../../../../domain/new/dto/page/pagination.dto";
import {InputText} from "primereact/inputtext";
import {PageableDto} from "../../../../../domain/new/dto/page/pageable.dto";
import {Paginator} from "primereact/paginator";


export const SearchBandsPage = () => {
    const toast = useRef(null);
    const navigate = useNavigate();

    const redirectTo = (to) => {
        navigate(to);
    };
    const showToast = (body) => {
        toast.current.show(body);
    };
    return (
        <>
            <_SearchBandsPage showToast={showToast} redirectTo={redirectTo}/>
        </>
    )
}

export default class _SearchBandsPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showToast: props.showToast,
            redirectTo: props.redirectTo,

            filter: new BandFilter(),
            pagination: new PaginationDto(5),
            pageable: new PageableDto(),

            isLoading: false,
            states: [],
            selectedState: null,
            cities: [],
            selectedCity: null,
        }
    }

    componentDidMount() {
        this.setState({isLoading: true})
        let {filter, pagination} = this.state;
        axios.all(
            [
                LocationService.GET_BRAZIL_STATES(),
                BandService.FIND_BANDS(filter, pagination)
            ]
        ).then(response => {
            //states
            let newStates = response[0].data.map(s => (new StateDto(s)))
            this.setState({states: newStates})

            //bands
            let bands = response[1].data.content.map(b => (new BandDto(b)))
            let newPageable = new PageableDto(response[1].data)
            this.setState({bands: bands, pageable: newPageable})
        })
            .catch(error =>
                this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error[0]))
            )
            .finally(() => this.setState({isLoading: false}))
    }

    render() {
        let {filter} = this.state
        let {cities, states} = this.state
        return (
            <HomeTemplate steps={['Serviços', 'Bandas']}>
                <Container>
                    <Row>
                        <Accordion activeIndex={0}>
                            <AccordionTab header="Filtros">
                                <Container>
                                    <Row>
                                        <Col lg={4} md={12}>
                                            <h6>Nome</h6>
                                            <InputText
                                                id="name"
                                                placeholder="Digite o nome da banda"
                                                style={StyleConstants.WIDTH_100_PERCENT}
                                                value={!!filter.name ? filter.name : ''}
                                                onChange={
                                                    (e) => {
                                                        filter.name = e.target.value
                                                        this.setState({filter: filter});
                                                    }
                                                }
                                            />
                                        </Col>
                                        <Col lg={4} md={12}>
                                            <h6>Estado</h6>
                                            <Dropdown
                                                value={filter.state}
                                                onChange={
                                                    (e) => {
                                                        filter.state = e.value
                                                        this.setState({filter: filter});
                                                        this.getCities(e.value)
                                                    }
                                                }
                                                options={states}
                                                style={StyleConstants.WIDTH_100_PERCENT}
                                                optionLabel="name"
                                                placeholder="Selecione um estado"
                                            />
                                        </Col>
                                        <Col lg={4} md={12}>
                                            <h6>Cidade</h6>
                                            <Dropdown
                                                disabled={!!!filter.state}
                                                value={filter.city}
                                                onChange={
                                                    (e) => {
                                                        filter.city = e.value
                                                        this.setState({filter: filter});
                                                    }
                                                }
                                                options={cities}
                                                style={StyleConstants.WIDTH_100_PERCENT}
                                                optionLabel="name"
                                                placeholder={filter.state ? "Selecione uma cidade" : "Selecione um estado primeiro"}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <FormEndingComponent
                                            showFirst={false}
                                            onClickSecond={
                                                () => {
                                                    this.setState({filter: new BandFilter()});
                                                }
                                            }
                                            onClickThird={() => {
                                                this.findBands()
                                            }}
                                        />
                                    </Row>
                                </Container>
                            </AccordionTab>
                        </Accordion>
                    </Row>
                    <Row>
                        {this.renderTable()}
                    </Row>
                    <Row>
                        {this.renderPaginator()}
                    </Row>
                </Container>
            </HomeTemplate>
        )
    }

    findBands() {
        this.setState({isLoading: true})
        let {filter, pagination} = this.state
        BandService.FIND_BANDS(filter, pagination)
            .then(
                response => {
                    let bands = response.data.content.map(b => (new BandDto(b)))
                    let newPageable = new PageableDto(response.data)
                    this.setState({bands, pageable: newPageable})
                }
            )
            .catch(error =>
                this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
            )
            .finally(() => this.setState({isLoading: false}))
    }

    getCities(state) {
        LocationService.GET_STATE_CITIES(state.code)
            .then(response => {
                let newCities = response.data.map(c => (new CityDto(c)))
                this.setState({cities: newCities})
            })
            .catch(error =>
                this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
            )
    }

    renderPaginator() {
        let {pagination, pageable} = this.state;
        return (
            <Paginator
                number={pagination.page}
                rows={pagination.quantityPerPage}
                totalRecords={pageable.totalElements}
                onPageChange={(e) => {
                    let {pagination} = this.state;
                    pagination.page = e.page;
                    this.setState({pagination})
                    this.findBands()
                }} />
        );
    }
    renderTable() {
        let {isLoading, bands, redirectTo} = this.state;
        if (isLoading) {
            return (<ActivityIndicatorComponent/>)
        } else if (!!!bands || (bands.length === 0)) {
            return (
                <h4 align="center" style={MarginStyle.makeMargin(0, 10)}>Nenhuma banda encontrada :(</h4>
            )
        }
        return bands.map(
            band => (
                <Card key={`band-${band.uuid}`} title={band.name} style={MarginStyle.makeMargin(0, 10, 0, 10)}>
                    <Container>
                        <Row>
                            <Col md={3} sm={6}>
                                {
                                    !!!band.profilePictureUuid
                                        ? (<Avatar label={band.name[0]} size="xlarge"/>)
                                        : (<Avatar image={FileService.GET_IMAGE_URL(band.profilePictureUuid)}/>)
                                }
                            </Col>
                            <Col md={6} sm={6}>
                                <p className="m-0">{band.description}</p>
                            </Col>
                            <Col md={3} sm={12}>
                                <Button
                                    icon=" pi pi-search"
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    label="Ver banda"
                                    onClick={() => redirectTo(`/servicos/bandas/${band.uuid}`)}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Card>
            )
        );
    }
}
