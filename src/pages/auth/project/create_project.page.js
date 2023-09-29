import {useNavigate} from "react-router-dom";
import React, {useRef} from "react";
import {ProjectForm} from "../../../domain/form/project.form";
import {updateToken} from "../../../service/redux/action/token.action";
import {connect} from "react-redux";
import HomeTemplate from "../home.template";
import {Col, Container, Row} from "react-bootstrap";
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {InputTextarea} from 'primereact/inputtextarea';
import {Dropdown} from 'primereact/dropdown';
import {Calendar} from 'primereact/calendar';
import {InputNumber} from 'primereact/inputnumber';
import {TypeService} from "../../../service/type.service";
import {ActivityIndicatorComponent} from "../../../components/activity_indicator.component";
import {Toast} from "primereact/toast";
import {ToastUtils} from "../../../util/toast.utils";
import {ToastSuccessConstants} from "../../../util/toastconstants/toast_success.constants";
import ValidationUtil from "../../../util/validation/validation.util";
import {ProjectService} from "../../../service/project.service";

const CreateProjectPage = ({token, updateToken}) => {
    const navigate = useNavigate();
    const toast = useRef(null);
    const redirectTo = (route) => {
        navigate(route);
    };
    const showToast = (body) => {
        toast.current.show(body);
    };
    return (
        <>
            <Toast ref={toast}/>
            <_CreateProjectPage token={token} updateToken={updateToken} navigateTo={redirectTo} showToast={showToast}/>
        </>
    );
}

class _CreateProjectPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            formValidator: new ValidationUtil(),
            project: new ProjectForm(),
            token: props.token,
            projectPossibleSituations: [],
            projectPossibleSituationsLabels: [],
            updateToken: props.updateToken,
            navigateTo: props.redirectTo,
            showToast: props.showToast,
        }
    }

    componentDidMount() {
        this.setState({loading: true});
        TypeService.PROJECT_SITUATION_VALUES(this.state.token)
            .then(
                res => {
                    this.setProjectSituations(res.data);
                }
            )
            .catch(
                error => {
                    this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                    this.props.navigateTo('/');
                }
            )
            .finally(
                () => this.setState({loading: false})
            )
    }

    render() {
        let {loading, projectPossibleSituationsLabels} = this.state;
        let {
            name, description, projectSituation, maxParticipants, startDate, endDate,
        } = this.state.project;

        if (loading) {
            return (<ActivityIndicatorComponent/>);
        }
        return (
            <HomeTemplate steps={['Projetos', 'Cadastrar']}>
                <Container>
                    <Row>
                        <Card header={this.renderHeader()}>
                            <form onSubmit={(e) => this.submitForm(e)} className="p-fluid">
                                <Container>
                                    <Row>
                                        <Col>
                                            <h6>Nome</h6>
                                            <InputText
                                                id="name"
                                                value={name}
                                                maxLength={100}
                                                onChange={(e) => this.setField('name', e.target.value)}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <h6>Descrição</h6>
                                            <InputTextarea
                                                id="description"
                                                value={description}
                                                maxLength={1000}
                                                onChange={(e) => this.setField('description', e.target.value)}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <h6>Situação do projeto</h6>
                                            <Dropdown
                                                id="projectSituation"
                                                value={projectSituation}
                                                options={projectPossibleSituationsLabels}
                                                placeholder="Selecione a situação atual do projeto"
                                                onChange={(e) => this.setField('projectSituation', e.target.value)}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <h6>Quantidade máxima de participantes</h6>
                                            <InputNumber
                                                id="maxParticipants"
                                                value={maxParticipants}
                                                onValueChange={(e) => this.setField('maxParticipants', e.target.value)}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <h6>Data de início</h6>
                                            <Calendar
                                                id="startDate"
                                                value={startDate}
                                                dateFormat="dd/mm/yy"
                                                onChange={(e) => this.setField('startDate', e.target.value)}
                                            ></Calendar>
                                        </Col>
                                        <Col>
                                            <h6>Data de término</h6>
                                            <Calendar
                                                id="endDate"
                                                value={endDate}
                                                minDate={startDate ? startDate : null}
                                                dateFormat="dd/mm/yy"
                                                onChange={(e) => this.setField('endDate', e.target.value)}
                                            ></Calendar>
                                        </Col>
                                    </Row>
                                </Container>
                                <Button
                                    type="submit" label="Enviar" icon="pi pi-check" iconPos="right"
                                    onClick={() => this.setState({show: true})}
                                />
                            </form>
                        </Card>
                    </Row>
                </Container>
            </HomeTemplate>
        );
    }

    setField(field, value) {
        let {project} = this.state;
        project[field] = value;
        this.setState({project});
    }

    submitForm(e) {
        let errors = this.validateForm();
        if (errors.length > 0) {
            this.state.showToast(
                ToastUtils.BUILD_TOAST_FORM_ERROR(errors[0])
            )
            e.preventDefault()
            return;
        }

        this.setField(
            'projectSituation',
            this.state.projectPossibleSituations.filter(
                enumDto => (enumDto.label === this.state.project.projectSituation)
            )[0].value
        );

        ProjectService.CREATE(
            this.state.project, this.state.token
        ).then(
            response => {
                this.state.showToast(
                    ToastUtils.BUILD_TOAST_SUCCESS_BODY(ToastSuccessConstants.DATA_CREATED_WITH_SUCESS)
                )
                this.setState({project: new ProjectForm()});
            }
        ).catch(
            error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
        )
        e.preventDefault()
    }

    validateForm() {
        let {project, formValidator} = this.state;

        return formValidator.validate(project);
    }

    renderHeader() {
        return (
            <>
                <br/>
                <h3 align="center">Cadastro de projeto</h3>
            </>
        );
    }

    setProjectSituations(data) {
        this.setState({projectPossibleSituations: data})
        this.setState({projectPossibleSituationsLabels: data.map(situation => (situation.label))})
    }
}

const myMapDispatchToProps = {
    updateToken: updateToken,
};
const mapStateToProps = state => (state);

export default connect(mapStateToProps, myMapDispatchToProps)(CreateProjectPage);