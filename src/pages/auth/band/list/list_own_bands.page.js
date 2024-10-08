import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {Toast} from "primereact/toast";
import HomeTemplate from "../../../template/home_template";
import {connect} from "react-redux";
import {PaginationRequest} from "../../../../domain/new/commom/request/pagination.request";
import {PageResponse} from "../../../../domain/new/commom/response/page.response";
import {Card} from "primereact/card";
import {Col, Container, Row} from "react-bootstrap";
import {ListBandFilterComponent} from "../../../both/band/list/components/list_band_filter.component";
import {BandService} from "../../../../service/new/band.service";
import {ToastUtils} from "../../../../util/toast.utils";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {BandResponse} from "../../../../domain/new/band/response/band.response";
import {FileService} from "../../../../service/new/file.service";
import {Button} from "primereact/button";
import './list_own_bands.style.css'
import {Paginator} from "primereact/paginator";
import {ConfirmDialog} from "primereact/confirmdialog";


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
            first: 0,

            showingToggleActiveStatusDialog: false,
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

    toggleBandStatus(bandUuid) {
        this.setState({isTableLoading: true});
        BandService.TOGGLE_BAND_ACTIVITY_FLAG(bandUuid, this.state.token)
            .then(() => this.findBands())
            .catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
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
                <Card className='main-card'>
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
                                    rowHover={true}
                                    emptyMessage='Nenhuma banda encontrada 😢'
                                >
                                    <Column
                                        style={{width: '20%'}}
                                        header="Avatar"
                                        body={this.renderBandAvatar}
                                    />
                                    <Column style={{width: '40%'}} field="name" header="Nome"/>
                                    <Column
                                        style={{width: '40%'}}
                                        header="Ações"
                                        body={(band) => this.renderBandActions(band)}
                                    />
                                </DataTable>
                            </Col>
                        </Row>
                        <Row>
                            <Paginator
                                first={this.state.first}
                                number={pagination.page}
                                rows={pagination.quantityPerPage}
                                totalRecords={pageable.totalElements}
                                onPageChange={(e) => {
                                    let {pagination} = this.state;
                                    pagination.page = e.page;
                                    this.setState({pagination: pagination, first: e.first})
                                    this.findBands()
                                }}/>
                        </Row>
                        {this.renderToggleBandStatusDialog()}
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    renderToggleBandStatusDialog() {
        let {showingToggleActiveStatusDialog, selectedBand} = this.state;
        return (
            <ConfirmDialog
                visible={showingToggleActiveStatusDialog}
                onHide={() => this.setState({showingToggleActiveStatusDialog: false, selectedBand: null})}
                message={
                    selectedBand?.active
                        ? "Você quer mesmo desativar esta banda?"
                        : "Você quer mesmo ativar esta banda?"
                }
                header={
                    selectedBand?.active
                        ? "Desativar banda?"
                        : "Ativar banda?"
                }
                acceptLabel="Sim"
                rejectLabel="Não"
                icon="pi pi-exclamation-triangle"
                accept={() => this.toggleBandStatus(selectedBand.uuid)}
                reject={() => {
                }}
            />
        );
    }

    renderBandAvatar(band) {
        return (
            <img
                className='band-img'
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
        let {navigateTo} = this.state;
        return (
            <Container>
                <Row>
                    <Col style={{marginBottom: 10}}>
                        <Button
                            tooltip="Visualizar perfil da banda"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-user"
                            className="p-button-rounded p-button-info"
                            onClick={() => this.state.navigateTo(`/servicos/bandas/${band.uuid}`)}
                        />
                    </Col>
                    <Col style={{marginBottom: 10}}>
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
                            onClick={
                                () => this.setState(
                                    {showingToggleActiveStatusDialog: true, selectedBand: band}
                                )
                            }
                        />
                    </Col>
                    <Col style={{marginBottom: 10}}>
                        <Button
                            disabled={!band.active}
                            tooltip="Editar banda"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-pencil"
                            className="p-button-rounded p-button-warning"
                            onClick={() => navigateTo(`/bandas/${band.uuid}/editar`)}
                        />
                    </Col>
                    <Col style={{marginBottom: 10}}>
                        <Button
                            disabled={!band.active}
                            tooltip="Administrar músicos"
                            tooltipOptions={{position: 'top'}}
                            className="musician-button"
                            onClick={() => navigateTo(`/bandas/${band.uuid}/gerenciar-musicos`)}
                        />
                    </Col>
                    <Col style={{marginBottom: 10}}>
                        <Button
                            disabled={!band.active}
                            tooltip="Administrar músicas"
                            tooltipOptions={{position: 'top'}}
                            className="music-button"
                            onClick={() => navigateTo(`/bandas/${band.uuid}/gerenciar-musicas`)}
                        />
                    </Col>
                    <Col style={{marginBottom: 10}}>
                        <Button
                            disabled={!band.active}
                            tooltip="Pedidos de orçamentos"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-dollar"
                            className="p-button-rounded p-button-success"
                            onClick={() => navigateTo(`/bandas/${band.uuid}/pedidos-de-orcamento`)}
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
