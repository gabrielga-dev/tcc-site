import React, {useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import {connect} from "react-redux";
import {Col, Container, Row} from "react-bootstrap";
import {Card} from "primereact/card";
import HomeTemplate from "../../../template/home_template";
import {ActivityIndicatorComponent} from "../../../../components/activity_indicator.component";
import {BandService} from "../../../../service/new/band.service";
import {MusicService} from "../../../../service/new/music.service";
import {ToastUtils} from "../../../../util/toast.utils";
import {MusicResponse} from "../../../../domain/new/music/response/music.response";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import './list_band_musics.style.css'
import {StyleConstants} from "../../../../service/style.constants";
import {BandProfileDto} from "../../../../domain/new/dto/band/band_profile.dto";
import {ConfirmDialog} from "primereact/confirmdialog";
import {PaginationDto} from "../../../../domain/new/dto/page/pagination.dto";
import {PageableDto} from "../../../../domain/new/dto/page/pageable.dto";
import {Paginator} from "primereact/paginator";
import {MusicCriteria} from "../../../../domain/new/music/request/music.criteria";
import {Accordion, AccordionTab} from "primereact/accordion";
import {TextFieldComponent} from "../../../../components/form/input/text_field.component";
import {FormEndingComponent} from "../../../../components/form_ending.component";

const ListBandMusicsPage = ({token, user}) => {
    const toast = useRef(null);
    let {band_uuid, cpf} = useParams();
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
            <_ListBandMusicsPage
                token={token}
                authenticatedUser={user}
                navigateTo={redirectTo}
                showToast={showToast}
                bandUuid={band_uuid}
                cpf={cpf}
            />
        </>
    );
}

class _ListBandMusicsPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bandUuid: props.bandUuid,
            isMasterLoading: true,
            isTableLoading: true,
            isLoading: true,
            token: props.token,
            authenticatedUser: props.authenticatedUser,
            navigateTo: props.navigateTo,
            showToast: props.showToast,

            bandName: '',

            musics: [],
            pagination: new PaginationDto(10),
            first: 0,
            pageable: new PageableDto(),
            criteria: new MusicCriteria(),

            selectedMusic: null,
        }
    }

    componentDidMount() {
        this.setState({isMasterLoading: true, isTableLoading: true, isLoading: true});

        let {bandUuid, token} = this.state;

        BandService.FIND_PROFILE(bandUuid, token)
            .then(response => {
                let profile = new BandProfileDto(response.data);
                this.setState({bandName: profile.name});
                this.findMusics();
            }).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isTableLoading: false, isMasterLoading: false, isLoading: false}));
    }

    findMusics(passedCriteria=null) {
        this.setState({isTableLoading: true});

        let {bandUuid, token, criteria, pagination} = this.state;

        MusicService.LIST_BAND_MUSICS(bandUuid, token, passedCriteria ? passedCriteria : criteria, pagination)
            .then(response => {
                let musics = response.data.content.map(music => (new MusicResponse(music)));
                this.setState({pageable: new PageableDto(response.data), musics: musics});
            }).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isTableLoading: false}));
    }

    render() {
        if (this.state.isMasterLoading) {
            return (<ActivityIndicatorComponent/>);
        }

        let {isTableLoading, musics, navigateTo, pagination, pageable, criteria} = this.state;
        return (
            <HomeTemplate steps={['Home', 'Bandas', this.state.bandName, 'Gerenciar Músicas']}>
                <Card className='main-card'>
                    <Container>
                        <Row>
                            <Col sm={12} md={8}/>
                            <Col sm={12} md={4} style={{marginBottom: 10}}>
                                <Button
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    label='Adicionar uma nova música'
                                    icon='pi pi-pencil'
                                    onClick={
                                        () => navigateTo('criar')
                                    }
                                />
                            </Col>
                        </Row>
                        <ConfirmDialog
                            visible={!!this.state.selectedMusic}
                            onHide={() => this.setState({selectedMusic: null})}
                            message={
                                `Você quer mesmo ${
                                    this.state.selectedMusic?.active ? 'desativar' : 'ativar'
                                } esta música?`
                            }
                            header={`${this.state.selectedMusic?.active ? 'Desativar' : 'Ativar'} música`}
                            icon="pi pi-exclamation-triangle"

                            acceptLabel='Sim'
                            acceptClassName={
                                this.state.selectedMusic?.active
                                    ? 'p-button-danger' : 'p-button-success'
                            }
                            rejectLabel='Não'
                            rejectClassName={
                                this.state.selectedMusic?.active
                                    ? 'p-button-success p-button-text' : 'p-button-danger p-button-text'
                            }

                            accept={() => this.changeMusicStatus()}
                            reject={() => this.setState({selectedMusic: null})}/>
                        <Row>
                            <Col>
                                <Accordion>
                                    <AccordionTab header="Filtros">
                                        <Container>
                                            <Row>
                                                <Col md={4} sm={12} style={{marginBottom: 5}}>
                                                    <TextFieldComponent
                                                        disabled={isTableLoading}
                                                        maxLength={45}
                                                        value={criteria.name}
                                                        optional={true}
                                                        label='Nome'
                                                        placeHolder='Digite o nome da música'
                                                        onChange={(value) => this.setCriteriaValue('name', value)}
                                                    />
                                                </Col>
                                                <Col md={4} sm={12} style={{marginBottom: 5}}>
                                                    <TextFieldComponent
                                                        disabled={isTableLoading}
                                                        maxLength={60}
                                                        value={criteria.author}
                                                        optional={true}
                                                        label='Autor'
                                                        placeHolder='Digite o nome do autor da música'
                                                        onChange={(value) => this.setCriteriaValue('author', value)}
                                                    />
                                                </Col>
                                                <Col md={4} sm={12} style={{marginBottom: 5}}>
                                                    <TextFieldComponent
                                                        disabled={isTableLoading}
                                                        maxLength={60}
                                                        value={criteria.artist}
                                                        optional={true}
                                                        label='Artista'
                                                        placeHolder='Digite o nome do artista da música'
                                                        onChange={(value) => this.setCriteriaValue('artist', value)}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={6} sm={0}/>
                                                <Col md={6} sm={12}>
                                                    <FormEndingComponent
                                                        showFirst={false}
                                                        onClickSecond={() => {
                                                            this.setState({criteria: new MusicCriteria()});
                                                            this.findMusics(new MusicCriteria());
                                                        }}
                                                        onClickThird={() => this.findMusics()}
                                                    />
                                                </Col>
                                            </Row>
                                        </Container>
                                    </AccordionTab>
                                </Accordion>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <DataTable
                                    loading={isTableLoading}
                                    value={musics}
                                    responsiveLayout="scroll"
                                    size="small"
                                    emptyMessage='Nenhuma música registrada para essa banda 😢'
                                    rowClassName={this.rowClass}
                                >
                                    <Column field='name' header="Nome"/>
                                    <Column field="artist" header="Artista"/>
                                    <Column field="author" header="Autor"/>
                                    <Column
                                        style={{width: '20%'}}
                                        header="Ações"
                                        body={(band) => this.renderBandActions(band)}
                                    />
                                </DataTable>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Paginator
                                    first={this.state.first}
                                    number={pagination.page}
                                    rows={pagination.quantityPerPage}
                                    totalRecords={pageable.totalElements}
                                    onPageChange={(e) => {
                                        let {pagination} = this.state;
                                        pagination.page = e.page;
                                        this.setState({pagination: pagination, first: e.first})
                                        this.findMusics()
                                    }}/>
                            </Col>
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    rowClass(band) {
        return {
            'row-accessories': !band.active
        }
    }

    setCriteriaValue(key, value) {
        let {criteria} = this.state;
        criteria[key] = value;
        this.setState({criteria: criteria});
    }

    renderBandActions(music) {
        let {navigateTo, bandUuid, isLoading} = this.state;
        return (
            <Container>
                <Row>
                    <Col sm={12} md={6} style={{marginBottom: 10}}>
                        <Button
                            disabled={isLoading || !music.active}
                            tooltip="Editar"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-pencil"
                            className="p-button-rounded p-button-warning"
                            onClick={() => navigateTo(`/bandas/${bandUuid}/gerenciar-musicas/${music.uuid}/editar`)}
                        />
                    </Col>
                    <Col sm={12} md={6} style={{marginBottom: 10}}>
                        <Button
                            disabled={isLoading}
                            tooltip={music.active ? 'Desativar' : 'Ativar'}
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-power-off"
                            className={`p-button-rounded p-button-${music.active ? 'danger' : 'success'}`}
                            onClick={() => this.setState({selectedMusic: music})}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }

    changeMusicStatus() {
        this.setState({isLoading: true});
        let {selectedMusic, token} = this.state;

        let deactivating = selectedMusic.active;

        (
            deactivating
                ? MusicService.DEACTIVATE(selectedMusic.uuid, token)
                : MusicService.ACTIVATE(selectedMusic.uuid, token)
        ).then(
            () => {
                this.state.showToast(
                    ToastUtils.BUILD_TOAST_SUCCESS_BODY(
                        `Musica ${deactivating ? 'desativada' : 'ativada'} com sucesso!`
                    )
                );
                this.findMusics();
            }
        ).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isLoading: false}));
    }
}

const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(ListBandMusicsPage);
