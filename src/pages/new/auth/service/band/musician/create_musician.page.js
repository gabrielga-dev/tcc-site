import {useNavigate, useParams} from "react-router-dom";
import React, {useRef} from "react";
import {Toast} from "primereact/toast";
import {MusicianForm} from "../../../../../../domain/new/form/musician/musician.form";
import HomeTemplate from "../../../../template/home_template";
import {Divider} from "primereact/divider";
import {Col, Container, Row} from "react-bootstrap";
import {InputText} from "primereact/inputtext";
import {StyleConstants} from "../../../../../../service/style.constants";
import {InputMask} from "primereact/inputmask";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown";
import {ActivityIndicatorComponent} from "../../../../../../components/activity_indicator.component";
import {Button} from "primereact/button";
import {LocationService} from "../../../../../../service/new/location.service";
import {CityDto} from "../../../../../../domain/new/dto/city.dto";
import {ToastUtils} from "../../../../../../util/toast.utils";
import {BandService} from "../../../../../../service/new/band.service";
import {StateDto} from "../../../../../../domain/new/dto/state.dto";
import {Avatar} from "primereact/avatar";
import {Image} from "primereact/image";
import {FileService} from "../../../../../../service/new/file.service";
import {updateToken} from "../../../../../../service/redux/action/token.action";
import {updateUser} from "../../../../../../service/redux/action/user.action";
import {connect} from "react-redux";
import axios from "axios";
import {BandProfileDto} from "../../../../../../domain/new/dto/band/band_profile.dto";
import {MusicianService} from "../../../../../../service/new/musician.service";
import ValidationUtil from "../../../../../../util/validation/validation.util";

const CreateMusicianPage = ({token, user}) => {
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
            <_CreateMusicianPage
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

class _CreateMusicianPage extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
            isProfilePictureLoading: false,

            navigateTo: this.props.navigateTo,
            showToast: this.props.showToast,

            token: props.token,

            //band
            bandUuid: props.bandUuid,
            band: new BandProfileDto(),
            bandName: '',

            //create musician
            musician: new MusicianForm(),
            musicianBirthday: null,

            states: [],
            selectedState: null,
            cities: [],
            selectedCity: null,

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
        ).then(
            responses => {
                //band
                let band = new BandProfileDto(responses[0].data)

                //states
                let newStates = responses[1].data.map(s => (new StateDto(s)))
                this.setState({band, bandName: band.name, states: newStates})
            }
        ).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
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
        let {isLoading, navigateTo, bandUuid} = this.state;
        let {musician, musicianBirthday} = this.state;
        let {band} = this.state;
        let {states, selectedState, cities, selectedCity} = this.state;

        if (isLoading) {
            return (<ActivityIndicatorComponent/>)
        }
        return (
            <HomeTemplate steps={['Serviços', 'Bandas', band.name, 'Músicos', 'Adicionar Músico']}>
                <Container>
                    <Row>
                        <Col style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            {
                                !!!band?.profilePictureUuid
                                    ? (<Avatar label={band.name ? band.name[0] : ''} size="xlarge"/>)
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
                    <Divider align="center" type="dashed">
                        <b>Dados do músico</b>
                    </Divider>
                    <Row>
                        <Col md={4} sm={12}>
                            <h6>Nome</h6>
                            <InputText
                                placeholder="Seu primeiro nome aqui"
                                value={musician.firstName}
                                maxLength={75}
                                minLength={3}
                                style={StyleConstants.WIDTH_100_PERCENT}
                                onChange={
                                    (e) => {
                                        musician.firstName = e.target.value
                                        this.setState({musician})
                                    }
                                }
                            />
                        </Col>
                        <Col md={4} sm={12}>
                            <h6>Sobrenome</h6>
                            <InputText
                                placeholder="Seu sobrenome aqui"
                                value={musician.lastName}
                                maxLength={150}
                                minLength={1}
                                style={StyleConstants.WIDTH_100_PERCENT}
                                onChange={
                                    (e) => {
                                        musician.lastName = e.target.value
                                        this.setState({musician})
                                    }
                                }
                            />
                        </Col>
                        <Col md={4} sm={12}>
                            <h6>Data de nascimento</h6>
                            <Calendar
                                value={musicianBirthday}
                                placeholder="Sua data de nascimento"
                                style={StyleConstants.WIDTH_100_PERCENT}
                                onChange={(e) => {
                                    this.setState({musicianBirthday: e.value})
                                }}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} sm={12}>
                            <h6>CPF</h6>
                            <InputMask
                                mask="999.999.999-99"
                                placeholder="xxx.xxx.xxx-xx"
                                value={musician.cpf}
                                style={StyleConstants.WIDTH_100_PERCENT}
                                onChange={
                                    (e) => {
                                        musician.cpf = e.value
                                        this.setState({musician})
                                    }
                                }
                            />
                        </Col>
                        <Col md={6} sm={12}>
                            <h6>Email</h6>
                            <InputText
                                placeholder="exemplo@email.com"
                                value={musician.email}
                                maxLength={100}
                                minLength={5}
                                style={StyleConstants.WIDTH_100_PERCENT}
                                onChange={
                                    (e) => {
                                        musician.email = e.target.value
                                        this.setState({musician})
                                    }
                                }
                            />
                        </Col>
                    </Row>
                    <Divider align="center" type="dashed">
                        <b>Endereço</b>
                    </Divider>
                    <Row>
                        <Col md={4} sm={12}>
                            <h6>Rua e número</h6>
                            <InputText
                                placeholder="Ex.: Rua exemplo, 238"
                                value={musician.address.street}
                                maxLength={100}
                                minLength={5}
                                style={StyleConstants.WIDTH_100_PERCENT}
                                onChange={
                                    (e) => {
                                        musician.address.street = e.target.value
                                        this.setState({musician})
                                    }
                                }
                            />
                        </Col>
                        <Col md={4} sm={12}>
                            <h6>Complemento</h6>
                            <InputText
                                placeholder="Ex.: Apto. 3/ Compl. A"
                                value={musician.address.complement}
                                maxLength={10}
                                minLength={3}
                                style={StyleConstants.WIDTH_100_PERCENT}
                                onChange={
                                    (e) => {
                                        musician.address.complement = e.target.value
                                        this.setState({musician})
                                    }
                                }
                            />
                        </Col>
                        <Col md={4} sm={12}>
                            <h6>Bairro</h6>
                            <InputText
                                placeholder="Ex.: Centro"
                                value={musician.address.neighbour}
                                maxLength={10}
                                minLength={3}
                                style={StyleConstants.WIDTH_100_PERCENT}
                                onChange={
                                    (e) => {
                                        musician.address.neighbour = e.target.value
                                        this.setState({musician})
                                    }
                                }
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4} sm={12}>
                            <h6>Estado</h6>
                            <Dropdown
                                value={selectedState}
                                onChange={
                                    (e) => {
                                        this.setState({selectedCity: null, selectedState: e.value});
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
                                        this.setState({selectedCity: e.value});
                                    }
                                }
                                options={cities}
                                style={StyleConstants.WIDTH_100_PERCENT}
                                optionLabel="name"
                                placeholder={selectedState ? "Selecione uma cidade" : "Selecione um estado primeiro"}
                            />
                        </Col>
                        <Col md={4} sm={12}>
                            <h6>CEP</h6>
                            <InputMask
                                mask="99.999-999"
                                placeholder="xx.xxx-xxx"
                                value={musician.address.zipCode}
                                style={StyleConstants.WIDTH_100_PERCENT}
                                onChange={
                                    (e) => {
                                        musician.address.zipCode = e.value
                                        this.setState({musician})
                                    }
                                }
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button
                                label="Cancelar"
                                className="p-button-danger"
                                style={StyleConstants.WIDTH_100_PERCENT}
                                icon="pi pi-times"
                                onClick={
                                    () => navigateTo(`/servicos/bandas/${bandUuid}`)
                                }
                            />
                        </Col>
                        <Col>
                            <Button
                                label="Adicionar"
                                className="p-button-success"
                                style={StyleConstants.WIDTH_100_PERCENT}
                                icon="pi pi-check"
                                onClick={() => this.submitMusician()}
                            />
                        </Col>
                    </Row>
                </Container>
            </HomeTemplate>
        );
    }

    submitMusician() {
        let {formValidator, bandUuid, token, navigateTo, showToast} = this.state;
        let {musician, musicianBirthday} = this.state;

        let {selectedState, selectedCity} = this.state;
        musician.address.stateIso = selectedState?.code;
        musician.address.cityId = selectedCity?.code;

        musician.birthday = musicianBirthday ? musicianBirthday.getTime() / 1000: null;

        let errors = formValidator.validate(musician);
        errors = errors.concat(formValidator.validate(musician.address))

        if (errors.length > 0) {
            showToast(ToastUtils.BUILD_TOAST_FORM_ERROR(errors[0]))
        } else {
            this.setState({isLoading: true});
            MusicianService.CREATE(bandUuid, musician, token)
                .then(
                    response => {
                        navigateTo(`/servicos/bandas/${bandUuid}/musico/${response.data.uuid}/imagem`)
                    }
                ).catch(error => showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
                .finally(() => this.setState({isLoading: false}));
        }
    }
}

const myMapDispatchToProps = {
    updateToken: updateToken,
    updateUser: updateUser,
};
const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps, myMapDispatchToProps)(CreateMusicianPage);
