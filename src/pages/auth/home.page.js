import React, {useRef} from "react";
import {Col, Container, Row} from "react-bootstrap";
import HomeTemplate from "./home.template";
import {useNavigate} from "react-router-dom";
import {Toast} from "primereact/toast";
import {updateToken} from "../../service/redux/action/token.action";
import {connect} from "react-redux";
import {ActivityIndicatorComponent} from "../../components/activity_indicator.component";
import {Pagination} from "../../domain/pagination";
import axios from "axios";
import {ProjectService} from "../../service/project.service";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {Accordion, AccordionTab} from "primereact/accordion";
import {ProjectDto} from "../../domain/dto/project.dto";
import {CommentOnProjectComponent} from "../../components/comment_on_project.component";
import {ProjectCommentsComponent} from "../../components/project_comments.component";
import {CommentForm} from "../../domain/form/comment.form";
import {ToastUtils} from "../../util/toast.utils";
import ValidationUtil from "../../util/validation/validation.util";
import {Constants} from "../../util/constants";

const HomePage = ({token, updateToken, user}) => {
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
            <_HomePage
                token={token}
                updateToken={updateToken}
                navigateTo={redirectTo}
                showToast={showToast}
                authenticatedUser={user}
            />
        </>
    );
}

class _HomePage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            mainLoading: false,
            loading: false,
            formValidator: new ValidationUtil(),

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            //projects to comment
            projectsToCommentLoading: false,
            projectsToComment: [],
            projectsToCommentPaginator: new Pagination(5),
            selectedProjectToComment: new ProjectDto(),
            showProjectToCommentField: false,
            newComment: new CommentForm(),

            //commented projects
            commentedProjectsLoading: false,
            commentedProjects: [],
            commentedProjectsPaginator: new Pagination(5),
            selectedCommentedProject: new ProjectDto(),
            showProjectComments: false,

            updateToken: props.updateToken,
            navigateTo: props.navigateTo,
            showToast: props.showToast,
        }
    }

    componentDidMount() {
        this.searchForProjects();
    }

    render() {
        let {
            mainLoading, authenticatedUser
        } = this.state;

        let roles = authenticatedUser.roles ? authenticatedUser.roles.map(role => (role.name)) : [];

        if (mainLoading) {
            return (<ActivityIndicatorComponent/>);
        }

        return (
            <>
                <HomeTemplate steps={['Home']}>
                    <Container>
                        <Row>
                            <Col>
                                <h2>Bem-vindo(a) {authenticatedUser.firstName}!</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Accordion activeIndex={0}>
                                    <AccordionTab header="Projetos para comentar">
                                        {this.renderProjectsToComment()}
                                    </AccordionTab>
                                </Accordion>
                            </Col>
                        </Row>
                        {
                            roles.includes(Constants.INTERN_ROLE)
                                ? (<Row>
                                    <Col>
                                        <Accordion activeIndex={0}>
                                            <AccordionTab header="Seus projetos comentados">
                                                {this.renderCommentedProjects()}
                                            </AccordionTab>
                                        </Accordion>
                                    </Col>
                                </Row>)
                                : (null)
                        }
                    </Container>
                </HomeTemplate>
            </>
        );
    }

    searchForProjects() {
        let {token, navigateTo, updateToken, projectsToCommentPaginator, commentedProjectsPaginator} = this.state;
        axios.all([
            ProjectService.LIST_PROJECTS_WITHOUT_COMMENTS(projectsToCommentPaginator, token),
            ProjectService.LIST_COMMENTED_PROJECTS(commentedProjectsPaginator, token),
        ])
            .then(
                responses => {
                    this.setState({
                        projectsToComment: responses[0].data.content,
                        commentedProjects: responses[1].data.content
                    });
                }
            )
            .catch(error => {
                updateToken(null);
                navigateTo('/');
            })
    }

    renderProjectsToComment() {
        let {
            projectsToCommentLoading, projectsToComment, projectsToCommentPaginator,
            selectedProjectToComment, showProjectToCommentField, newComment,
            navigateTo, token
        } = this.state;
        if (projectsToCommentLoading) {
            return (<ActivityIndicatorComponent/>)
        }
        return (
            <Container>
                <Row>
                    <Col>
                        <DataTable value={projectsToComment} responsiveLayout="scroll"
                                   currentPageReportTemplate=""
                                   rows={projectsToCommentPaginator.quantityPerPage}
                                   emptyMessage="Nenhum projeto encontrado">
                            <Column field="id" header="#" style={{width: '25%'}}/>
                            <Column field="name" header="Nome" style={{width: '25%'}}/>
                            <Column field="projectSituation" header="Situação" style={{width: '25%'}}/>
                            <Column headerStyle={{width: '4rem', textAlign: 'center'}}
                                    bodyStyle={{textAlign: 'center', overflow: 'visible'}}
                                    body={project => (this.callCommentFormModal(project))}/>
                        </DataTable>
                    </Col>
                </Row>
                <Row>
                    <Col/>
                    <Col>
                        <Row>
                            <Col>
                                <Button style={{alignSelf: 'center'}} label="<"
                                        disabled={projectsToCommentPaginator.page === 0}
                                        onClick={() => this.changePage(-1, 'projectsToCommentPaginator')}
                                />
                            </Col>
                            <Col>
                                <Button
                                    label={projectsToCommentPaginator.page + 1 + ''}
                                    className="p-button-text"
                                />
                            </Col>
                            <Col>
                                <Button style={{alignSelf: 'center'}} label=">"
                                        disabled={projectsToComment.length === 0}
                                        onClick={() => this.changePage(+1, 'projectsToCommentPaginator')}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col/>
                </Row>
                <CommentOnProjectComponent showDialog={showProjectToCommentField}
                                           hideDialog={() => this.setState({showProjectToCommentField: false})}
                                           navigateTo={navigateTo}
                                           selectedProject={selectedProjectToComment}
                                           token={token}
                                           comment={newComment}
                                           onChangeComment={comment => this.setState({newComment: comment})}
                                           onSubmmit={() => this.onSubmmitNewComment()}
                />
            </Container>
        );
    }

    renderCommentedProjects() {
        let {
            commentedProjectsLoading, commentedProjects, commentedProjectsPaginator,
            selectedCommentedProject, showProjectComments,
            navigateTo, token
        } = this.state;
        if (commentedProjectsLoading) {
            return (<ActivityIndicatorComponent/>)
        }
        return (
            <Container>
                <Row>
                    <Col>
                        <DataTable value={commentedProjects} responsiveLayout="scroll"
                                   currentPageReportTemplate=""
                                   rows={commentedProjectsPaginator.quantityPerPage}
                                   emptyMessage="Nenhum projeto encontrado">
                            <Column field="id" header="#" style={{width: '25%'}}/>
                            <Column field="name" header="Nome" style={{width: '25%'}}/>
                            <Column field="projectSituation" header="Situação" style={{width: '25%'}}/>
                            <Column headerStyle={{width: '4rem', textAlign: 'center'}}
                                    bodyStyle={{textAlign: 'center', overflow: 'visible'}}
                                    body={project => (this.callCommentsModal(project))}/>
                        </DataTable>
                    </Col>
                </Row>
                <Row>
                    <Col/>
                    <Col>
                        <Row>
                            <Col>
                                <Button style={{alignSelf: 'center'}} label="<"
                                        disabled={commentedProjectsPaginator.page === 0}
                                        onClick={() => this.changePage(-1, 'projectsToCommentPaginator')}
                                />
                            </Col>
                            <Col>
                                <Button
                                    label={commentedProjectsPaginator.page + 1 + ''}
                                    className="p-button-text"
                                />
                            </Col>
                            <Col>
                                <Button style={{alignSelf: 'center'}} label=">"
                                        disabled={commentedProjects.length === 0}
                                        onClick={() => this.changePage(+1, 'commentedProjectsPaginator')}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col/>
                </Row>
                <ProjectCommentsComponent  showDialog={showProjectComments}
                                           hideDialog={() => this.setState({showProjectComments: false})}
                                           navigateTo={navigateTo}
                                           selectedProject={selectedCommentedProject}
                                           token={token}
                />
            </Container>
        );
    }

    changePage(delta, paginatorName) {
        let paginator = this.state[paginatorName];
        paginator.page += delta
        this.setState({ [paginatorName] : paginator});
        this.searchForProjects();
    }

    onSubmmitNewComment(state, setState) {
        let {newComment, selectedProjectToComment, token, showToast} = this.state;
        let errors = this.validateForm();
        if (errors.length > 0) {
            this.state.showToast(
                ToastUtils.BUILD_TOAST_FORM_ERROR(errors[0])
            )
            return;
        }
        this.setState({
            loading: true,
            showProjectToCommentField: false
        });
        ProjectService.COMMENT(newComment, selectedProjectToComment.id, token)
            .then(response => showToast(ToastUtils.BUILD_TOAST_SUCCESS_BODY('Comentário criado com sucesso!')))
            .catch(error =>showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => {
                this.setState({loading: false});
                this.searchForProjects();
            });
    }

    validateForm() {
        let {newComment, formValidator} = this.state;

        return formValidator.validate(newComment);
    }

    callCommentFormModal(project) {
        return (
            <Button type="button" icon="pi pi-pencil" onClick={() => {
                this.setState({
                    selectedProjectToComment: project,
                    showProjectToCommentField: true
                });
            }}/>
        );
    }

    callCommentsModal(project) {
        return (
            <Button type="button" icon="pi pi-list" onClick={() => {
                this.setState({
                    selectedCommentedProject: project,
                    showProjectComments: true
                });
            }}/>
        );
    }
}

const myMapDispatchToProps = {
    updateToken: updateToken,
};
const mapStateToProps = state => (state);

export default connect(mapStateToProps, myMapDispatchToProps)(HomePage);
