import React, {useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import {BandService} from "../../../../service/new/band.service";
import {BandProfileDto} from "../../../../domain/new/dto/band/band_profile.dto";
import {ToastUtils} from "../../../../util/toast.utils";
import {connect} from "react-redux";
import HomeTemplate from "../../../template/home_template";
import {Card} from "primereact/card";
import {Col, Container, Row} from "react-bootstrap";
import {ActivityIndicatorComponent} from "../../../../components/activity_indicator.component";
import {FormAreaComponent} from "../../../../components/form/form_area.component";
import {TextFieldComponent} from "../../../../components/form/input/text_field.component";
import {MusicRequest} from "../../../../domain/new/music/request/music.request";
import {TextAreaComponent} from "../../../../components/form/input/text_area.component";
import {FormEndingComponent} from "../../../../components/form_ending.component";
import ValidationUtil from "../../../../util/validation/validation.util";
import {MusicService} from "../../../../service/new/music.service";

const CreateMusicPage = ({token, user}) => {
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
            <_CreateMusicPage
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

class _CreateMusicPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isEditing: !!props.musicUuid,

            bandUuid: props.bandUuid,
            isMasterLoading: true,
            isLoading: false,
            token: props.token,
            authenticatedUser: props.authenticatedUser,
            navigateTo: props.navigateTo,
            showToast: props.showToast,

            bandName: '',
            request: new MusicRequest(),
        }
    }

    componentDidMount() {
        this.setState({isMasterLoading: true});

        let {bandUuid, token} = this.state;

        BandService.FIND_PROFILE(bandUuid, token)
            .then(response => {
                let profile = new BandProfileDto(response.data);
                this.setState({bandName: profile.name});
            }).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isMasterLoading: false}));
    }

    render() {
        if (this.state.isMasterLoading) {
            return (<ActivityIndicatorComponent/>);
        }

        let {request, isLoading} = this.state;

        return (
            <HomeTemplate steps={['Home', 'Bandas', this.state.bandName, 'Gerenciar Músicas', 'Criar']}>
                <Card>
                    <Container>
                        <Row>
                            <Col>
                                <FormAreaComponent>
                                    <Container>
                                        <Row>
                                            <Col md={4} sm={12} style={FIELD_STYLE}>
                                                <TextFieldComponent
                                                    disabled={isLoading}
                                                    label='Nome'
                                                    value={request.name}
                                                    minLength={2}
                                                    maxLength={45}
                                                    placeHolder='Digite aqui o nome da nova música'
                                                    onChange={(value) => this.changeValue('name', value)}
                                                />
                                            </Col>
                                            <Col md={4} sm={12} style={FIELD_STYLE}>
                                                <TextFieldComponent
                                                    disabled={isLoading}
                                                    label='Autor'
                                                    value={request.author}
                                                    minLength={2}
                                                    maxLength={60}
                                                    placeHolder='Digite aqui qual é o autor da nova música'
                                                    onChange={(value) => this.changeValue('author', value)}
                                                />
                                            </Col>
                                            <Col md={4} sm={12} style={FIELD_STYLE}>
                                                <TextFieldComponent
                                                    disabled={isLoading}
                                                    label='Artist'
                                                    value={request.artist}
                                                    minLength={2}
                                                    maxLength={60}
                                                    placeHolder='Digite aqui qual é o artista da nova música'
                                                    onChange={(value) => this.changeValue('artist', value)}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <TextAreaComponent
                                                disabled={isLoading}
                                                optional={true}
                                                label='Observação'
                                                placeHolder='Informações soibre a música, estilo, etc.'
                                                value={request.observation}
                                                onChange={(value) => this.changeValue('observation', value)}
                                                maxLength={1000}
                                            />
                                        </Row>
                                    </Container>
                                </FormAreaComponent>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} sm={0}/>
                            <Col md={6} sm={12}>
                                <FormEndingComponent
                                    showFirst={false}
                                    showSecond={false}
                                    disableThird={isLoading}
                                    onClickThird={() => this.submitRequest()}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        )
    }

    changeValue(field, value) {
        let {request} = this.state;
        request[field] = value;
        this.setState({request: request});
    }

    submitRequest() {
        this.setState({isLoading: true});

        let {bandUuid, request, isEditing, token} = this.state;
        const validator = new ValidationUtil();
        let errors = validator.validate(request);
        if (errors.length > 0) {
            this.state.showToast(ToastUtils.BUILD_TOAST_FORM_ERROR(errors[0]))
            this.setState({isLoading: false});
            return;
        }
        if (!isEditing) {
            MusicService.CREATE(bandUuid, request, token)
                .then(
                    () => {
                        this.state.showToast(
                            ToastUtils.BUILD_TOAST_SUCCESS_BODY("Música adicionada com sucesso!")
                        )
                        this.setState({request: new MusicRequest()});
                        setTimeout(
                            () => {
                                this.state.navigateTo(`/bandas/${bandUuid}/gerenciar-musicas`)
                            },
                            1500
                        );
                    }
                ).catch(
                    error => {
                        this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                        this.setState({isLoading: false})
                    }
            );
        }
    }
}

const FIELD_STYLE = {marginBottom: 10};

const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(CreateMusicPage);
