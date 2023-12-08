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

export const CreateBandPage = ({token, user}) => {
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

        this.state = {
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
                            const newPictureUrl = URL.createObjectURL(newPicture)
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
