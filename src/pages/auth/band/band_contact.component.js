import {Col, Container, Row} from "react-bootstrap";
import React from "react";
import {TextFieldComponent} from "../../../components/form/input/text_field.component";
import {ContactRequest} from "../../../domain/new/contact/request/contact.request";
import {ActivityIndicatorComponent} from "../../../components/activity_indicator.component";
import {ContactType} from "../../../domain/new/enum/contact_type.enum";
import {DropDownFieldComponent} from "../../../components/form/input/dropdown_field.component";
import {Button} from "primereact/button";
import {StyleConstants} from "../../../service/style.constants";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import ValidationUtil from "../../../util/validation/validation.util";
import {ToastUtils} from "../../../util/toast.utils";
import {ContactService} from "../../../service/new/contact.service";


export class BandContactComponent extends React.Component {
    constructor(props) {
        super(props)

        let contactTypes = Object.keys(ContactType)
            .map(type => ({label: ContactType[type].NAME, value: type}));

        this.state = {
            bandUuid: this.props.bandUuid,
            token: this.props.token,

            isEditing: !!props.isEditing,

            isLoading: false,
            showToast: props.showToast,

            types: contactTypes,
            selectedType: null,
            request: new ContactRequest(),

            insertedContacts: props.currentContacts,

            isEditingIndex: null,

            validator: new ValidationUtil(),
        }
    }

    removeContact(value, index) {
        if (!!value.uuid) {
            this.setState({isLoading: true});
            ContactService.DELETE_CONTACT(this.state.bandUuid, value.uuid, this.state.token)
                .then(response => {
                })
                .catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_FORM_ERROR(error)))
                .finally(() => this.setState({isLoading: false}))
        }
        let {insertedContacts} = this.state;
        insertedContacts.splice(index, 1);
        this.setState({insertedContacts: insertedContacts});
    }

    cleanRequest() {
        let aux = new ContactRequest();
        aux.content = "";
        this.setState({request: aux, selectedType: null});
    }

    insertRequest() {
        let {validator, insertedContacts, request, isEditing, bandUuid, token} = this.state;
        let errors = validator.validate(request);
        if (errors.length > 0) {
            this.state.showToast(ToastUtils.BUILD_TOAST_FORM_ERROR(errors[0]))
            return;
        }
        if (isEditing) {
            this.setState({isLoading: true})
            ContactService.CREATE(request, bandUuid, token)
                .then(response => {
                    insertedContacts.push(request);
                    this.setState({insertedContacts: insertedContacts});
                    this.cleanRequest()
                })
                .catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_FORM_ERROR(error)))
                .finally(() => this.setState({isLoading: false}))
        } else {
            insertedContacts.push(request);
            this.setState({insertedContacts: insertedContacts});
            this.cleanRequest()
        }
    }

    render() {
        if (this.state.isLoading) {
            return (<ActivityIndicatorComponent/>);
        }
        return (
            <Container>
                <Row style={{marginBottom: 20}}>
                    {this.renderInputsSection()}
                </Row>
                <Row>
                    {this.renderButtonsSection()}
                </Row>
                <Row>
                    {this.renderTableSection()}
                </Row>
            </Container>
        );
    }

    renderInputsSection() {
        return (
            <>
                <Col md={6} sm={12}>
                    <DropDownFieldComponent
                        label="Tipo"
                        placeHolder="Selecione o tipo do meio de contato"
                        value={this.state.selectedType}
                        options={this.state.types}
                        onChange={
                            (newType) => {
                                let auxRequest = new ContactRequest(
                                    this.state.request
                                );
                                auxRequest.type = newType;
                                this.setState({selectedType: newType, request: auxRequest});
                            }
                        }
                        optionLabel="label"
                    />
                </Col>
                <Col md={6} sm={12}>
                    <TextFieldComponent
                        label="Conteúdo"
                        placeHolder="URL, número, etc..."
                        value={this.state.request.content}
                        minLength={5}
                        maxLength={150}
                        onChange={
                            (newContent) => {
                                let auxRequest = new ContactRequest();
                                auxRequest.type = this.state.request.type;
                                auxRequest.content = newContent;
                                this.setState({request: auxRequest});
                            }
                        }
                    />
                </Col>
            </>
        );
    }

    renderButtonsSection() {
        return (
            <>
                <Col md={8} sm={0}/>
                <Col md={2} sm={6}>
                    <Button
                        label="Limpar"
                        style={StyleConstants.WIDTH_100_PERCENT}
                        className="p-button-warning"
                        icon="pi pi-trash"
                        onClick={() => this.cleanRequest()}
                    />
                </Col>
                <Col md={2} sm={6}>
                    <Button
                        label="Adicionar"
                        style={StyleConstants.WIDTH_100_PERCENT}
                        icon="pi pi-plus"
                        onClick={() => this.insertRequest()}
                    />
                </Col>
            </>
        );
    }

    renderTableSection() {
        let {insertedContacts} = this.state;

        return (
            <Col>
                <DataTable
                    value={
                        insertedContacts.map((value, index) => ({value: value, index: index}))
                    }
                    responsiveLayout="scroll"
                    emptyMessage="Nenhum contato aqui! 😕"
                >
                    <Column header="Tipo" body={(row) => (this.renderTypeColumn(row))}/>
                    <Column header="Conteúdo" body={(row) => (this.renderContentColumn(row))}></Column>
                    <Column header="Ações" body={(row) => (this.renderActionsColumn(row))}></Column>
                </DataTable>
            </Col>
        );
    }

    renderTypeColumn({value, index}) {
        let {isEditingIndex} = this.state;
        return (
            <Container>
                <Row>
                    <Col>
                        <DropDownFieldComponent
                            label=""
                            disabled={isEditingIndex !== index}
                            placeHolder="Selecione o tipo do meio de contato"
                            value={value.type}
                            options={this.state.types}
                            onChange={
                                (newType) => {
                                    this.updateTypeOnIndex(newType, index);
                                }
                            }
                            optionLabel="label"
                        />
                    </Col>
                </Row>
            </Container>
        );
    }

    updateTypeOnIndex(newType, index) {
        let {insertedContacts} = this.state;
        insertedContacts[index].type = newType;
        this.setState({insertedContacts: insertedContacts});
    }

    renderContentColumn({value, index}) {
        let {isEditingIndex} = this.state;
        return (
            <TextFieldComponent
                disabled={isEditingIndex !== index}
                label=""
                value={value.content}
                placeHolder="URL, número, etc..."
                onChange={(newContent) => this.updateContentOnIndex(newContent, index)}
            />
        );
    }

    updateContentOnIndex(newContent, index) {
        let {insertedContacts} = this.state;
        insertedContacts[index].content = newContent;
        this.setState({insertedContacts: insertedContacts});
    }

    renderActionsColumn({value, index}) {
        if (this.state.isEditingIndex === index) {
            return (
                <Container>
                    <Row>
                        <Col>
                            <Button
                                icon="pi pi-check"
                                className="p-button-rounded p-button-success"
                                style={{marginRight: 10}}
                                onClick={() => {
                                    let {validator, bandUuid, token, showToast} = this.state;
                                    let errors = validator.validate(value);
                                    if (errors.length > 0) {
                                        showToast(ToastUtils.BUILD_TOAST_FORM_ERROR(errors[0]))
                                        return;
                                    }
                                    if (!!value.uuid) {
                                        this.setState({isLoading: true});
                                        ContactService.UPDATE(value, bandUuid, value.uuid, token)
                                            .then(response => {
                                            })
                                            .catch(error => showToast(ToastUtils.BUILD_TOAST_FORM_ERROR(error)))
                                            .finally(() => this.setState({isLoading: false}))
                                    }
                                    this.setState({isEditingIndex: null})
                                }}
                            />
                        </Col>
                    </Row>
                </Container>
            );
        }
        return (
            <Container>
                <Row>
                    <Col>
                        <Button
                            icon="pi pi-pencil"
                            className="p-button-rounded p-button-warning"
                            style={{marginRight: 10}}
                            onClick={() => this.setState({isEditingIndex: index})}
                        />
                        <Button
                            icon="pi pi-trash"
                            className="p-button-rounded p-button-danger"
                            onClick={() => this.removeContact(value, index)}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}
