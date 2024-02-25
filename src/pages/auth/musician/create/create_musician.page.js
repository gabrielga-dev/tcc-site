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
import {BandService} from "../../../../service/new/band.service";
import {BandProfileDto} from "../../../../domain/new/dto/band/band_profile.dto";
import {ToastUtils} from "../../../../util/toast.utils";
import {FormEndingComponent} from "../../../../components/form_ending.component";
import ValidationUtil from "../../../../util/validation/validation.util";
import {MusicianService} from "../../../../service/new/musician.service";
import {PickList} from "primereact/picklist";
import {Tag} from "primereact/tag";
import axios from "axios";
import {MusicianTypeService} from "../../../../service/new/musician_type.service";
import {MusicianTypeResponse} from "../../../../domain/new/musician/response/musician_type.response";
import {MusicianTypeRequest} from "../../../../domain/new/musician/request/musician_type.request";
import {DateUtil} from "../../../../util/date.util";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";

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
            selectedBirthDay: new Date(),

            availableMusicianTypes: [],
            selectedMusicianTypes: [],

            showAssociatePopUp: false,
            musicianCpfToAssociate: ''
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
                                {this.renderBaseMusicianTypes()}
                            </Row>
                            <Row style={{marginBottom: 10}}>
                                {this.renderMusicianAddressForm()}
                            </Row>
                        </FormAreaComponent>
                        <Row>
                            <Col md={6} sm={0}/>
                            <Col md={6} sm={12}>
                                <FormEndingComponent
                                    showFirst={false}
                                    showSecond={false}
                                    onClickThird={() => this.submitRequest()}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    componentDidMount() {
        this.setState({isLoading: true});
        axios.all(
            [
                BandService.FIND_PROFILE(this.state.bandUuid, this.state.token),
                MusicianTypeService.FIND_ALL(this.state.token)
            ]
        )
            .then(responses => {
                //band profile
                const profile = new BandProfileDto(responses[0].data);

                //musician types
                const musicianTypes = responses[1].data.map(musicianType => (new MusicianTypeResponse(musicianType)));

                this.setState({bandProfile: profile, availableMusicianTypes: musicianTypes});
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
        let {request, selectedBirthday} = this.state;
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
                            value={selectedBirthday}
                            minDate={null}
                            onChange={(birthday) => {
                                if (birthday) {
                                    this.setState({selectedBirthday: new Date(birthday)})
                                    this.setMusicianValue('birthday', DateUtil.DATE_TO_EPOCH(new Date(birthday)));
                                }
                            }}
                        />
                    </Col>
                    <Col md={6} sm={12}>
                        <TextMaskFieldComponent
                            label="CPF"
                            placeHolder="Insira aqui o CPF do músico"
                            value={request.cpf}
                            mask='999.999.999-99'
                            onChange={(cpf) => {
                                this.setMusicianValue('cpf', cpf)
                                if (cpf && !cpf.includes('_')) {
                                    this.checkIfMusicianExists(cpf);
                                }
                            }}
                        />
                        <Dialog
                            closable={false}
                            header="Cpf de músico já cadastrado na plataforma"
                            visible={this.state.showAssociatePopUp}
                            style={{width: '50vw'}}
                            draggable={false}
                            footer={() => (
                                <div>
                                    <Button
                                        label="Não"
                                        icon="pi pi-times"
                                        onClick={() => {
                                            let {request} = this.state;
                                            request.cpf = '';
                                            this.setState(
                                                {
                                                    request: request,
                                                    showAssociatePopUp: false,
                                                    musicianCpfToAssociate: ''
                                                }
                                            )
                                        }}
                                        className="p-button-text"
                                    />
                                    <Button
                                        label="Sim"
                                        icon="pi pi-check"
                                        onClick={() => this.assocMusician()}
                                        autoFocus
                                    />
                                </div>
                            )}
                            onHide={() => {
                            }}
                        >
                            <p>
                                O CPF digitado já se encontra cadastrado
                                na plataforma, portanto não é possível cadastrar um novo músico com ele! Mas você
                                pode vincular tal músico à sua banda! Gostaria de fazer isso?
                            </p>
                        </Dialog>
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

    checkIfMusicianExists(cpf) {
        let {token} = this.state;
        MusicianService.FIND_BY_CPF(cpf, token)
            .then(
                () => this.setState({showAssociatePopUp: true, musicianCpfToAssociate: cpf})
            )
            .catch(
                error => {
                    let errorData = error.response.data;
                    if ((errorData.code !== 404) || (!errorData.message.includes('Músico não encontrado'))) {
                        this.state.showToast(ToastUtils.BUILD_TOAST_FORM_ERROR(error))
                    }
                }
            );
    }

    assocMusician() {
        let {bandUuid, request} = this.state;
        this.state.navigateTo(`/bandas/${bandUuid}/gerenciar-musicos/vincular/${request.cpf}`)
    }

    renderBaseMusicianTypes() {
        let {availableMusicianTypes, selectedMusicianTypes} = this.state;
        return (
            <>
                <Divider align="center"><span>Tipo de músico</span></Divider>
                <Row style={{marginBottom: 10}}>
                    <Col>
                        <PickList
                            source={availableMusicianTypes}
                            target={selectedMusicianTypes}
                            itemTemplate={
                                (item) => (<Tag>{item.name}</Tag>)
                            }
                            sourceHeader="Disponíveis"
                            targetHeader="Selecionados"
                            sourceStyle={{height: '342px'}}
                            targetStyle={{height: '342px'}}
                            onChange={
                                (event) => {
                                    let {request} = this.state;

                                    request.types = event.target
                                        .map(
                                            selectedType => (new MusicianTypeRequest(selectedType))
                                        );
                                    this.setState({
                                        availableMusicianTypes: event.source,
                                        selectedMusicianTypes: event.target
                                    });
                                }
                            }
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
        let auxRequest = new MusicianRequest(request);
        auxRequest.address = newAddress
        this.setState({request: auxRequest});
    }

    submitRequest() {
        let {request} = this.state;

        this.setState({isLoading: true});
        const validator = new ValidationUtil();

        let errors = validator.validate(request)
            .concat(validator.validate(request.address));
        if (errors.length > 0) {
            this.state.showToast(ToastUtils.BUILD_TOAST_FORM_ERROR(errors[0]))
            this.setState({isLoading: false});
            return;
        }
        let {bandUuid, picture, token} = this.state;
        MusicianService.CREATE(bandUuid, picture, request, token)
            .then(
                () => {
                    this.state.showToast(
                        ToastUtils.BUILD_TOAST_SUCCESS_BODY("Músico criado com sucesso!")
                    )
                    this.setState({request: new MusicianRequest()});
                    setTimeout(
                        () => {
                            this.state.navigateTo(`/bandas/${bandUuid}/gerenciar-musicos`)
                        },
                        1500
                    );
                }
            ).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isLoading: false}))
    }
}

const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(CreateMusicianPage);
