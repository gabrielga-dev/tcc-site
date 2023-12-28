import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {Toast} from "primereact/toast";
import HomeTemplate from "../../../template/home_template";
import {connect} from "react-redux";
import {PaginationRequest} from "../../../../../domain/new/commom/request/pagination.request";
import {PageResponse} from "../../../../../domain/new/commom/response/page.response";
import {Card} from "primereact/card";
import {Col, Container, Row} from "react-bootstrap";
import {ListBandFilterComponent} from "./components/list_band_filter.component";
import {BandService} from "../../../../../service/new/band.service";
import {ToastUtils} from "../../../../../util/toast.utils";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {BandResponse} from "../../../../../domain/new/band/response/band.response";
import {StyleConstants} from "../../../../../service/style.constants";
import {FileService} from "../../../../../service/new/file.service";
import {Button} from "primereact/button";
import './list_own_bands.style.css'
import {Paginator} from "primereact/paginator";

const ListOwnBandsPage = ({token, user}) => {
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
            <_ListOwnBandsPage id="page"
                               token={token}
                               authenticatedUser={user}
                               navigateTo={redirectTo}
                               showToast={showToast}
            />
        </>
    );
}

class _ListOwnBandsPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            isTableLoading: false,
            bands: [],
            pagination: new PaginationRequest(5),
            pageable: new PageResponse(),
        }
    }

    componentDidMount() {
        this.findBands();
    }

    findBands(criteria) {
        this.setState({isTableLoading: true});

        let {pagination, showToast, token} = this.state;
        BandService.FIND_AUTHENTICATED_PERSON_BANDS(criteria, pagination, token)
            .then(
                response => {
                    let bands = response.data.content.map(b => (new BandResponse(b)));
                    let newPageable = new PageResponse(response.data);
                    this.setState({bands: bands, pageable: newPageable});
                }
            ).catch(error => showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isTableLoading: false}))
    }

    rowClass(band) {
        return {
            'row-accessories': !band.active
        }
    }

    render() {
        let {isTableLoading, pagination, pageable} = this.state;
        return (
            <HomeTemplate steps={['Home', 'Minhas Bandas']}>
                <Card>
                    <Container>
                        <Row>
                            <ListBandFilterComponent
                                showToast={this.state.showToast}
                                search={(criteria) => this.findBands(criteria)}
                            />
                        </Row>
                        <Row>
                            <Col>
                                <DataTable
                                    loading={isTableLoading}
                                    value={this.state.bands}
                                    responsiveLayout="scroll"
                                    size="small"
                                    rowClassName={this.rowClass}
                                >
                                    <Column
                                        style={{width: '20%'}}
                                        header="Avatar"
                                        body={this.renderBandAvatar}
                                    />
                                    <Column style={{width: '60%'}} field="name" header="Nome"/>
                                    <Column style={{width: '20%'}} header="Ações" body={this.renderBandActions}/>
                                </DataTable>
                            </Col>
                        </Row>
                        <Row>
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
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    renderBandAvatar(band) {
        return (
            <img
                style={StyleConstants.IMAGE_STYLE}
                alt={`Avatar da banda ${band.name}`}
                src={
                    (!band.profilePictureUuid)
                        ? 'images/band_default_icon.png'
                        : FileService.GET_IMAGE_URL(band.profilePictureUuid)
                }
                onError={(e) => e.target.src = 'images/band_default_icon.png'}
            />
        );
    }

    renderBandActions(band) {
        return (
            <Container>
                <Row>
                    <Col sm={12} md={4} style={{marginBottom: 10}}>
                        <Button
                            tooltip="Visualizar perfil da banda"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-user"
                            className="p-button-rounded p-button-info"
                        />
                    </Col>
                    <Col sm={12} md={4} style={{marginBottom: 10}}>
                        <Button
                            tooltip={
                                band.active
                                    ? "Desativar banda"
                                    : "Ativar banda"
                            }
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-power-off"
                            className={
                                band.active
                                    ? "p-button-rounded p-button-danger"
                                    : "p-button-rounded p-button-success"
                            }
                        />
                    </Col>
                    <Col sm={12} md={4} style={{marginBottom: 10}}>
                        <Button
                            disabled={!band.active}
                            tooltip="Editar banda"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-pencil"
                            className="p-button-rounded p-button-warning"
                        />
                    </Col>
                    <Col sm={12} md={4} style={{marginBottom: 10}}>
                        <Button
                            disabled={!band.active}
                            tooltip="Administrar músicos"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-users"
                            className="p-button-rounded p-button-warning"
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
export default connect(mapStateToProps)(ListOwnBandsPage);
