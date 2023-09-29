import {useNavigate, useParams} from "react-router-dom";
import React, {useRef} from "react";
import {Toast} from "primereact/toast";
import {updateToken} from "../../../service/redux/action/token.action";
import {connect} from "react-redux";
import HomeTemplate from "../home.template";
import {Col, Container, Row} from "react-bootstrap";
import {ProjectService} from "../../../service/project.service";
import {ToastUtils} from "../../../util/toast.utils";
import {ProjectDto} from "../../../domain/dto/project.dto";
import {StyleConstants} from "../../../service/style.constants";
import {InputText} from "primereact/inputtext";
import {Accordion, AccordionTab} from "primereact/accordion";
import {PickList} from "primereact/picklist";
import axios from "axios";
import {UserService} from "../../../service/user.service";
import {Pagination} from "../../../domain/pagination";
import {ActivityIndicatorComponent} from "../../../components/activity_indicator.component";
import {FormEndingComponent} from "../../../components/form_ending.component";
import {ToastSuccessConstants} from "../../../util/toastconstants/toast_success.constants";

const ManageProjectPage = ({token}) => {
    let {id} = useParams();
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
            <_ManageProjectPage
                token={token}
                navigateTo={redirectTo}
                showToast={showToast}
                projectId={id}
            />
        </>
    );
}

class _ManageProjectPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,

            projectId: this.props.projectId,
            project: new ProjectDto(),

            participantsIn: [],
            participantsInPagination: new Pagination(5),

            participantsLeft: [],
            participantsLeftPagination: new Pagination(5),

            token: props.token,

            navigateTo: props.navigateTo,
            showToast: props.showToast,
        }
    }

    componentDidMount() {
        this.setState({loading: true});
        axios.all(
            [
                ProjectService.FIND_BY_ID(this.props.projectId, this.state.token),
                UserService.GET_ALL_USERS_LEFT(
                    this.state.projectId,
                    this.state.participantsLeftPagination,
                    this.state.token
                ),
            ]
        )
            .then(response => {
                let project = response[0].data;
                let usersLeft = response[1].data.content;

                this.setState({
                    project: project,
                    participantsIn: (project.participants != null) ? project.participants : [],
                    participantsLeft: (usersLeft != null) ? usersLeft : [],
                });
            })
            .catch(error => {
                this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                this.state.navigateTo('/');
            })
            .finally(() => this.setState({loading: false}));

    }

    render() {
        let {loading, project, participantsLeft, participantsIn} = this.state;

        if (loading) {
            return (<ActivityIndicatorComponent/>)
        }

        return (
            <HomeTemplate steps={['Projetos', 'Administrar participantes']}>
                <Container>
                    <Row>
                        <Col>
                            <Accordion activeIndex={0}>
                                <AccordionTab header="Projeto">
                                    <Container>
                                        <Row>
                                            <Col>
                                                <h6>Nome</h6>
                                                <InputText
                                                    id="name"
                                                    value={project.name}
                                                    style={StyleConstants.WIDTH_100_PERCENT}
                                                    disabled={true}
                                                />
                                            </Col>
                                            <Col>
                                                <h6>Situação do Projeto</h6>
                                                <InputText
                                                    id="description"
                                                    value={this.makeSmallDescription(project)}
                                                    style={StyleConstants.WIDTH_100_PERCENT}
                                                    disabled={true}
                                                />
                                            </Col>
                                        </Row>
                                    </Container>
                                </AccordionTab>
                            </Accordion>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <PickList
                                source={participantsLeft}
                                target={participantsIn}
                                itemTemplate={this.picklistTemplate}
                                sourceFilterPlaceholder="Procurar por nome"
                                targetFilterPlaceholder="Procurar por nome"
                                metaKeySelection={false}
                                onChange={(e) => this.changeParticipant(e)}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormEndingComponent
                                showSecond={false}
                                onClickFirst={() => this.state.navigateTo('/project/manage')}
                                onClickThird={() => this.submitForm()}
                            />
                        </Col>
                    </Row>
                </Container>
            </HomeTemplate>
        );
    }

    submitForm() {
        this.setState({loading: true});
        let {projectId, participantsIn, token} = this.state;
        const participantsIds = participantsIn.map(p => p.id);

        ProjectService.UPDATE_PARTICIPANTS(projectId, participantsIds, token)
            .then(response => {
                this.state.showToast(
                    ToastUtils.BUILD_TOAST_SUCCESS_BODY(ToastSuccessConstants.DATA_CREATED_WITH_SUCESS)
                );
                this.state.navigateTo('/project/manage');
            })
            .catch(
                error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
            )
            .finally(() => this.setState({loafing: false}));
    }

    picklistTemplate(participant) {
        let p = `${participant.id} | ${participant.firstName}`
        return (
            <div>
                <p>{p}</p>
            </div>
        )
    }

    makeSmallDescription(project) {
        let {description} = project;
        if (description != null) {
            if (description.length < 30) {
                return description;
            }
            return description.substring(0, 29)
        }
        return "-";
    }

    changeParticipant(e) {
        this.setState({
            participantsLeft: e.source,
            participantsIn: e.target
        });
    }
}

const myMapDispatchToProps = {
    updateToken: updateToken,
};
const mapStateToProps = state => (state);

export default connect(mapStateToProps, myMapDispatchToProps)(ManageProjectPage);