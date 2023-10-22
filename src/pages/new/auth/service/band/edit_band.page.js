import React, {useRef} from "react";
import {updateToken} from "../../../../../service/redux/action/token.action";
import {updateUser} from "../../../../../service/redux/action/user.action";
import {connect} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import HomeTemplate from "../../../template/home_template";
import {BandService} from "../../../../../service/new/band.service";
import {BandProfileDto} from "../../../../../domain/new/dto/band/band_profile.dto";
import {ToastUtils} from "../../../../../util/toast.utils";
import {Card} from "primereact/card";
import {Col, Container, Row} from "react-bootstrap";
import {Divider} from "primereact/divider";
import {InputText} from "primereact/inputtext";
import {StyleConstants} from "../../../../../service/style.constants";
import {InputTextarea} from "primereact/inputtextarea";
import {InputMask} from "primereact/inputmask";
import {Dropdown} from "primereact/dropdown";
import {ActivityIndicatorComponent} from "../../../../../components/activity_indicator.component";
import axios from "axios";
import {LocationService} from "../../../../../service/new/location.service";
import {StateDto} from "../../../../../domain/new/dto/state.dto";
import {CityDto} from "../../../../../domain/new/dto/city.dto";
import {ContactForm} from "../../../../../domain/new/form/band/contact.form";
import {ContactType} from "../../../../../domain/new/enum/contact_type.enum";
import {Button} from "primereact/button";
import {ContactService} from "../../../../../service/new/contact.service";
import {Toast} from "primereact/toast";
import ValidationUtil from "../../../../../util/validation/validation.util";
import {BandForm} from "../../../../../domain/new/form/band/band.form";
import {FileUpload} from "primereact/fileupload";
import {Avatar} from "primereact/avatar";
import {Image} from "primereact/image";
import {FileService} from "../../../../../service/new/file.service";

const EditBandPage = ({token, user}) => {
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
            <_EditBandPage
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

class _EditBandPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
            isContactsLoading: false,
            isProfilePictureLoading: false,

            band: new BandProfileDto(),

            profilePictureUuid: null,
            bandUuid: props.bandUuid,
            user: props.user,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            states: [],
            selectedState: null,
            cities: [],
            selectedCity: null,

            contact: new ContactForm(),
            selectedContactType: null,
            contactTypes: Object.keys(ContactType).map(type => ({code: type, name: ContactType[type].NAME})),

            formValidator: new ValidationUtil(),
        }
    }

    componentDidMount() {
        this.setState({isLoading: true})
        axios.all(
            [
                BandService.FIND_BAND_BY_UUID(this.state.bandUuid),
                LocationService.GET_BRAZIL_STATES()
            ]
        )
            .then(
                responses => {
                    //band
                    let band = new BandProfileDto(responses[0].data).toForm()
                    //states
                    let newStates = responses[1].data.map(s => (new StateDto(s)))
                    let selectedState = newStates.filter(state => band.address.stateIso === state.code)[0]

                    LocationService.GET_STATE_CITIES(selectedState.code)
                        .then(
                            citiesResponse => {
                                let newCities = citiesResponse.data.map(c => (new CityDto(c)))
                                let selectedCity = newCities.filter(c => band.address.cityId === c.name)[0]
                                band.address.cityId = selectedCity.code

                                this.setState(
                                    {
                                        cities: newCities,
                                        selectedCity,
                                    }
                                )
                            }
                        )
                    this.setState(
                        {
                            band,
                            profilePictureUuid: responses[0].data.profilePictureUuid,
                            states: newStates,
                            selectedState,
                        }
                    )
                }
            )
            .catch(
                errors => {
                    this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(errors[0]))
                    setTimeout(() => this.state.navigateTo('/'), 2000)
                }
            ).finally(() => this.setState({isLoading: false}))
    }

    render() {
        let {band, isLoading} = this.state
        let {states, cities} = this.state
        let {contact, selectedContactType, contactTypes} = this.state
        if (isLoading || !states || !cities) {
            return (<ActivityIndicatorComponent/>);
        }
        return (
            <HomeTemplate steps={['Serviços', 'Bandas', band.name, 'Editar']}>
                <Card>
                    <Container>
                        <Row>
                            <Col>
                                <h3 align="center">Editar Banda</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Divider type="dashed" align="center">
                                    <span>Ícone da Banda</span>
                                </Divider>
                            </Col>
                        </Row>
                        <Row>
                            {this.renderProfileSection()}
                        </Row>
                        <Row>
                            <Col>
                                <Divider type="dashed" align="center">
                                    <span>Dados da Banda</span>
                                </Divider>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h6>Nome</h6>
                                <InputText
                                    value={band.name}
                                    placeholder="Insira o nome de sua banda"
                                    maxLength={100}
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    onChange={
                                        (e) => {
                                            let {band} = this.state
                                            band.name = e.target.value
                                            this.setState({band})
                                        }
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h6>Descrição</h6>
                                <InputTextarea
                                    value={band.description}
                                    placeholder="Escreva um pouco sobre sua banda!"
                                    maxLength={500}
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    autoResize
                                    onChange={
                                        (e) => {
                                            let {band} = this.state
                                            band.description = e.target.value
                                            this.setState({band})
                                        }
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Divider type="dashed" align="center">
                                    <span>Endereço</span>
                                </Divider>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4} sm={12}>
                                <h6>Rua e Número</h6>
                                <InputText
                                    value={band.address?.street}
                                    placeholder="Ex.: Rua Mario Andrade, 590"
                                    maxLength={50}
                                    minLength={3}
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    onChange={
                                        (e) => {
                                            let {band} = this.state
                                            band.address.street = e.target.value
                                            this.setState({band})
                                        }
                                    }
                                />
                            </Col>
                            <Col md={4} sm={12}>
                                <h6>Complemento</h6>
                                <InputText
                                    value={band.address?.complement}
                                    placeholder="Ex.: Apto 5"
                                    maxLength={10}
                                    minLength={3}
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    onChange={
                                        (e) => {
                                            let {band} = this.state
                                            band.address.complement = e.target.value
                                            this.setState({band})
                                        }
                                    }
                                />
                            </Col>
                            <Col md={4} sm={12}>
                                <h6>Bairro</h6>
                                <InputText
                                    value={band.address?.neighbour}
                                    placeholder="Insira o nome do bairro"
                                    maxLength={50}
                                    minLength={3}
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    onChange={
                                        (e) => {
                                            let {band} = this.state
                                            band.address.neighbour = e.target.value
                                            this.setState({band})
                                        }
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4} sm={12}>
                                <h6>CEP</h6>
                                <InputMask
                                    value={band.address?.zipCode}
                                    placeholder="xx.xxx-xxx"
                                    mask="99.999-999"
                                    maxLength={5}
                                    minLength={25}
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    onChange={
                                        (e) => {
                                            let {band} = this.state
                                            if (!band.address)
                                                return
                                            band.address.zipCode = e.target.value
                                            this.setState({band})
                                        }
                                    }
                                />
                            </Col>
                            <Col md={4} sm={12}>
                                <h6>Estado</h6>
                                <Dropdown
                                    value={this.state.selectedState}
                                    onChange={
                                        (e) => {
                                            this.setState({selectedCity: null})
                                            let {band} = this.state
                                            band.address.stateIso = e.value.code
                                            this.setState({band, selectedState: e.value})
                                            this.getCities(e.value)
                                        }
                                    }
                                    options={states}
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    optionLabel="name"
                                    placeholder="Selecione um estado"
                                />
                            </Col>
                            <Col md={4} sm={12}>
                                <h6>Cidade</h6>
                                <Dropdown
                                    disabled={!this.state.selectedState}
                                    value={this.state.selectedCity}
                                    onChange={
                                        (e) => {
                                            let {band} = this.state
                                            band.address.cityId = e.value.code
                                            this.setState({band, selectedCity: e.value})
                                        }
                                    }
                                    options={this.state.cities}
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    optionLabel="name"
                                    placeholder={
                                        this.state.selectedState
                                            ? "Selecione uma cidade"
                                            : "Selecione um estado primeiro"
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Divider type="dashed" align="center">
                                    <span>Contatos</span>
                                </Divider>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} sm={12}>
                                <h6>Tipo</h6>
                                <Dropdown
                                    value={selectedContactType}
                                    onChange={
                                        (e) => {
                                            contact.type = e.value.code
                                            this.setState({contact, selectedContactType: e.value})
                                        }
                                    }
                                    options={contactTypes}
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    itemTemplate={this.contactTypeTemplate}
                                    optionLabel="name"
                                    placeholder="Selecione um tipo"
                                />
                            </Col>
                            <Col md={6} sm={12}>
                                <h6>Conteúdo</h6>
                                <InputText
                                    value={contact.content}
                                    placeholder="Link, URL, telefone, etc."
                                    maxLength={150}
                                    minLength={5}
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    onChange={
                                        (e) => {
                                            contact.content = e.target.value
                                            this.setState({contact})
                                        }
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    label="Adicionar contato"
                                    onClick={() => this.saveContact()}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {
                                    (!!band.contacts && band.contacts.length > 0)
                                        ? (this.renderContactRows())
                                        : (<h3 align="center">Nenhum contato adicionado :(</h3>)
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    label="Enviar" icon="pi pi-check" iconPos="right"
                                    onClick={() => this.submitBand()}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    renderProfileSection() {
        if (this.state.isProfilePictureLoading) {
            return (<ActivityIndicatorComponent/>)
        }
        let {band, profilePictureUuid} = this.state;
        return (
            <Row>
                <Row>
                    <Col style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        {
                            !!!profilePictureUuid
                                ? (<Avatar label={band.name ? band.name[0] : ''} size="xlarge"/>)
                                : (
                                    <Image
                                        src={FileService.GET_IMAGE_URL(profilePictureUuid)}
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
                    <Col style={{display: profilePictureUuid ? '': 'none'}}>
                        <Button
                            icon="pi pi-trash"
                            label="Remover Foto"
                            className="p-button-danger"
                            style={StyleConstants.WIDTH_100_PERCENT}
                            onClick={() => this.removeProfilePicture()}
                        />
                    </Col>
                    <Col/>
                </Row>
            </Row>
        );
    }

    submitBand() {
        let {formValidator, bandUuid, band, token, navigateTo} = this.state;
        let errors = formValidator.validate(band);
        errors = errors.concat(formValidator.validate(band.address))
        if (errors.length > 0) {
            this.state.showToast(ToastUtils.BUILD_TOAST_FORM_ERROR(errors[0]))
        } else {
            BandService.UPDATE(bandUuid, band, token)
                .then(
                    () => {
                        this.setState({band: new BandForm(), isLoading: true});
                        this.state.showToast(ToastUtils.BUILD_TOAST_SUCCESS_BODY('Operação efetuada com sucesso!'))
                        setTimeout(
                            () => {
                                navigateTo('/meus-servicos')
                            },
                            2000
                        )
                    }
                ).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
                .finally(() => this.setState({isLoading: false}))
        }
    }

    renderContactRows() {
        if (this.state.isContactsLoading) {
            return (
                <Container>
                    <ActivityIndicatorComponent/>
                </Container>
            )
        }
        let {contacts} = this.state.band;
        let rows = contacts.map(
            contact => (
                <Row id={contact.uuid}>
                    <Col>
                        {contact.type}
                    </Col>
                    <Col>
                        <a href={contact.content}>{contact.content}</a>
                    </Col>
                    <Col>
                        <Button
                            className="p-button-rounded p-button-danger"
                            icon="pi pi-trash"
                            onClick={() => this.deleteContact(contact.uuid)}
                        />
                    </Col>
                    <hr/>
                </Row>
            )
        );
        return (
            <Container>
                {rows}
            </Container>
        )
    }

    deleteContact(contactUuid) {
        let {band, bandUuid, token, showToast} = this.state;
        this.setState({isContactsLoading: true})
        ContactService.DELETE_CONTACT(bandUuid, contactUuid, token)
            .then(
                response => {
                    band.contacts = band.contacts.filter(c => (c.uuid !== contactUuid))
                    this.setState({band})
                    showToast(ToastUtils.BUILD_TOAST_SUCCESS_BODY('Contato removido!'))
                }
            ).catch(error => showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isContactsLoading: false}));
    }

    getCities(state) {
        LocationService.GET_STATE_CITIES(state.code)
            .then(response => {
                let newCities = response.data.map(c => (new CityDto(c)))
                this.setState({cities: newCities})
            })
            .catch(error =>
                this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
            )
    }

    saveContact() {
        let {band, contact, bandUuid, token, showToast} = this.state

        let errors = this.validContact();
        if (errors.length > 0) {
            showToast(ToastUtils.BUILD_TOAST_FORM_ERROR(errors[0]))
        } else {
            let newContact = new ContactForm();
            newContact.type = contact.type.code;
            newContact.content = contact.content;

            this.setState({isContactsLoading: true});
            ContactService.CREATE(contact, bandUuid, token)
                .then(
                    response => {
                        let savedContact = new ContactForm();
                        savedContact.uuid = response.data.uuid;
                        savedContact.type = response.data.type;
                        savedContact.content = response.data.content;

                        band.contacts.push(savedContact)
                        this.setState({band, contact: new ContactForm()})
                        showToast(ToastUtils.BUILD_TOAST_SUCCESS_BODY('Contato salvo com sucesso!'))
                    }
                ).catch(error => showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
                .finally(() => this.setState({isContactsLoading: false}))
        }
    }

    validContact() {
        let {formValidator, contact} = this.state;
        return formValidator.validate(contact);
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
export default connect(mapStateToProps, myMapDispatchToProps)(EditBandPage);
