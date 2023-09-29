import {useNavigate} from "react-router-dom";
import React, {useRef} from "react";
import {updateToken} from "../../../service/redux/action/token.action";
import {connect} from "react-redux";
import HomeTemplate from "../home.template";
import {Col, Container, Row} from "react-bootstrap";
import {TypeService} from "../../../service/type.service";
import {ActivityIndicatorComponent} from "../../../components/activity_indicator.component";
import {Toast} from "primereact/toast";
import {ToastUtils} from "../../../util/toast.utils";
import {ProjectOptionsDialogComponent} from "../../../components/project_options_dialog.component";
import axios from "axios";
import {ProjectService} from "../../../service/project.service";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {ProjectFilter} from "../../../domain/filter/project.filter";
import {Pagination} from "../../../domain/pagination";
import {Accordion, AccordionTab} from "primereact/accordion";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import {Dropdown} from "primereact/dropdown";
import {Calendar} from "primereact/calendar";
import {StyleConstants} from "../../../service/style.constants";
import {FormEndingComponent} from "../../../components/form_ending.component";

const ListProjectPage = ({token}) => {
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
            <_ListProjectPage token={token} navigateTo={redirectTo} showToast={showToast}/>
        </>
    );
}

class _ListProjectPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,

            filter: new ProjectFilter(),
            pagination: new Pagination(),
            projects: [],

            token: props.token,

            projectPossibleSituations: [],
            projectPossibleSituationsLabels: [],

            navigateTo: props.redirectTo,
            showToast: props.showToast,

            showProjectOptions: false,
            selectedProject: null,
        }
    }

    componentDidMount() {
        this.setState({loading: true});

        axios.all([
            TypeService.PROJECT_SITUATION_VALUES(this.state.token),
            ProjectService.LIST(this.state.filter, this.state.pagination, this.state.token),
        ])
            .then(
                responses => {
                    this.setProjectSituations(responses[0].data);
                    this.setState({projects: responses[1].data.content});
                }
            )
            .catch(
                error => {
                    this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                    this.state.navigateTo('/');
                }
            )
            .finally(
                () => {
                    let {filter} = this.state;
                    filter.projectSituation = 'Nenhum'
                    this.setState({loading: false, filter});
                }
            )
    }

    render() {
        let {loading, filter, projectPossibleSituationsLabels} = this.state;

        return (
            <>
                <HomeTemplate steps={['Projetos', 'Listar']}>
                    <Container>
                        <Row>
                            <Accordion activeIndex={0}>
                                <AccordionTab header="Filtros">
                                    <Container>
                                        <Row>
                                            <Col>
                                                <h6>Id</h6>
                                                <InputNumber
                                                    id="id"
                                                    value={filter.id}
                                                    style={StyleConstants.WIDTH_100_PERCENT}
                                                    onValueChange={(e) => this.setField('id', e.target.value)}
                                                />
                                            </Col>
                                            <Col>
                                                <h6>Nome</h6>
                                                <InputText
                                                    id="name"
                                                    value={filter.name}
                                                    maxLength={100}
                                                    style={StyleConstants.WIDTH_100_PERCENT}
                                                    onChange={(e) => this.setField('name', e.target.value)}
                                                />
                                            </Col>
                                            <Col>
                                                <h6>Situação do Projeto</h6>
                                                <Dropdown
                                                    id="projectSituation"
                                                    value={filter.projectSituation}
                                                    options={projectPossibleSituationsLabels}
                                                    placeholder="Selecione a situação atual do projeto"
                                                    style={StyleConstants.WIDTH_100_PERCENT}
                                                    onChange={(e) => this.setField('projectSituation', e.target.value)}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <h6>Data de início</h6>
                                                <Calendar
                                                    id="startDate"
                                                    value={filter.startDate}
                                                    dateFormat="dd/mm/yy"
                                                    style={StyleConstants.WIDTH_100_PERCENT}
                                                    onChange={(e) => this.setField('startDate', e.target.value)}
                                                ></Calendar>
                                            </Col>
                                            <Col>
                                                <h6>Data de término</h6>
                                                <Calendar
                                                    id="endDate"
                                                    value={filter.endDate}
                                                    minDate={filter.startDate ? filter.startDate : null}
                                                    dateFormat="dd/mm/yy"
                                                    style={StyleConstants.WIDTH_100_PERCENT}
                                                    onChange={(e) => this.setField('endDate', e.target.value)}
                                                ></Calendar>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <FormEndingComponent
                                                showFirst={false}
                                                onClickFirst={
                                                    () => {
                                                        let {filter} = this.state;
                                                        filter = new ProjectFilter();
                                                        filter.projectSituation = 'Nenhum';
                                                        this.setState({filter});
                                                        this.changePage(0);
                                                    }
                                                }
                                                onClickThird={() => {
                                                    let {filter} = this.state;
                                                    filter.name = (filter.name && (filter.name.length > 0))
                                                        ? filter.name : null;
                                                    this.setState({filter});
                                                    this.changePage(0)
                                                }}
                                            />
                                        </Row>
                                    </Container>
                                </AccordionTab>
                            </Accordion>
                        </Row>
                        {
                            loading
                                ? (<ActivityIndicatorComponent/>)
                                : (
                                    <>
                                        <Row>
                                            <DataTable value={this.state.projects} responsiveLayout="scroll"
                                                       currentPageReportTemplate="" rows={10}
                                                       emptyMessage="Nenhum projeto encontrado">
                                                <Column field="id" header="#" style={{width: '25%'}}/>
                                                <Column field="name" header="Nome" style={{width: '25%'}}/>
                                                <Column field="projectSituation" header="Situação" style={{width: '25%'}}/>
                                                <Column headerStyle={{width: '4rem', textAlign: 'center'}}
                                                        bodyStyle={{textAlign: 'center', overflow: 'visible'}}
                                                        body={project => (this.callModalOptions(project))}/>
                                            </DataTable>
                                        </Row>
                                        <Row>
                                            <Col/>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        <Button style={{alignSelf: 'center'}} label="<"
                                                                disabled={this.state.pagination.page === 0}
                                                                onClick={() => this.changePage(-1)}
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <Button
                                                            label={this.state.pagination.page + 1 + ''}
                                                            className="p-button-text"
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <Button style={{alignSelf: 'center'}} label=">"
                                                                disabled={this.state.projects.length === 0}
                                                                onClick={() => this.changePage(+1)}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col/>
                                        </Row>
                                    </>
                                )
                        }
                    </Container>
                </HomeTemplate>
                <ProjectOptionsDialogComponent showDialog={this.state.showProjectOptions}
                                               hideDialog={() => this.setState({showProjectOptions: false})}
                                               navigateTo={this.state.navigateTo}
                                               selectedProject={this.state.selectedProject}
                                               token={this.state.token}
                />
            </>
        );
    }

    setField(field, value) {
        let {filter} = this.state;
        filter[field] = value;
        this.setState({filter});
    }

    changePage(pageDelta) {
        let {pagination} = this.state;
        pagination.page += pageDelta;
        this.setState({pagination});
        this.setState({loading: true});
        ProjectService.LIST(this.state.filter, this.state.pagination, this.state.token)
            .then(
                responses => {
                    this.setState({projects: responses.data.content});
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

    callModalOptions(project) {
        return (
            <Button type="button" icon="pi pi-cog" onClick={() => {
                this.setState({
                    selectedProject: project,
                    showProjectOptions: true
                });
            }}/>
        );
    }

    setProjectSituations(data) {
        this.setState({projectPossibleSituations: [{label: 'Nenhum', value: null}, ...data]})
        this.setState({projectPossibleSituationsLabels: ['Nenhum', ...data.map(situation => (situation.label))]})
    }
}

const myMapDispatchToProps = {
    updateToken: updateToken,
};
const mapStateToProps = state => (state);

export default connect(mapStateToProps, myMapDispatchToProps)(ListProjectPage);