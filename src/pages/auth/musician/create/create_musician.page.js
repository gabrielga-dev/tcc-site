import React, {useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import {connect} from "react-redux";
import {MusicianRequest} from "../../../../domain/new/musician/request/musician.request";
import {ActivityIndicatorComponent} from "../../../../components/activity_indicator.component";
import HomeTemplate from "../../../template/home_template";
import {Card} from "primereact/card";
import {Col, Container, Row} from "react-bootstrap";
import {UpdateImageComponent} from "../../../../components/form/input/update_image.component";
import {FormAreaComponent} from "../../../../components/form/form_area.component";
import {TextFieldComponent} from "../../../../components/form/input/text_field.component";
import {CalendarFieldComponent} from "../../../../components/form/input/calendar_field.component";
import {TextMaskFieldComponent} from "../../../../components/form/input/text_mask_field.component";
import {Divider} from "primereact/divider";
import {AddressFormComponent} from "../../../../components/form/address_form.component";
import {BandRequest} from "../../../../domain/new/band/request/band.request";
import {BandService} from "../../../../service/new/band.service";
import {BandProfileDto} from "../../../../domain/new/dto/band/band_profile.dto";
import {ToastUtils} from "../../../../util/toast.utils";

const CreateMusicianPage = ({token, user}) => {
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
            <_CreateMusicianPage
                id="page"
                token={token}
                authenticatedUser={user}
                navigateTo={redirectTo}
                showToast={showToast}
                bandUuid={band_uuid}
            />
        </>
    );
}


class _CreateMusicianPage extends React.Component {

    constructor(props) {
        super(props)

        this.addressComponentRef = React.createRef();
        this.contactComponentRef = React.createRef();
        this.state = {
            bandUuid: props.bandUuid,

            isLoading: false,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            picture: null,
            pictureUrl: null,

            request: new MusicianRequest(),
        }
    }

    render() {
        if (this.state.isLoading) {
            return (<ActivityIndicatorComponent/>);
        }
        return (
            <HomeTemplate steps={['Home', 'Bandas', this.state.bandProfile?.name, 'Musicos', 'Cadastrar']}>
                <Card>
                    <Container>
                        <FormAreaComponent>
                            <Row style={{marginBottom: 10}}>
                                {this.renderPictureSection()}
                            </Row>
                            <Row style={{marginBottom: 10}}>
                                {this.renderBaseMusicianInformationForm()}
                            </Row>
                            <Row style={{marginBottom: 10}}>
                                {this.renderMusicianAddressForm()}
                            </Row>
                        </FormAreaComponent>
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    componentDidMount() {
        this.setState({isLoading: true});
        BandService.FIND_PROFILE(this.state.bandUuid, this.state.token)
            .then(response => {
                const profile = new BandProfileDto(response.data);

                this.setState({bandProfile: profile});
            }).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isLoading: false}))
    }

    renderPictureSection() {
        let {pictureUrl, isEditing} = this.state;
        return (
            <>
                <Col sm={0} md={3}/>
                <Col sm={12} md={6} style={{textAlign: 'center'}}>
                    <UpdateImageComponent
                        customDefaultImage="/images/musician_default_icon.png"
                        src={pictureUrl}
                        alt={pictureUrl ? 'Imagem selecionada' : 'Imagem padrão'}
                        onRemovePicture={
                            () => {
                                this.setState({picture: null, pictureUrl: null})
                                if (isEditing) {
                                    let {request} = this.state;
                                    request.clearProfilePicture = true;
                                    this.state({request: request})
                                }
                            }
                        }
                        onUploadPicture={(newPicture) => {
                            const newPictureUrl = URL.createObjectURL(newPicture);
                            this.setState({picture: newPicture, pictureUrl: newPictureUrl})
                            if (isEditing) {
                                let {request} = this.state;
                                request.clearProfilePicture = false;
                                this.state({request: request})
                            }
                        }}
                    />
                </Col>
                <Col sm={0} md={3}/>
            </>
        );
    }

    renderBaseMusicianInformationForm() {
        let {request} = this.state;
        return (
            <>
                <Row style={{marginBottom: 10}}>
                    <Col md={6} sm={12}>
                        <TextFieldComponent
                            label="Nome"
                            placeHolder="Insira aqui o nome do músico"
                            value={request.firstName}
                            minLength={1}
                            maxLength={100}
                            onChange={(firstName) => this.setMusicianValue('firstName', firstName)}
                        />
                    </Col>
                    <Col md={6} sm={12}>
                        <TextFieldComponent
                            label="Sobrenome"
                            placeHolder="Insira aqui o sobrenome do músico"
                            value={request.lastName}
                            minLength={1}
                            maxLength={100}
                            onChange={(lastName) => this.setMusicianValue('lastName', lastName)}
                        />
                    </Col>
                </Row>
                <Row style={{marginBottom: 10}}>
                    <Col md={6} sm={12}>
                        <CalendarFieldComponent
                            label="Data de nascimento"
                            placeHolder="Insira aqui a data de aniversário do músico"
                            value={request.birthday}
                            minDate={null}
                            minLength={1}
                            maxLength={100}
                            onChange={(firstName) => this.setMusicianValue('firstName', firstName)}
                        />
                    </Col>
                    <Col md={6} sm={12}>
                        <TextMaskFieldComponent
                            label="CPF"
                            placeHolder="Insira aqui o CPF do músico"
                            value={request.cpf}
                            mask='999.999.999-99'
                            onChange={(cpf) => this.setMusicianValue('cpf', cpf)}
                        />
                    </Col>
                </Row>
                <Row style={{marginBottom: 10}}>
                    <Col md={6} sm={12}>
                        <TextFieldComponent
                            label="Email"
                            placeHolder="Insira aqui o email do músico"
                            value={request.email}
                            minLength={1}
                            maxLength={100}
                            onChange={(email) => this.setMusicianValue('email', email)}
                        />
                    </Col>
                </Row>
            </>
        );
    }

    renderMusicianAddressForm() {
        return (
            <>
                <Divider align="center">
                    <span>Endereço</span>
                </Divider>
                <AddressFormComponent
                    ref={this.addressComponentRef}
                    showToast={this.state.showToast}
                    updateRequest={(newAddress) => this.setAddress(newAddress)}
                    address={this.state.isEditing ? this.state.request.address : null}
                />
            </>
        );
    }

    setMusicianValue(field, newValue) {
        let {request} = this.state;
        let auxRequest = new MusicianRequest(request);
        auxRequest[field] = newValue;
        this.setState({request: auxRequest});
    }

    setAddress(newAddress) {
        let {request} = this.state;
        let auxRequest = new BandRequest(request);
        auxRequest.address = newAddress
        this.setState({request: auxRequest});
    }
}

const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(CreateMusicianPage);
