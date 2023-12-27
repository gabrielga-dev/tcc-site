import {connect} from "react-redux";
import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {Toast} from "primereact/toast";
import HomeTemplate from "../../../template/home_template";
import {Col, Container, Row} from "react-bootstrap";
import {Card} from "primereact/card";
import {UpdateImageComponent} from "../../../../../components/form/input/update_image.component";
import {BandRequest} from "../../../../../domain/new/band/request/band.request";
import {TextFieldComponent} from "../../../../../components/form/input/text_field.component";
import {TextAreaComponent} from "../../../../../components/form/input/text_area.component";
import {Divider} from "primereact/divider";
import {AddressFormComponent} from "../../../../../components/form/address_form.component";
import {BandContactComponent} from "../band_contact.component";
import {FormEndingComponent} from "../../../../../components/form_ending.component";
import {ConfirmDialog} from "primereact/confirmdialog";
import {ActivityIndicatorComponent} from "../../../../../components/activity_indicator.component";
import ValidationUtil from "../../../../../util/validation/validation.util";
import {ToastUtils} from "../../../../../util/toast.utils";
import {BandService} from "../../../../../service/new/band.service";

const CreateBandPage = ({token, user}) => {
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
            <_CreateBandPage id="page"
                             token={token}
                             authenticatedUser={user}
                             navigateTo={redirectTo}
                             showToast={showToast}
            />
        </>
    );
}

class _CreateBandPage extends React.Component {
    constructor(props) {
        super(props)

        this.addressComponentRef = React.createRef();
        this.state = {
            isLoading: false,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            picture: null,
            pictureUrl: null,

            request: new BandRequest(),
        }
    }

    render() {
        if (this.state.isLoading) {
            return (<ActivityIndicatorComponent/>);
        }
        return (
            <HomeTemplate steps={['Home', 'Bandas', 'Cadastrar']}>
                <Card>
                    <Container>
                        <Row>
                            {this.renderPictureSection()}
                        </Row>
                        <Row>
                            {this.renderBandDataSection()}
                        </Row>
                        <Divider align="center"><span>Endereço</span></Divider>
                        <Row>
                            {this.renderBandAddressSection()}
                        </Row>
                        <Divider align="center"><span>Contatos</span></Divider>
                        <Row>
                            {this.renderBandContactSection()}
                        </Row>
                        <Divider align="center"><span>Submeter</span></Divider>
                        <Row>
                            {this.renderFormEnding()}
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    renderPictureSection() {
        let {pictureUrl} = this.state;
        return (
            <>
                <Col sm={0} md={3}/>
                <Col sm={12} md={6} style={{textAlign: 'center'}}>
                    <UpdateImageComponent
                        src={pictureUrl}
                        alt={pictureUrl ? 'Imagem selecionada' : 'Imagem padrão'}
                        onRemovePicture={() => this.setState({picture: null, pictureUrl: null})}
                        onUploadPicture={(newPicture) => {
                            const newPictureUrl = URL.createObjectURL(newPicture);
                            this.setState({picture: newPicture, pictureUrl: newPictureUrl})
                        }}
                    />
                </Col>
                <Col sm={0} md={3}/>
            </>
        );
    }

    renderBandDataSection() {
        let {request} = this.state;
        let {name, description} = request;
        return (
            <>
                <Col sm={12} style={{marginBottom: 20}}>
                    <TextFieldComponent
                        label="Nome"
                        placeHolder="Insira aqui o nome da sua banda"
                        value={name}
                        minLength={1}
                        maxLength={100}
                        onChange={(newName) => this.setBandValue('name', newName)}
                    />
                </Col>
                <Col sm={12} style={{marginBottom: 20}}>
                    <TextAreaComponent
                        label="Descrição"
                        placeHolder="Escreva aqui um pouco da sua banda..."
                        value={description}
                        minLength={5}
                        maxLength={500}
                        onChange={(newDescription) => this.setBandValue('description', newDescription)}
                    />
                </Col>
            </>
        );
    }

    renderBandAddressSection() {
        return (
            <AddressFormComponent
                ref={this.addressComponentRef}
                showToast={this.state.showToast}
                updateRequest={(newAddress) => this.setAddress(newAddress)}
            />
        );
    }

    renderBandContactSection() {
        return (
            <BandContactComponent
                isEditing={false}
                showToast={this.state.showToast}
                currentContacts={this.state.request.contacts}
            />
        );
    }

    renderFormEnding() {
        let {clearDialogVisible} = this.state;
        return (
            <>
                <Col sm={0} md={6}/>
                <Col sm={12} md={6}>
                    <ConfirmDialog
                        visible={clearDialogVisible}
                        onHide={() => this.setState({clearDialogVisible: false})}
                        header="Confirmação"
                        message="Deseja apagar os dados inseridos até agora?"
                        acceptLabel="Sim"
                        rejectLabel="Não"
                        icon="pi pi-exclamation-triangle"
                        accept={() => {
                            this.addressComponentRef.current.resetRequest();
                            this.setState({
                                clearDialogVisible: false,
                                request: new BandRequest(),
                                picture: null,
                                pictureUrl: null
                            })
                        }}
                        reject={() => this.setState({clearDialogVisible: false})}
                    />
                    <FormEndingComponent
                        showFirst={false}
                        onClickSecond={() => this.setState({clearDialogVisible: true})}
                        onClickThird={() => this.submitRequest()}
                    />
                </Col>
            </>
        );
    }

    submitRequest() {
        this.setState({isLoading: true});
        const validator = new ValidationUtil();
        let {request, picture, token} = this.state;
        let errors = validator.validate(request)
            .concat(validator.validate(request.address));
        if (request.contacts.some(contact => (validator.validate(contact).length !== 0))) {
            errors.concat({title: "Campos inválidos", message: "Um dos contatos possuem dados inválidos!"})
        }
        if (errors.length > 0) {
            this.state.showToast(ToastUtils.BUILD_TOAST_FORM_ERROR(errors[0]))
            this.setState({isLoading: false});
            return;
        }
        BandService.CREATE(request, picture, token)
            .then(
                response => {
                    this.state.showToast(
                        ToastUtils.BUILD_TOAST_SUCCESS_BODY("Banda criada com sucesso!")
                    )
                    this.setState({request: new BandRequest()});
                    setTimeout(
                        () => {
                            this.state.navigateTo('/minhas-bandas')
                        },
                        1500
                    );
                }
            ).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isLoading: false}))
    }

    setBandValue(field, newValue) {
        let {request} = this.state;
        let auxRequest = new BandRequest(request);
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
export default connect(mapStateToProps)(CreateBandPage);
