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
        }
    }

    componentDidMount() {
        this.setState({isMasterLoading: true, isTableLoading: true, isLoading: true});

        let {bandUuid, token} = this.state;

        BandService.FIND_PROFILE(bandUuid, token)
            .then(response => {
                let profile = new BandProfileDto(response.data);
                this.setState({bandName: profile.name, musics: profile.musics});
            }).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isTableLoading: false, isMasterLoading: false}));
    }

    findMusics() {
        this.setState({isTableLoading: true});

        let {bandUuid, token} = this.state;

        MusicService.LIST_BAND_MUSICS(bandUuid, token)
            .then(response => {
                let musics = response.data.map(music => (new MusicResponse(music)));
                this.setState({musics: musics});
            }).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isTableLoading: false}));
    }

    render() {
        if (this.state.isMasterLoading) {
            return (<ActivityIndicatorComponent/>);
        }

        let {isTableLoading, musics} = this.state;
        return (
            <HomeTemplate steps={['Home', 'Bandas', this.state.bandName, 'Gerenciar Músicas']}>
                <Card>
                    <Container>
                        <Row>
                            <Col sm={12} md={4}/>
                            <Col sm={12} md={4}/>
                            <Col sm={12} md={4}>
                                <Button
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    label='Adicionar uma nova música'
                                    icon='pi pi-pencil'
                                    onClick={
                                        () => {
                                            //todo
                                        }
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <DataTable
                                    loading={isTableLoading}
                                    value={musics}
                                    responsiveLayout="scroll"
                                    size="small"
                                    emptyMessage='Nenhuma música registarda para essa banda 😢'
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

    renderBandActions(music) {
        let {navigateTo, bandUuid} = this.state;
        return (
            <Container>
                <Row>
                    <Col sm={12} md={6} style={{marginBottom: 10}}>
                        <Button
                            tooltip="Editar"
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-pencil"
                            className="p-button-rounded p-button-warning"
                            onClick={() => navigateTo(`/bandas/${bandUuid}/gerenciar-musicas/${music.uuid}/editar`)}
                        />
                    </Col>
                    <Col sm={12} md={6} style={{marginBottom: 10}}>
                        <Button
                            tooltip={music.active ? 'Desativar' : 'Ativar'}
                            tooltipOptions={{position: 'top'}}
                            icon="pi pi-power-off"
                            className={`p-button-rounded p-button-${music.active ? 'danger' : 'success'}`}
                            onClick={() => {
                            }}
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
export default connect(mapStateToProps)(ListBandMusicsPage);
