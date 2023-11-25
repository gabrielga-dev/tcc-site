import {useNavigate, useParams} from "react-router-dom";
import React, {useRef} from "react";
import {Toast} from "primereact/toast";
import {updateToken} from "../../../../../../service/redux/action/token.action";
import {updateUser} from "../../../../../../service/redux/action/user.action";
import {connect} from "react-redux";
import {BandProfileDto} from "../../../../../../domain/new/dto/band/band_profile.dto";
import {MusicianDto} from "../../../../../../domain/new/dto/musician/musician.dto";
import {ActivityIndicatorComponent} from "../../../../../../components/activity_indicator.component";
import HomeTemplate from "../../../../template/home_template";
import {Col, Container, Row} from "react-bootstrap";
import {BandService} from "../../../../../../service/new/band.service";
import axios from "axios";
import {BandDto} from "../../../../../../domain/new/dto/band/band.dto";
import {MusicianService} from "../../../../../../service/new/musician.service";
import {ToastUtils} from "../../../../../../util/toast.utils";
import {Avatar} from "primereact/avatar";
import {Image} from "primereact/image";
import {FileService} from "../../../../../../service/new/file.service";
import {FileUpload} from "primereact/fileupload";
import {Button} from "primereact/button";
import {StyleConstants} from "../../../../../../service/style.constants";

const UploadMusicianProfilePage = ({token, user}) => {
    let {bandUuid, musicianUuid} = useParams();

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
            <_UploadMusicianProfile
                token={token}
                user={user}
                navigateTo={redirectTo}
                bandUuid={bandUuid}
                musicianUuid={musicianUuid}
                showToast={showToast}
            />
        </>
    );
}

class _UploadMusicianProfile extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
            token: props.token,

            navigateTo: props.navigateTo,

            //band
            bandUuid: props.bandUuid,
            band: new BandProfileDto(),

            //create musician
            musicianUuid: props.musicianUuid,
            musician: new MusicianDto(),
            avatarUuid: null
        }
    }

    componentDidMount() {
        let {bandUuid, musicianUuid, token} = this.state;
        this.setState({isLoading: true});
        axios.all(
            [
                BandService.FIND_BAND_BY_UUID(bandUuid),
                MusicianService.FIND_BY_UUID(bandUuid, musicianUuid, token)
            ]
        ).then(
            responses => {
                //band
                let band = new BandDto(responses[0].data);

                //musician
                let musician = new MusicianDto(responses[1].data);

                this.setState({band, musician, avatarUuid: musician.avatarUuid});
            }
        ).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isLoading: false}))
    }

    render() {
        let {isLoading, navigateTo} = this.state;
        let {band, musician, avatarUuid, bandUuid} = this.state;

        if (isLoading) {
            return (<ActivityIndicatorComponent/>)
        }
        return (
            <HomeTemplate steps={['Serviços', 'Bandas', band.name, 'Músicos', musician.firstName, 'Imagem']}>
                <Container>
                    <Row>
                        <Col style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            {
                                !!!avatarUuid
                                    ? (<Avatar label={musician.firstName ? musician.firstName[0] : ''} size="xlarge"/>)
                                    : (
                                        <Image
                                            src={FileService.GET_IMAGE_URL(avatarUuid)}
                                            alt={`Imagem do músico(a) ${musician.firstName}`}
                                            width="250"
                                            height="250"
                                        />
                                    )
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FileUpload
                                name="profilePicture"
                                accept="image/*"
                                customUpload={true}
                                uploadHandler={(x) => this.uploadProfilePicture(x)}
                                mode="basic"
                                auto={false}
                                chooseLabel="Upload Imagem"
                            />
                        </Col>
                        <Col style={{display: avatarUuid ? '' : 'none'}}>
                            <Button
                                icon="pi pi-trash"
                                label="Remover Foto"
                                className="p-button-danger"
                                style={StyleConstants.WIDTH_100_PERCENT}
                                onClick={() => this.removeProfilePicture()}
                            />
                        </Col>
                        <Col style={{display: avatarUuid ? '' : 'none'}}>
                            <Button
                                icon="pi pi-check"
                                label="Voltar"
                                className="p-button-success"
                                style={StyleConstants.WIDTH_100_PERCENT}
                                onClick={() => navigateTo(`/servicos/bandas/${bandUuid}`)}
                            />
                        </Col>
                    </Row>
                </Container>
            </HomeTemplate>
        );
    }

    uploadProfilePicture(picture) {
        let {musicianUuid, token, showToast} = this.state;
        this.setState({isLoading: true})
        MusicianService.UPLOAD_PROFILE_PICTURE(musicianUuid, picture.files[0], token)
            .then(
                response => {
                    this.setState({avatarUuid: response.data.uuid});
                    showToast(ToastUtils.BUILD_TOAST_SUCCESS_BODY('Imagem adicionada com sucesso!'))
                }
            ).catch(error => showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isLoading: false}))
    }

    removeProfilePicture() {
        let {musicianUuid, token, showToast} = this.state;
        this.setState({isLoading: true})
        MusicianService.REMOVE_PROFILE_PICTURE(musicianUuid, token)
            .then(
                response => {
                    this.setState({avatarUuid: null});
                    showToast(ToastUtils.BUILD_TOAST_SUCCESS_BODY('Imagem Removida com sucesso!'))
                }
            ).catch(error => showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isLoading: false}))
    }
}

const myMapDispatchToProps = {
    updateToken: updateToken,
    updateUser: updateUser,
};
const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps, myMapDispatchToProps)(UploadMusicianProfilePage);
