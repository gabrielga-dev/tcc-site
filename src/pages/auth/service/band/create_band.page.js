import React, {useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import HomeTemplate from "../../../template/home_template";
import {Col, Container, Row} from "react-bootstrap";
import {updateToken} from "../../../../service/redux/action/token.action";
import {updateUser} from "../../../../service/redux/action/user.action";
import {connect} from "react-redux";
import {Card} from "primereact/card";
import {BandForm} from "../../../../domain/new/form/band/band.form";
import {InputText} from "primereact/inputtext";
import {StyleConstants} from "../../../../service/style.constants";
import {InputTextarea} from "primereact/inputtextarea";
import {Divider} from "primereact/divider";
import {LocationService} from "../../../../service/new/location.service";
import {StateDto} from "../../../../domain/new/dto/state.dto";
import {ToastUtils} from "../../../../util/toast.utils";
import {ActivityIndicatorComponent} from "../../../../components/activity_indicator.component";
import {Dropdown} from "primereact/dropdown";
import {CityDto} from "../../../../domain/new/dto/city.dto";
import {InputMask} from "primereact/inputmask";
import {ContactForm} from "../../../../domain/new/form/band/contact.form";
import {ContactType} from "../../../../domain/new/enum/contact_type.enum";
import {Button} from "primereact/button";
import ValidationUtil from "../../../../util/validation/validation.util";
import {Toast} from "primereact/toast";
import {BandService} from "../../../../service/new/band.service";

const CreateBandPage = ({token, user}) => {
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
            <_CreateBandPage
                token={token}
                navigateTo={redirectTo}
                authenticatedUser={user}
                bandUuid={uuid}
                showToast={showToast}
            />
        </>
    );
}

class _CreateBandPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,

            band: new BandForm(),

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            states: [],
            selectedState: null,
            cities: [],
            selectedCity: null,

            contact: new ContactForm(),
            contactTypes: Object.keys(ContactType).map(type => ({code: type, name: ContactType[type].NAME})),

            formValidator: new ValidationUtil(),
        }
    }

    componentDidMount() {
        this.setState({isLoading: true})
        LocationService.GET_BRAZIL_STATES()
            .then(response => {
                let newStates = response.data.map(s => (new StateDto(s)))
                this.setState({states: newStates})
            })
            .catch(error =>
                this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
            ).finally(() => this.setState({isLoading: false}))
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

    render() {
        if (this.state.isLoading) {
            return (<ActivityIndicatorComponent/>);
        }
        let {contact, contactTypes} = this.state
        let {name, description, contacts} = this.state.band
        let {street, neighbour, complement, zipCode} = this.state.band.address
        let {states, selectedState, cities, selectedCity} = this.state
        return (
            <HomeTemplate steps={['Serviços', 'Cadastrar', 'Banda']}>
                <Card>
                    <Container>
                        <Row>
                            <Col>
                                <h3 align="center">Cadastrar Banda</h3>
                            </Col>
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
                                    value={name}
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
                                    value={description}
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
                                    value={street}
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
                                    value={complement}
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
                                    value={neighbour}
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
                                    value={zipCode}
                                    placeholder="xx.xxx-xxx"
                                    mask="99.999-999"
                                    maxLength={5}
                                    minLength={25}
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    onChange={
                                        (e) => {
                                            let {band} = this.state
                                            band.address.zipCode = e.target.value
                                            this.setState({band})
                                        }
                                    }
                                />
                            </Col>
                            <Col md={4} sm={12}>
                                <h6>Estado</h6>
                                <Dropdown
                                    value={selectedState}
                                    onChange={
                                        (e) => {
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
                                    disabled={!!!selectedState}
                                    value={selectedCity}
                                    onChange={
                                        (e) => {
                                            let {band} = this.state
                                            band.address.cityId = e.value.code
                                            this.setState({band, selectedCity: e.value})
                                            this.setState({selectedCity: e.value});
                                        }
                                    }
                                    options={cities}
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    optionLabel="name"
                                    placeholder={selectedState ? "Selecione uma cidade" : "Selecione um estado primeiro"}
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
                                    value={contact.type}
                                    onChange={
                                        (e) => {
                                            contact.type = e.value
                                            this.setState({contact})
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
                                    onClick={() => {
                                        let errors = this.validContact();
                                        if (errors.length > 0) {
                                            this.state.showToast(ToastUtils.BUILD_TOAST_FORM_ERROR(errors[0]))
                                        } else {
                                            let newContact = new ContactForm();
                                            newContact.type = contact.type.code;
                                            newContact.content = contact.content;

                                            contacts.push(newContact)
                                            this.setState({contact: new ContactForm()})
                                        }
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {
                                    (contacts.length > 0)
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

    submitBand() {
        let {formValidator, band, token, navigateTo} = this.state;
        let errors = formValidator.validate(band);
        errors = errors.concat(formValidator.validate(band.address))
        if (errors.length > 0) {
            this.state.showToast(ToastUtils.BUILD_TOAST_FORM_ERROR(errors[0]))
        } else {
            BandService.CREATE(band, token)
                .then(
                    () => {
                        this.setState({band: new BandForm(), isLoading: true});
                        this.state.showToast(ToastUtils.BUILD_TOAST_SUCCESS_BODY('Operação efetuada com sucesso!'))
                        setTimeout(
                            () => {
                                navigateTo('/servico/criar')
                            },
                            2000)
                    }
                ).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
                .finally(() => this.setState({isLoading: false})
            )
        }
    }

    validContact() {
        let {formValidator, contact} = this.state;
        return formValidator.validate(contact);
    }

    renderContactRows() {
        let {contacts} = this.state.band;
        let rows = contacts.map(
            contact => (
                <Row id={`contact_row_${new Date().valueOf()}`}>
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
                            onClick={() => {
                                let newContacts = contacts.filter(
                                    c => (contact.type !== c.type) && (contact.content !== c.content)
                                );
                                let {band} = this.state
                                band.contacts = newContacts
                                this.setState({band})
                            }}
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

    actionBodyTemplate(rowData) {
        return (
            <div>
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning"
                    onClick={() => {
                        let {contacts} = this.state.band;
                        let newContacts = contacts.filter(
                            con => (rowData.type !== con.type) && (rowData.content !== con.content)
                        );
                        this.setState({contacts: newContacts})
                    }}/>
            </div>
        );
    }

    contactTypeTemplate(option) {
        return (
            <div>
                <div style={{float: "left", marginRight: 8}}>
                    <i className={ContactType[option.code].ICON}/>
                </div>
                <div style={{float: "left"}}>
                    <div>{option.name}</div>
                </div>
            </div>
        );
    }
}

const myMapDispatchToProps = {
    updateToken: updateToken,
    updateUser: updateUser,
};
const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps, myMapDispatchToProps)(CreateBandPage);
