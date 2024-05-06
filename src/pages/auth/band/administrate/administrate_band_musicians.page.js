import React, {useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import {connect} from "react-redux";
import {BandService} from "../../../../service/new/band.service";
import {BandProfileDto} from "../../../../domain/new/dto/band/band_profile.dto";
import {ToastUtils} from "../../../../util/toast.utils";
import HomeTemplate from "../../../template/home_template";
import {Card} from "primereact/card";
import {Col, Container, Row} from "react-bootstrap";
import {ActivityIndicatorComponent} from "../../../../components/activity_indicator.component";
import {Button} from "primereact/button";
import {StyleConstants} from "../../../../service/style.constants";
import {FileService} from "../../../../service/new/file.service";
import {Divider} from "primereact/divider";
import {MusicianResponse} from "../../../../domain/new/musician/response/musician.response";
import {Dialog} from "primereact/dialog";
import {MusicianService} from "../../../../service/new/musician.service";
import './administrate_band_musicians.style.css';
import {Tag} from "primereact/tag";

const AdministrateBandMusicians = ({token, user}) => {
    const toast = useRef(null);
    let {band_uuid} = useParams();
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
            <_AdministrateBandMusicians
                token={token}
                authenticatedUser={user}
                navigateTo={redirectTo}
                showToast={showToast}
                bandUuid={band_uuid}
            />
        </>
    );
}

class _AdministrateBandMusicians extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bandUuid: props.bandUuid,
            isMasterLoading: true,
            isLoading: true,
            token: props.token,
            authenticatedUser: props.authenticatedUser,
            navigateTo: props.navigateTo,
            showToast: props.showToast,

            bandProfile: new BandProfileDto(),

            selectedMusician: new MusicianResponse(),
            showDeleteDialog: false,
        }
    }

    componentDidMount() {
        this.setState({isLoading: true, isMasterLoading: true});
        let {bandUuid, token} = this.state;
        BandService.FIND_PROFILE(bandUuid, token)
            .then(response => {
                const profile = new BandProfileDto(response.data);
                this.setState({bandProfile: profile});
            }).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isLoading: false, isMasterLoading: false}))
    }

    render() {
        let {isLoading, isMasterLoading} = this.state;
        if (isMasterLoading) {
            return (<ActivityIndicatorComponent/>)
        }
        let {navigateTo} = this.state;
        return (
            <HomeTemplate steps={['Home', 'Bandas', this.state.bandProfile?.name, 'Gerenciar Músicos']}>
                <Card className='main-card'>
                    <Container>
                        <Row>
                            <Col md={4} sm={0}/>
                            <Col md={4} sm={12}>
                                <Button
                                    disabled={isLoading}
                                    label="Cadastrar"
                                    className="p-button-success"
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    icon="pi pi-plus"
                                    onClick={() => navigateTo("criar")}
                                />
                            </Col>
                            <Col md={4} sm={12}>
                                <Button
                                    disabled={isLoading}
                                    label="Vincular"
                                    className="info"
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    icon="pi pi-plus"
                                    onClick={() => navigateTo("vincular")}
                                />
                            </Col>
                        </Row>
                        <Divider align="center"><span>Músicos vinculados à banda</span></Divider>
                        <Row>
                            <Col>
                                {this.renderMusicians()}
                                <Dialog
                                    header={
                                        this.state.disassociate
                                            ? 'Desvincular Músico'
                                            : (
                                                this.selectedMusician?.active
                                                    ? 'Desativar Músico'
                                                    : 'Ativar Músico'
                                            )
                                    }
                                    visible={this.state.showDeleteDialog}
                                    style={{width: '50vw'}}
                                    footer={
                                        () => (
                                            <div>
                                                <Button
                                                    label="Não"
                                                    icon="pi pi-times"
                                                    onClick={
                                                        () => this.setState({
                                                            selectedMusician: null,
                                                            showDeleteDialog: false,
                                                            disassociate: null
                                                        })
                                                    }
                                                    className={
                                                        this.state.disassociate
                                                            ? "p-button-success p-button-text"
                                                            : (
                                                                this.state.selectedMusician?.active
                                                                    ? 'p-button-success p-button-text'
                                                                    : 'p-button-danger p-button-text'
                                                            )
                                                    }
                                                />
                                                <Button
                                                    label="Sim"
                                                    icon="pi pi-check"
                                                    onClick={() => {
                                                        let {disassociate} = this.state;
                                                        if (disassociate) {
                                                            this.disassociateMusician();
                                                        } else {
                                                            this.deleteMusician();
                                                        }
                                                    }}

                                                    className={
                                                        this.state.disassociate
                                                            ? "p-button-danger"
                                                            : (
                                                                this.state.selectedMusician?.active
                                                                    ? 'p-button-danger'
                                                                    : 'p-button-success'
                                                            )
                                                    }
                                                    autoFocus
                                                />
                                            </div>
                                        )
                                    }
                                    onHide={
                                        () => this.setState(
                                            {selectedMusician: null, showDeleteDialog: false, disassociate: null}
                                        )
                                    }
                                    closable={false}
                                    draggable={false}
                                >
                                    <p>{this.generateRemoveMessage()}</p>
                                </Dialog>
                            </Col>
                        </Row>
                        <Divider align="center"><span>Músicos criados pela banda</span></Divider>
                        <Row>
                            {this.renderMusicians(false)}
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    generateRemoveMessage() {
        let {disassociate, selectedMusician} = this.state;

        if (!selectedMusician) {
            return '';
        }
        if (disassociate) {
            return `Você deseja desvincular o músico ${selectedMusician.firstName}?`;
        }
        return `Você deseja ${selectedMusician.active ? 'desativar' : 'ativar'} o músico ${selectedMusician.firstName}?`;
    }

    renderMusicians(onlyAssociated = true) {
        if (this.state.isLoading) {
            return (<ActivityIndicatorComponent/>);
        }

        let {bandProfile} = this.state;

        if (
            (onlyAssociated
                ? bandProfile.musicians
                : bandProfile.createdMusicians).length === 0
        ) {
            let emptyMessage = onlyAssociated
                ? 'Nenhum músico vinculado à essa banda!'
                : 'Nenhum músico criado por essa banda!'
            return (
                <Col>
                    <h5 align="center">{emptyMessage} 😢</h5>
                </Col>
            );
        }

        let {navigateTo} = this.state

        let cols = (
            onlyAssociated
                ? bandProfile.musicians
                : bandProfile.createdMusicians
        ).map(
            musician => (
                <Col
                    key={musician.uuid}
                    xl={2} lg={3} md={4} sm={12}
                    className={musician.active ? 'musician-musician-card-active' : 'musician-card-non-active'}
                >
                    <div
                        className='musician-img-container'
                    >
                        <img
                            className='musician-img'
                            src={
                                !!musician.avatarUuid
                                    ? FileService.GET_IMAGE_URL(musician.avatarUuid)
                                    : '/images/musician_default_icon.png'
                            }
                            alt={`Imagem do integrante ${musician.name}`}
                        />
                    </div>
                    <p className='musician-name'>{musician.firstName}</p>
                    <p className='musician-age'>{`${musician.age} anos`}</p>
                    <div className='musician-type-container'>
                        {
                            musician.types
                                ? musician.types.map(
                                    type => (
                                        <Tag
                                            key={`${musician.uuid}-${type.name}`}
                                            value={type.name}
                                            rounded
                                        />
                                    )
                                ) : []
                        }
                    </div>
                    <div className='btn-container'>
                        <Button
                            disabled={!onlyAssociated && musician.hasAccount}
                            tooltip={
                                onlyAssociated
                                    ? 'Desvincular'
                                    : (
                                        musician.active
                                            ? 'Desativar' : 'Ativar'
                                    )
                            }
                            tooltipOptions={{position: "top"}}
                            className={
                                `opt-button ${onlyAssociated || musician.active ? 'p-button-danger' : 'p-button-success'}`
                            }
                            icon={onlyAssociated ? 'pi pi-trash' : 'pi pi-power-off'}
                            onClick={() => this.showDialogRemoveMusician(musician, onlyAssociated)}
                        />
                        {
                            onlyAssociated
                                ? (<></>)
                                : (
                                    <Col md={6} sm={12} style={{marginBottom: 5}}>
                                        <Button
                                            disabled={musician.hasAccount}
                                            tooltip={
                                                !musician.hasAccount
                                                    ? 'Editar'
                                                    : 'Impossível editar, músico vinculado'
                                            }
                                            tooltipOptions={{position: "top"}}
                                            className="opt-button p-button-warning"
                                            icon="pi pi-pencil"
                                            onClick={() => navigateTo(`${musician.uuid}/editar`)}
                                        />
                                    </Col>
                                )
                        }
                    </div>
                </Col>
            )
        )

        return (
            <Col>
                <Container>
                    <Row>
                        {cols}
                    </Row>
                </Container>
            </Col>
        );
    }

    showDialogRemoveMusician(musician, disassociate) {
        this.setState({selectedMusician: musician, showDeleteDialog: true, disassociate: disassociate});
    }

    disassociateMusician() {
        this.setState({isLoading: true});

        let {bandUuid, selectedMusician, token} = this.state;
        MusicianService.DISASSOCIATE(bandUuid, selectedMusician.uuid, token)
            .then(
                () => this.componentDidMount()
            ).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(
                () => this.setState({isLoading: false, selectedMusician: null, showDeleteDialog: false})
            )
    }

    deleteMusician() {
        let {selectedMusician, token, showToast} = this.state;

        this.setState({isMasterLoading: true})
        if (!!selectedMusician) {
            (
                selectedMusician.active
                    ? MusicianService.DEACTIVATE(selectedMusician.uuid, token)
                    : MusicianService.ACTIVATE(selectedMusician.uuid, token)
            ).then(
                () => {
                    showToast(
                        ToastUtils.BUILD_TOAST_SUCCESS_BODY(
                            `Músico ${selectedMusician.active ? 'desativado' : 'ativado'} com sucesso!`
                        )
                    );

                    setTimeout(() => this.componentDidMount(), 2500);
                }
            ).catch(
                error => {
                    this.setState({isMasterLoading: false})
                    this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                }
            )
        }
        this.setState({isLoading: false, selectedMusician: null, showDeleteDialog: false})
    }
}

const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(AdministrateBandMusicians);
