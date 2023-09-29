import {useNavigate} from "react-router-dom";
import React, {useRef} from "react";
import {Toast} from "primereact/toast";
import {updateToken} from "../../../service/redux/action/token.action";
import {connect} from "react-redux";
import HomeTemplate from "../home.template";
import {Col, Container, Row} from "react-bootstrap";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {ProjectService} from "../../../service/project.service";
import {ToastUtils} from "../../../util/toast.utils";
import {ProjectFilter} from "../../../domain/filter/project.filter";
import {Pagination} from "../../../domain/pagination";

const SelectProjectToManagePage = ({token}) => {
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
            <_SelectProjectToManagePage
                token={token}
                navigateTo={redirectTo}
                showToast={showToast}
            />
        </>
    );
}

class _SelectProjectToManagePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,

            pagination: new Pagination(),
            projects: [],

            token: props.token,

            navigateTo: props.navigateTo,
            showToast: props.showToast,
        }
    }

    componentDidMount() {
        this.setState({loading: true});

            ProjectService.LIST(new ProjectFilter(), this.state.pagination, this.state.token)
            .then(
                responses => {
                    this.setState({projects: responses.data.content});
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
                    this.setState({loading: false});
                }
            )
    }

    render() {
        return (
            <HomeTemplate steps={['Projetos', 'Administrar participantes']}>
                <Container>
                    <Row>
                        <DataTable value={this.state.projects} responsiveLayout="scroll"
                                   currentPageReportTemplate="" rows={10} emptyMessage="Nenhum projeto encontrado">
                            <Column field="id" header="#" style={{width: '25%'}}/>
                            <Column field="name" header="Nome" style={{width: '25%'}}/>
                            <Column field="projectSituation" header="Situação" style={{width: '25%'}}/>
                            <Column headerStyle={{width: '4rem', textAlign: 'center'}}
                                    bodyStyle={{textAlign: 'center', overflow: 'visible'}}
                                    body={project => (this.callNextPage(project))}/>
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
                </Container>
            </HomeTemplate>
        );
    }

    changePage(pageDelta) {
        let {pagination} = this.state;
        pagination.page += pageDelta;
        this.setState({pagination});
        this.setState({loading: true});
        ProjectService.LIST(new ProjectFilter(), this.state.pagination, this.state.token)
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

    callNextPage(project){
        return (
            <Button type="button" icon="pi pi-cog" onClick={() => {
                this.state.navigateTo(`/project/manage/${project.id}`)
            }}/>
        );
    }
}

const myMapDispatchToProps = {
    updateToken: updateToken,
};
const mapStateToProps = state => (state);

export default connect(mapStateToProps, myMapDispatchToProps)(SelectProjectToManagePage);