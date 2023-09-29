import {useNavigate} from "react-router-dom";
import React, {useRef} from "react";
import {Toast} from "primereact/toast";
import {Pagination} from "../../../domain/pagination";
import {ActivityIndicatorComponent} from "../../../components/activity_indicator.component";
import HomeTemplate from "../home.template";
import {Col, Container, Row} from "react-bootstrap";
import {UserFilter} from "../../../domain/filter/user.filter";
import {updateToken} from "../../../service/redux/action/token.action";
import {connect} from "react-redux";
import {Accordion, AccordionTab} from "primereact/accordion";
import {InputNumber} from "primereact/inputnumber";
import {StyleConstants} from "../../../service/style.constants";
import {InputText} from "primereact/inputtext";
import {FormEndingComponent} from "../../../components/form_ending.component";
import {UserService} from "../../../service/user.service";
import {ToastUtils} from "../../../util/toast.utils";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {TriStateCheckbox} from "primereact/tristatecheckbox";
import {UserOptionsDialogComponent} from "../../../components/user_options_dialog.component";

const ListUserPage = ({token}) => {
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
            <_ListUserPage token={token} navigateTo={redirectTo} showToast={showToast}/>
        </>
    );
}

class _ListUserPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,

            users: [],

            filter: new UserFilter(),
            pagination: new Pagination(),

            token: props.token,
            navigateTo: props.redirectTo,
            showToast: props.showToast,

            showUserOptions: false,
            selectedUser: null,
        }
    }

    componentDidMount() {
        this.setState({loading: true});
        UserService.LIST(
            this.state.filter, this.state.pagination, this.state.token
        ).then(
            response => {
                this.setState({users: response.data.content})
            }
        ).catch(
            error => {
                this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
                this.state.navigateTo('/');
            }
        ).finally(
            () => this.setState({loading: false})
        );
    }

    render() {
        let {loading, filter} = this.state;

        return (
            <>
                <HomeTemplate steps={['Usuários', 'Listar']}>
                    <Container>
                        <Row>
                            <Col>
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
                                                        id="firstName"
                                                        value={filter.firstName}
                                                        maxLength={100}
                                                        style={StyleConstants.WIDTH_100_PERCENT}
                                                        onChange={(e) => this.setField('firstName', e.target.value)}
                                                    />
                                                </Col>
                                                <Col>
                                                    <h6>Sobrenome</h6>
                                                    <InputText
                                                        id="lastName"
                                                        value={filter.lastName}
                                                        maxLength={100}
                                                        style={StyleConstants.WIDTH_100_PERCENT}
                                                        onChange={(e) => this.setField('lastName', e.target.value)}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <h6>Email</h6>
                                                    <InputText
                                                        id="email"
                                                        value={filter.email}
                                                        maxLength={100}
                                                        style={StyleConstants.WIDTH_100_PERCENT}
                                                        onChange={(e) => this.setField('email', e.target.value)}
                                                    />
                                                </Col>
                                                <Col>
                                                    <h6>Cargo: {this.generateInterState(filter.intern)}</h6>
                                                    <TriStateCheckbox
                                                        id="intern"
                                                        value={filter.intern}
                                                        onChange={(e) =>
                                                            this.setField('intern', e.value)
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <FormEndingComponent
                                                    showFirst={false}
                                                    onClickFirst={
                                                        () => {
                                                            this.setState({filter: new UserFilter()});
                                                            this.changePage(0);
                                                        }
                                                    }
                                                    onClickThird={() => {
                                                        let {filter} = this.state;
                                                        filter.firstName = (filter.firstName && (filter.firstName.length > 0))
                                                            ? filter.firstName : null;
                                                        filter.lastName = (filter.lastName && (filter.lastName.length > 0))
                                                            ? filter.lastName : null;
                                                        filter.email = (filter.email && (filter.email.length > 0))
                                                            ? filter.email : null;
                                                        this.setState({filter});
                                                        this.changePage(0)
                                                    }}
                                                />
                                            </Row>
                                        </Container>
                                    </AccordionTab>
                                </Accordion>
                            </Col>
                        </Row>
                        {
                            loading
                                ? (<ActivityIndicatorComponent/>)
                                : (
                                    <>

                                        <Row>
                                            <Col>
                                                <DataTable value={this.state.users}
                                                           responsiveLayout="scroll"
                                                           currentPageReportTemplate=""
                                                           rows={10}
                                                           emptyMessage="Nenhum usuário encontrado"
                                                >
                                                    <Column field="id" header="#" style={{width: '25%'}}/>
                                                    <Column field="firstName" header="Nome" style={{width: '25%'}}/>
                                                    <Column field="email" header="Email" style={{width: '25%'}}/>
                                                    <Column headerStyle={{width: '4rem', textAlign: 'center'}}
                                                            bodyStyle={{textAlign: 'center', overflow: 'visible'}}
                                                            body={user => (this.callModalOptions(user))}/>
                                                </DataTable>
                                            </Col>
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
                                                                disabled={this.state.users.length === 0}
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
                <UserOptionsDialogComponent showDialog={this.state.showUserOptions}
                                            hideDialog={() => this.setState({showUserOptions: false})}
                                            navigateTo={this.state.navigateTo}
                                            selectedUser={this.state.selectedUser}
                                            token={this.state.token}
                />
            </>
        );
    }

    changePage(pageDelta) {
        let {pagination} = this.state;
        pagination.page += pageDelta;
        this.setState({pagination});
        this.setState({loading: true});
        UserService.LIST(this.state.filter, this.state.pagination, this.state.token)
            .then(
                responses => {
                    this.setState({users: responses.data.content});
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

    callModalOptions(user) {
        return (
            <Button type="button" icon="pi pi-cog" onClick={() => {
                this.setState({
                    selectedUser: user,
                    showUserOptions: true
                });
            }}/>
        );
    }

    setField(field, value) {
        let {filter} = this.state;
        filter[field] = value;
        this.setState({filter});
    }

    generateInterState(state) {
        if (state == null) {
            return "Nenhum";
        } else if (state === true) {
            return "Interno";
        } else {
            return "Externo";
        }
    }
}

const myMapDispatchToProps = {
    updateToken: updateToken,
};
const mapStateToProps = state => (state);

export default connect(mapStateToProps, myMapDispatchToProps)(ListUserPage);