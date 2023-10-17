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
import {FormEndingComponent} from "../../../../../components/form_ending.component";
import {LocationService} from "../../../../../service/new/location.service";
import {ToastUtils} from "../../../../../util/toast.utils";
import {CityDto} from "../../../../../domain/new/dto/city.dto";
import {BandFilter} from "../../../../../domain/new/filter/band.filter";
import {BandService} from "../../../../../service/new/band.service";
import {ActivityIndicatorComponent} from "../../../../../components/activity_indicator.component";
import {Avatar} from "primereact/avatar";
import {FileService} from "../../../../../service/new/file.service";
import {PaginationDto} from "../../../../../domain/new/dto/page/pagination.dto";
import {InputText} from "primereact/inputtext";
import {PageableDto} from "../../../../../domain/new/dto/page/pageable.dto";
import {Paginator} from "primereact/paginator";
import {updateToken} from "../../../../../service/redux/action/token.action";
import {updateUser} from "../../../../../service/redux/action/user.action";
import {connect} from "react-redux";
import {Toast} from "primereact/toast";
import {OwnBandDto} from "../../../../../domain/new/dto/band/own_band.dto";
import {DateUtil} from "../../../../../util/date.util";
import {Calendar} from "primereact/calendar";
import {OwnBandFilter} from "../../../../../domain/new/filter/own_band.filter";


const SearchAuthenticatedPersonBandsPage = ({token, user}) => {
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
            <Toast ref={toast}/>
            <_SearchAuthenticatedPersonBandsPage
                token={token}
                user={user}
                showToast={showToast}
                redirectTo={redirectTo}
            />
        </>
    )
}

class _SearchAuthenticatedPersonBandsPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showToast: props.showToast,
            redirectTo: props.redirectTo,
            token: props.token,
            authenticatedUser: props.user,

            filter: new OwnBandFilter(),
            pagination: new PaginationDto(5),
            pageable: new PageableDto(),

            isLoading: false,
        }
    }

    componentDidMount() {
        this.findBands()
    }

    render() {
        let {filter} = this.state
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
                                            <h6>Data início do período de criação</h6>
                                            <Calendar
                                                style={StyleConstants.WIDTH_100_PERCENT}
                                                value={filter.startDate}
                                                placeholder="Início do período de busca"
                                                onChange={
                                                    (e) => {
                                                        filter.startDate = e.value;
                                                        this.setState({filter})
                                                    }
                                                }
                                            />
                                        </Col>
                                        <Col lg={4} md={12}>
                                            <h6>Data fim do período de criação</h6>
                                            <Calendar
                                                style={StyleConstants.WIDTH_100_PERCENT}
                                                value={filter.endDate}
                                                placeholder="Fim do período de busca"
                                                onChange={
                                                    (e) => {
                                                        filter.endDate = e.value;
                                                        this.setState({filter})
                                                    }
                                                }
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
        let {filter, pagination, token} = this.state
        BandService.FIND_AUTHENTICATED_PERSON_BANDS(filter, pagination, token)
            .then(
                response => {
                    let bands = response.data.content.map(b => (new OwnBandDto(b)))
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
                }}/>
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
                <Card
                    key={`band-${band.uuid}`}
                    title={
                        (band.active)
                            ? (band.name)
                            : (<>{band.name} <span style={{color: 'red', fontSize: 12}}>Desativada!</span></>)
                    }
                    style={MarginStyle.makeMargin(0, 10, 0, 10)}
                >
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
                                <Container>
                                    <Row>
                                        <Col>
                                            <p className="m-0">{band.description}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div style={{float: "left", marginRight: 8}}>
                                                <i className="pi pi-map-marker"/>
                                            </div>
                                            <div style={{float: "left"}}>
                                                <div>{band.address.state}, {band.address.city}</div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <Container>
                                                <Row>
                                                    <Col>
                                                        <div style={{float: "left", marginRight: 8}}>
                                                            <i className="pi pi-calendar-plus"/>
                                                        </div>
                                                        <div style={{float: "left"}}>
                                                            <div>Criada
                                                                em {DateUtil.DATE_TO_STRING(band.creationDate)}</div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                {
                                                    !!band.updateDate
                                                        ? (

                                                            <Row>
                                                                <Col>
                                                                    <div style={{float: "left", marginRight: 8}}>
                                                                        <i className="pi pi-calendar"/>
                                                                    </div>
                                                                    <div style={{float: "left"}}>
                                                                        <div>
                                                                            {
                                                                                band.active
                                                                                ? 'Atualizada ' : 'Deletada '
                                                                            }
                                                                            em {
                                                                                DateUtil.DATE_TO_STRING(
                                                                                    band.updateDate
                                                                                )
                                                                            }</div>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        )
                                                        : null
                                                }
                                            </Container>
                                        </Col>
                                    </Row>
                                </Container>
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

const myMapDispatchToProps = {
    updateToken: updateToken,
    updateUser: updateUser,
};
const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps, myMapDispatchToProps)(SearchAuthenticatedPersonBandsPage);
