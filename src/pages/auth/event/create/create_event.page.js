import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {Toast} from "primereact/toast";
import {ActivityIndicatorComponent} from "../../../../components/activity_indicator.component";
import HomeTemplate from "../../../template/home_template";
import {Card} from "primereact/card";
import {Col, Container, Row} from "react-bootstrap";
import {connect} from "react-redux";
import {FormAreaComponent} from "../../../../components/form/form_area.component";
import {EventRequest} from "../../../../domain/new/event/request/event.request";
import {TextFieldComponent} from "../../../../components/form/input/text_field.component";
import {TextAreaComponent} from "../../../../components/form/input/text_area.component";
import {CalendarFieldComponent} from "../../../../components/form/input/calendar_field.component";
import {DateUtil} from "../../../../util/date.util";
import {Divider} from "primereact/divider";
import {AddressFormComponent} from "../../../../components/form/address_form.component";
import {FormEndingComponent} from "../../../../components/form_ending.component";
import ValidationUtil from "../../../../util/validation/validation.util";
import {ToastUtils} from "../../../../util/toast.utils";
import {EventService} from "../../../../service/new/event.service";

const CreateEventPage = ({token, user}) => {
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
            <_CreateEventPage
                token={token}
                authenticatedUser={user}
                navigateTo={redirectTo}
                showToast={showToast}
            />
        </>
    );
}

class _CreateEventPage extends React.Component {

    constructor(props) {
        super(props)

        this.addressComponentRef = React.createRef();
        this.state = {
            isMasterLoading: false,
            isLoading: false,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            request: new EventRequest(),
            eventDate: new Date(),
        }
    }

    setIsLoading(isLoading) {
        this.setState({isLoading: isLoading});
        this.addressComponentRef.current.setIsLoading(isLoading);
    }

    render() {
        if (this.state.isMasterLoading) {
            return (<ActivityIndicatorComponent/>);
        }
        let {request, eventDate, isLoading, showToast} = this.state;
        return (
            <HomeTemplate steps={['Home', 'Eventos', 'Criar']}>
                <Card className='main-card'>
                    <Container>
                        <Row>
                            <Col>
                                <FormAreaComponent>
                                    <Container>
                                        <Row>
                                            <Col md={6} sm={12}>
                                                <TextFieldComponent
                                                    disabled={isLoading}
                                                    label="Nome"
                                                    placeHolder='Nome do evento...'
                                                    value={request.name}
                                                    onChange={newName => this.updateField('name', newName)}
                                                    minLength={3}
                                                    maxLength={100}
                                                />
                                            </Col>
                                            <Col md={6} sm={12}>
                                                <CalendarFieldComponent
                                                    disabled={isLoading}
                                                    label="Data"
                                                    placeHolder="Data do evento..."
                                                    value={eventDate}
                                                    maxDate={null}
                                                    onChange={newEventDate => {
                                                        if (newEventDate) {
                                                            let newDate = new Date(newEventDate);
                                                            let {request} = this.state;
                                                            request.dateTimestamp = DateUtil.DATE_TO_EPOCH(newDate);
                                                            this.setState({
                                                                eventDate: newDate, request: request
                                                            })
                                                        }
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <TextAreaComponent
                                                    disabled={isLoading}
                                                    label="Descrição"
                                                    placeHolder='Descrição do seu evento...'
                                                    value={request.description}
                                                    onChange={
                                                        newDescription => this.updateField(
                                                            'description', newDescription
                                                        )
                                                    }
                                                    minLength={3}
                                                    maxLength={500}
                                                />
                                            </Col>
                                        </Row>
                                        <Divider align='center'><span>Endereço</span></Divider>
                                        <Row>
                                            <Col>
                                                <AddressFormComponent
                                                    isLoading={isLoading}
                                                    ref={this.addressComponentRef}
                                                    showToast={showToast}
                                                    updateRequest={
                                                        (newAddress) => this.updateField('address', newAddress)
                                                    }
                                                    address={request.address}
                                                />
                                            </Col>
                                        </Row>
                                    </Container>
                                </FormAreaComponent>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} sm={0}/>
                            <Col>
                                <FormEndingComponent
                                    disableSecond={isLoading}
                                    disableThird={isLoading}
                                    showFirst={false}
                                    showSecond={!this.state.isEditing}
                                    onClickSecond={
                                        () => {
                                            this.setState(
                                                {
                                                    request: new EventRequest(),
                                                    eventDate: new Date()
                                                }
                                            );
                                            this.addressComponentRef.current.resetRequest();
                                        }
                                    }
                                    onClickThird={() => this.submitRequest()}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    updateField(field, value) {
        let {request} = this.state;
        request[field] = value;
        this.setState({request: request});
    }

    submitRequest() {
        this.setIsLoading(true);

        let {request, token, navigateTo} = this.state;
        const validator = new ValidationUtil();

        let errors = validator.validate(request)
            .concat(validator.validate(request.address));
        if (errors.length > 0) {
            this.state.showToast(ToastUtils.BUILD_TOAST_FORM_ERROR(errors[0]));
            this.setIsLoading(false);
            return;
        }
        EventService.CREATE(request, token)
            .then(() => {
                this.state.showToast(ToastUtils.BUILD_TOAST_SUCCESS_BODY('Evento criado com sucesso!!'));
                setTimeout(
                    () => {
                        navigateTo('/eventos')
                    },
                    2000
                );
            })
            .catch(
                error => {
                    this.setIsLoading(false);
                    this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                }
            )
    }
}

const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(CreateEventPage);
