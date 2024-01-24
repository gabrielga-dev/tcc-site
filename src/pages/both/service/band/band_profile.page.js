import React, {useRef} from "react";
import {updateToken} from "../../../../service/redux/action/token.action";
import {updateUser} from "../../../../service/redux/action/user.action";
import {connect} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import HomeTemplate from "../../../template/home_template";
import {BandService} from "../../../../service/new/band.service";
import {ActivityIndicatorComponent} from "../../../../components/activity_indicator.component";
import {BandProfileDto} from "../../../../domain/new/dto/band/band_profile.dto";
import {ToastUtils} from "../../../../util/toast.utils";
import {Col, Container, Row} from "react-bootstrap";
import {Avatar} from "primereact/avatar";
import {FileService} from "../../../../service/new/file.service";
import {Card} from "primereact/card";
import {Image} from "primereact/image";
import {TabPanel, TabView} from "primereact/tabview";
import {Button} from "primereact/button";
import {StyleConstants} from "../../../../service/style.constants";
import {MarginStyle} from "../../../../style/margin.style";
import {ConfirmDialog} from "primereact/confirmdialog";
import {MusicianForm} from "../../../../domain/new/form/musician/musician.form";
import axios from "axios";
import {LocationService} from "../../../../service/new/location.service";
import {StateDto} from "../../../../domain/new/dto/state.dto";
import {Toast} from "primereact/toast";
import {MusicianService} from "../../../../service/new/musician.service";

const BandProfilePage = ({token, user}) => {
    let {uuid} = useParams();

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
            <Toast ref={toast}/>
            <_BandProfilePage
                token={token}
                user={user}
                navigateTo={redirectTo}
                authenticatedUser={user}
                bandUuid={uuid}
                showToast={showToast}
            />
        </>
    );
}

class _BandProfilePage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,

            bandUuid: props.bandUuid,
            band: new BandProfileDto(),
            user: props.user,
            bandName: 'Banda',

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            disableBandPopUpVisible: false,

            //create musician
            isCreateMusicianModalVisible: true,
            musician: new MusicianForm(),
            profilePictureUuid: null,

            states: [],
            selectedState: null,
            cities: [],
            selectedCity: null,
        }
    }

    componentDidMount() {
        this.setState({isLoading: true})
        axios.all(
            [
                BandService.FIND_BAND_BY_UUID(this.state.bandUuid),
                LocationService.GET_BRAZIL_STATES()
            ]
        ).then(
            responses => {
                //band
                let band = new BandProfileDto(responses[0].data)
                this.setState({band, bandName: band.name})

                //states
                let newStates = responses[1].data.map(s => (new StateDto(s)))
                this.setState({states: newStates})
            }
        ).catch(errors => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(errors[0]))
        ).finally(() => this.setState({isLoading: false}))
    }

    render() {
        let {bandName} = this.state
        return (
            <HomeTemplate steps={['Serviços', 'Bandas', bandName]}>
                {this.renderProfile()}
            </HomeTemplate>
        );
    }

    renderProfile() {
        let {isLoading, band} = this.state
        if (isLoading || !band.uuid) {
            return (<ActivityIndicatorComponent/>)
        }
        return (
            <Card>
                <Container>
                    <Row>
                        <Col/>
                        <Col>
                            <Row>
                                <Col style={STYLE_ALIGN_ITEM_CENTER}>
                                    {
                                        !!!band.profilePictureUuid
                                            ? (<Avatar label={band.name[0]} size="xlarge"/>)
                                            : (
                                                <Image
                                                    src={FileService.GET_IMAGE_URL(band.profilePictureUuid)}
                                                    alt={`Imagem da banda ${band.name}`}
                                                    width="250"
                                                    height="250"
                                                />
                                            )
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <h3 align="center">{band.name}</h3>
                                </Col>
                            </Row>
                        </Col>
                        <Col/>
                    </Row>
                    <hr/>
                    {this.renderOwnerButtons()}
                    <Row>
                        <Col>
                            <TabView activeIndex={0}>
                                <TabPanel header="Sobre nós">
                                    {band.description}
                                </TabPanel>
                                <TabPanel header="Eventos">
                                    Eventos
                                </TabPanel>
                                <TabPanel header="Integrantes">
                                    {this.renderMusicians()}
                                </TabPanel>
                            </TabView>
                        </Col>
                    </Row>
                    <hr/>
                </Container>
            </Card>
        );
    }

    renderOwnerButtons() {
        let {band, user, navigateTo} = this.state;
        if (!user || (user.uuid !== band.ownerUuid)) {
            return null;
        }
        return (
            <Row>
                <Col>
                    <Button
                        id="disable-band-button"
                        label="Editar"
                        icon="pi pi-pencil"
                        style={StyleConstants.WIDTH_100_PERCENT}
                        className="p-button-warning"
                        onClick={() => navigateTo(`/servicos/bandas/${band.uuid}/editar`)}
                    />
                </Col>
                <Col>
                    <Button
                        label={band.active ? "Desativar" : "Ativar"}
                        icon={band.active ? "pi pi-trash" : "pi pi-check"}
                        style={StyleConstants.WIDTH_100_PERCENT}
                        className={band.active ? "p-button-danger" : "p-button-success"}
                        onClick={() => this.setState({disableBandPopUpVisible: true})}
                    />
                    <ConfirmDialog
                        visible={this.state.disableBandPopUpVisible}
                        onHide={() => this.setState({disableBandPopUpVisible: false})}
                        message={
                            band.active ? "Você deseja mesmo desabilitar esta banda?"
                                : "Você deseja mesmo habilitar esta banda?"}
                        header="Confirmar"
                        icon="pi pi-exclamation-triangle"

                        acceptIcon={band.active ? "pi pi-trash" : "pi pi-check"}
                        rejectIcon="pi pi-times"

                        accept={() => this.toggleBandActivityFlag()}
                        reject={() => console.log(2)}
                    />
                </Col>
            </Row>
        )
    }

    toggleBandActivityFlag() {
        let {band, token, navigateTo} = this.state;
        this.setState({isLoading: true});
        BandService.TOGGLE_BAND_ACTIVITY_FLAG(band.uuid, token)
            .then(
                response => {
                    navigateTo('/')
                }
            ).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isLoading: false}))
    }

    renderMusicians() {
        let {band, bandUuid, user, navigateTo} = this.state
        let isBandOwner = (user && (user.uuid === band.ownerUuid));

        let cols = band.musicians.map(
            musician => (
                <Col key={musician.uuid} lg={3} md={6} sm={12} style={MarginStyle.makeMargin(0, 5, 0, 5)}>
                    <Card>
                        <Container>
                            <Row>
                                <Col style={STYLE_ALIGN_ITEM_CENTER}>
                                    {
                                        !!!musician.avatarUuid
                                            ? (<Avatar label={musician.firstName[0]} size=" large"/>)
                                            : (
                                                <Image
                                                    src={FileService.GET_IMAGE_URL(musician.avatarUuid)}
                                                    alt={`Imagem do integrante ${musician.name}`}
                                                    width="100"
                                                    height="100"
                                                />
                                            )
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12} style={STYLE_ALIGN_ITEM_CENTER}>
                                    <h5>{`${musician.firstName} ${musician.lastName[0]}.`}</h5>
                                </Col>
                                <Col md={12} style={STYLE_ALIGN_ITEM_CENTER}>
                                    <h6>{`${musician.age} anos`}</h6>
                                </Col>
                            </Row>
                            <Row>
                                {
                                    isBandOwner
                                        ? (
                                            <>
                                                <Col>
                                                    <Button
                                                        style={StyleConstants.WIDTH_100_PERCENT}
                                                        icon="pi pi-pencil"
                                                        className="p-button-warning"
                                                        onClick={() => this.updateMusician(musician.uuid)}
                                                    />
                                                </Col>
                                                <Col>
                                                    <Button
                                                        style={StyleConstants.WIDTH_100_PERCENT}
                                                        icon="pi pi-trash"
                                                        className="p-button-danger"
                                                        onClick={() => this.deleteMusician(musician.uuid)}
                                                    />
                                                </Col>
                                            </>
                                        )
                                        : null
                                }
                            </Row>
                        </Container>
                    </Card>
                </Col>
            )
        )

        let {isDeleteMusicianVisible, selectedMusician} = this.state

        return (
            <Container>
                <Row>
                    <Col md={4} sm={12}>
                        {
                            isBandOwner
                                ? (
                                    <Button
                                        style={StyleConstants.WIDTH_100_PERCENT}
                                        icon="pi pi-user-plus"
                                        label="Adicionar"
                                        onClick={() => navigateTo(`/servicos/bandas/${bandUuid}/adicionar-musico`)}
                                    />
                                )
                                : null
                        }
                    </Col>
                </Row>
                <br/>
                <ConfirmDialog
                    visible={isDeleteMusicianVisible}
                    onHide={() => this.setState({isDeleteMusicianVisible: false})}
                    message={`Você quer mesmo excluir o dado de ${selectedMusician?.firstName}?`}
                    header="Excluir músico?"
                    icon="pi pi-exclamation-triangle"

                    acceptLabel="Sim"
                    acceptClassName="p-button-danger"
                    rejectLabel="Não"
                    rejectClassName="p-button-info"


                    accept={() => this.acceptExclusion()}
                    reject={() => this.setState({selectedMusician: null, isDeleteMusicianVisible: false})}
                />
                <Row>
                    {cols}
                </Row>
            </Container>
        )
    }

    updateMusician(musicianUuid) {
        let {navigateTo, band} = this.state;
        navigateTo(`/servicos/bandas/${band.uuid}/musico/${musicianUuid}/editar`);
    }

    deleteMusician(musicianUuid) {
        let {band} = this.state;
        let selectedMusician = band.musicians.filter(m => (m.uuid === musicianUuid))[0];
        this.setState({
            selectedMusician,
            isDeleteMusicianVisible: true
        });
    }

    acceptExclusion() {
        let {showToast} = this.state;
        let {selectedMusician, band, token} = this.state;
        this.setState({isLoading: true});
        MusicianService.DELETE(band.uuid, selectedMusician.uuid, token)
            .then(
                () => {
                    band.removeMusician(selectedMusician.uuid);
                    this.setState({band})
                    showToast(ToastUtils.BUILD_TOAST_SUCCESS_BODY("Músico removido com sucesso!"));
                }
            ).catch(error => showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(
                () => {
                    this.setState({isLoading: false, selectedMusician: null, isDeleteMusicianVisible: false});
                }
            )
    }
}

const STYLE_ALIGN_ITEM_CENTER = {display: 'flex', alignItems: 'center', justifyContent: 'center'};

const myMapDispatchToProps = {
    updateToken: updateToken,
    updateUser: updateUser,
};
const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps, myMapDispatchToProps)(BandProfilePage);
