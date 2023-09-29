import React, {useRef} from 'react';
import {updateToken} from "../../../service/redux/action/token.action";
import {connect} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import {ProjectDto} from "../../../domain/dto/project.dto";
import {ProjectService} from "../../../service/project.service";
import {ToastUtils} from "../../../util/toast.utils";
import {ActivityIndicatorComponent} from "../../../components/activity_indicator.component";
import HomeTemplate from "../home.template";
import {Col, Container, Row} from "react-bootstrap";
import {FormEndingComponent} from "../../../components/form_ending.component";

const DeleteProjectPage = ({token}) => {
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
            <_DeleteProjectPage
                token={token}
                navigateTo={redirectTo}
                showToast={showToast}
                projectId={id}
            />
        </>
    );
}

class _DeleteProjectPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,

            projectId: this.props.projectId,
            project: new ProjectDto(),

            token: props.token,

            navigateTo: props.navigateTo,
            showToast: props.showToast,
        };
    }

    componentDidMount() {
        this.setState({loading: true});
        ProjectService.FIND_BY_ID(this.props.projectId, this.state.token)
            .then(response => this.setState({project: response.data}))
            .catch(error => {
                this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                this.state.navigateTo('/');
            })
            .finally(() => this.setState({loading: false}));
    }

    render() {
        let {loading, project, navigateTo} = this.state;

        if (loading) {
            return (<ActivityIndicatorComponent/>)
        }
        return (
            <HomeTemplate steps={['Projetos', 'Administrar participantes']}>
                <Container>
                    <Row>
                        <Col>
                            <h4>Tem certeza que deseja deletar o projeto {project.name}?</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormEndingComponent
                                showSecond={false}
                                labelFirst="Não"
                                onClickFirst={() => navigateTo('/project/list')}
                                labelThird="Sim"
                                onClickThird={() => this.deleteProject()}
                            />
                        </Col>
                    </Row>
                </Container>
            </HomeTemplate>
        )
    }

    deleteProject() {
        let {projectId, token, navigateTo} = this.state;
        this.setState({loading: true});
        ProjectService.DELETE(projectId, token)
            .then(
                response => navigateTo('/project/list')
            )
            .catch(
                error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
            )
            .finally(
                () => this.setState({loading: false})
            )
    }
}

const myMapDispatchToProps = {
    updateToken: updateToken,
};
const mapStateToProps = state => (state);

export default connect(mapStateToProps, myMapDispatchToProps)(DeleteProjectPage);