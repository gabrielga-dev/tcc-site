import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {Toast} from "primereact/toast";
import {connect} from "react-redux";
import {Col, Container, Row} from "react-bootstrap";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Card} from "primereact/card";
import {MusicCriteria} from "../../../../../../domain/new/music/request/music.criteria";
import {Accordion, AccordionTab} from "primereact/accordion";
import {TextFieldComponent} from "../../../../../../components/form/input/text_field.component";
import {FormEndingComponent} from "../../../../../../components/form_ending.component";
import {MusicService} from "../../../../../../service/new/music.service";
import {MusicResponse} from "../../../../../../domain/new/music/response/music.response";
import {PageableDto} from "../../../../../../domain/new/dto/page/pageable.dto";
import {ToastUtils} from "../../../../../../util/toast.utils";
import {PaginationDto} from "../../../../../../domain/new/dto/page/pagination.dto";
import {Button} from "primereact/button";
import {Paginator} from "primereact/paginator";
import {StyleConstants} from "../../../../../../service/style.constants";
import {TabPanel, TabView} from "primereact/tabview";
import {
    QuoteRequestMusicPartRequest
} from "../../../../../../domain/new/quote_request/music/request/quote_request_music_part.request";

const SelectMusicsStep = ({token, user, currentStep, reference, updatePlaylist}) => {
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
            <_SelectMusicsStep
                ref={reference}
                token={token}
                authenticatedUser={user}
                navigateTo={redirectTo}
                showToast={showToast}
                currentStep={currentStep}
                updatePlaylist={updatePlaylist}
            />
        </>
    );
}

class _SelectMusicsStep extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            currentStep: this.props.currentStep,

            musicCriteria: new MusicCriteria(),
            first: 0,
            pagination: new PaginationDto(5),
            pageable: new PageableDto(),
            playlist: [],

            musics: [],
            selectedMusics: [],

            updatePlaylist: this.props.updatePlaylist,
        }
    }

    componentDidMount() {
        this.findMusics();
    }

    findMusics() {
        this.setState({isLoading: true});
        let {token, musicCriteria, pagination} = this.state;

        MusicService.LIST_MUSICS(token, musicCriteria, pagination)
            .then(response => {
                let musics = response.data.content.map(music => (new MusicResponse(music)));
                this.setState({pageable: new PageableDto(response.data), musics: musics});
            }).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isLoading: false}));
    }

    updateStep(newStep) {
        this.setState({currentStep: newStep});
    }

    render() {
        if (this.state.currentStep !== 1) {
            return (<></>);
        }
        let {activeTabIndex} = this.state;
        return (
            <Card className='main-card'>
                <Container>
                    <TabView
                        activeIndex={activeTabIndex}
                        onTabChange={(e) => this.setState({activeTabIndex: e.index})}
                    >
                        <TabPanel header="Músicas disponíveis">
                            {this.renderSelectMusicSection()}
                        </TabPanel>
                        <TabPanel header="Repertório">
                            {this.renderPlaylistSection()}
                        </TabPanel>
                    </TabView>
                </Container>
            </Card>
        )
    }

    addToPlaylist(musics) {
        if (musics) {
            let mappedMusics = musics.map(
                (m) => (new QuoteRequestMusicPartRequest(m))
            );

            let {playlist, updatePlaylist} = this.state;
            playlist = mappedMusics.concat(playlist);
            playlist.forEach(
                (musicPart, index) => {
                    musicPart.order = index + 1;
                }
            );
            this.setState({playlist: playlist});
            updatePlaylist(playlist);
        }
    }

    removeFromPlayList(music) {
        if (music) {
            let {playlist, updatePlaylist} = this.state;
            playlist = playlist.filter(m => (m.order !== music.order));
            playlist.forEach(
                (musicPart, index) => {
                    musicPart.order = index + 1;
                }
            );
            this.setState({playlist: playlist});
            updatePlaylist(playlist);
        }
    }

    addSelectedMusic(music) {
        if (music) {
            let {selectedMusics} = this.state;
            selectedMusics.push(music);
            this.setState({selectedMusics: selectedMusics});
        }
    }

    removeSelectedMusic(music) {
        if (music) {
            let {selectedMusics} = this.state;
            selectedMusics = selectedMusics.filter(m => (m.uuid !== music.uuid));
            this.setState({selectedMusics: selectedMusics});
        }
    }

    isMusicSelected(music) {
        if (music) {
            let {selectedMusics} = this.state;
            return selectedMusics.some(m => (m.uuid === music.uuid));
        }
    }

    renderSelectMusicSection() {
        let {musics, selectedMusics, pagination, pageable, isLoading} = this.state;
        return (
            <Container>
                <Row>
                    <h3>Selecione as músicas</h3>
                    {this.renderCriteria()}
                </Row>
                <Row>
                    <Col>
                        <DataTable
                            loading={isLoading}
                            value={musics}
                            reorderableColumns={false}
                            reorderableRows={true}
                            onRowReorder={e => this.onRowReorder(e.value)}
                            responsiveLayout="scroll"
                            size='small'
                            emptyMessage='Nenhuma música encontrada 😢'
                            rowHover={true}
                        >
                            <Column field='name' header="Nome"/>
                            <Column field="artist" header="Artista"/>
                            <Column field="author" header="Autor"/>
                            <Column
                                style={{width: '20%'}}
                                header="Ações"
                                body={
                                    (music) => this.renderMusicButtons(music)
                                }
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
                <Row>
                    <Col md={8} sm={0}/>
                    <Col md={4} sm={12}>
                        <Button
                            disabled={selectedMusics.length === 0}
                            style={StyleConstants.WIDTH_100_PERCENT}
                            className='p-button-success'
                            label='Adicionar músicas ao repertório'
                            icon='pi pi-plus'
                            iconPos='right'
                            onClick={
                                () => {
                                    this.addToPlaylist(selectedMusics);
                                    this.setState({selectedMusics: []});
                                }
                            }
                        />
                    </Col>
                </Row>
            </Container>
        );
    }

    renderMusicButtons(music) {
        let {isLoading} = this.state;

        let isSelected = this.isMusicSelected(music);

        let icon = isSelected ? "pi pi-circle-fill" : "pi pi-circle";
        let buttonClass = !isSelected ? "p-button-info" : "p-button-warning";
        let toolTip = isSelected ? "Desselecionar" : "Selecionar";

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
                                    this.removeSelectedMusic(music);
                                } else {
                                    this.addSelectedMusic(music);
                                }
                            }}
                        />
                    </Col>
                    <Col sm={12} md={6} style={{marginBottom: 10}}>
                        <Button
                            disabled={isLoading}
                            tooltip='Adicionar ao repertório'
                            tooltipOptions={{position: 'top'}}
                            icon='pi pi-plus'
                            className='p-button-rounded p-button-success'
                            onClick={() => {
                                this.addToPlaylist([music]);
                            }}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }

    renderCriteria() {
        let {musicCriteria, isLoading} = this.state;
        let {name, author, artist} = musicCriteria;
        return (
            <Col>
                <Accordion>
                    <AccordionTab header="Filtros">
                        <Container>
                            <Row>
                                <Col>
                                    <TextFieldComponent
                                        disabled={isLoading}
                                        optional={true}
                                        label='Nome'
                                        placeHolder='Digite o nome da música aqui'
                                        value={name}
                                        maxLength={45}
                                        onChange={newValue => this.changeValue('name', newValue)}
                                    />
                                </Col>
                                <Col>
                                    <TextFieldComponent
                                        disabled={isLoading}
                                        optional={true}
                                        label='Autor'
                                        placeHolder='Digite o nome do autor aqui'
                                        value={author}
                                        maxLength={60}
                                        onChange={newValue => this.changeValue('author', newValue)}
                                    />
                                </Col>
                                <Col>
                                    <TextFieldComponent
                                        disabled={isLoading}
                                        optional={true}
                                        label='Artista'
                                        placeHolder='Digite o nome do artista aqui'
                                        value={artist}
                                        maxLength={60}
                                        onChange={newValue => this.changeValue('artist', newValue)}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6} sm={0}/>
                                <Col md={6} sm={12}>
                                    <FormEndingComponent
                                        showFirst={false}
                                        onClickSecond={() => {
                                            this.setState({musicCriteria: new MusicCriteria()});
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
        );
    }

    changeValue(field, newValue) {
        let {musicCriteria} = this.state;
        musicCriteria[field] = newValue;
        this.setState({musicCriteria: musicCriteria});
    }

    onRowReorder(resortedMusics) {
        resortedMusics.forEach((music, index) => music.order = index + 1)
        this.setState({playlist: resortedMusics});
    }

    renderPlaylistSection() {
        let {isLoading, playlist} = this.state;
        return (
            <Container>
                <Row>
                    <Col>
                        <h3>Organize as músicas</h3>
                        <DataTable
                            loading={isLoading}
                            value={playlist}
                            reorderableColumns={false}
                            reorderableRows={true}
                            onRowReorder={e => this.onRowReorder(e.value)}
                            responsiveLayout="scroll"
                            size='small'
                            emptyMessage='Nenhuma música selecionada'
                        >
                            <Column rowReorder style={{width: '3em'}}/>
                            <Column field='order' header="#"/>
                            <Column field='musicName' header="Nome"/>
                            <Column field="musicArtist" header="Artista"/>
                            <Column
                                style={{width: '40%'}}
                                header="Ações"
                                body={
                                    (music) => this.renderPlaylistObservation(music)
                                }
                            />
                            <Column
                                style={{width: '10%'}}
                                header="Ações"
                                body={
                                    (music) => this.renderPlaylistButtons(music)
                                }
                            />
                        </DataTable>
                    </Col>
                </Row>
            </Container>
        );
    }

    renderPlaylistButtons(music) {
        let {isLoading} = this.state;
        return (
            <Button
                disabled={isLoading}
                tooltip='Remover do repertório'
                tooltipOptions={{position: 'top'}}
                icon='pi pi-trash'
                className='p-button-rounded p-button-danger'
                onClick={() => {
                    this.removeFromPlayList(music);
                }}
            />
        );
    }

    renderPlaylistObservation(music) {
        let {playlist, updatePlaylist} = this.state;
        let index = music.order - 1

        return (
            <TextFieldComponent
                label={''}
                optional={true}
                placeHolder='Escreva uma observação aqui'
                value={playlist[index].observation}
                onChange={
                    (newValue) => {
                        playlist[index].observation = newValue;
                        this.setState({playlist: playlist});
                        updatePlaylist(playlist);
                    }
                }
            />
        );
    }
}

const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(SelectMusicsStep);
