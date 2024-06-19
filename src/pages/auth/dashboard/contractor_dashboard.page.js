import {useNavigate} from "react-router-dom";
import React, {useRef} from "react";
import {Toast} from "primereact/toast";
import {Col, Container, Row} from "react-bootstrap";
import {DashboardFailPage} from "./dashboard_fail.page";
import {ActivityIndicatorComponent} from "../../../components/activity_indicator.component";
import {Chart} from "primereact/chart";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {StyleConstants} from "../../../service/style.constants";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {DateUtil} from "../../../util/date.util";
import {EventService} from "../../../service/new/event.service";

export const ContractorDashboardPage = ({token, user, dashboard}) => {
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
            <_ContractorDashboardPage
                token={token}
                navigateTo={redirectTo}
                showToast={showToast}
                authenticatedUser={user}
                dashboard={dashboard}
            />
        </>
    );
}

class _ContractorDashboardPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isMasterLoading: false,
            isLoading: false,
            loading: false,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            updateToken: props.updateToken,
            navigateTo: props.navigateTo,
            showToast: props.showToast,

            activeTabIndex: 0,

            error: false,

            eventNames: null,

            eventQuantityCurrentYear: null,
            eventQuantityPossibleYears: null,

            dashboardType: null,
            dashboardError: false,
            dashboard: null,
        }
    }

    componentDidMount() {
        this.searchDashBoard();
    }

    searchDashBoard() {
        let {token} = this.state;
        this.setState({isMasterLoading: true, error: false});
        EventService.DASHBOARD(token)
            .then(
                ({data}) => {
                    let eventQuantityPossibleYears = data['eventQuantityPerMonth'].data.map(d => (d.year));
                    this.setState(
                        {
                            dashboard: data,
                            eventQuantityCurrentYear: 0,
                            eventQuantityPossibleYears: eventQuantityPossibleYears,
                        }
                    );
                }
            ).catch(() => this.setState({error: true}))
            .finally(() => this.setState({isMasterLoading: false}))
    }

    renderError() {
        return (<DashboardFailPage reload={() => this.componentDidMount()}/>);
    }

    render() {
        let {isMasterLoading, error} = this.state;
        if (isMasterLoading) {
            return (<ActivityIndicatorComponent/>);
        }
        if (error) {
            return this.renderError();
        }
        return (
            <Container>
                <Row>
                    <Col>
                        {this.renderDashboard()}
                    </Col>
                </Row>
            </Container>
        )
    }

    generateEventQuantityPerMonthChartData() {
        let {eventQuantityCurrentYear, eventQuantityPossibleYears} = this.state;
        let {eventQuantityPerMonth} = this.state.dashboard;

        return {
            labels: eventQuantityPerMonth.labels,
            datasets: [
                {
                    label: eventQuantityPerMonth.label,
                    backgroundColor: eventQuantityPerMonth.backgroundColor,
                    data: eventQuantityPerMonth.data.filter(
                        d => (d.year === eventQuantityPossibleYears[eventQuantityCurrentYear])
                    )[0].values,
                }
            ],
        };
    }

    generateQuoteStatusesChartData() {
        let {quoteRequestStatuses} = this.state.dashboard;
        return {
            labels: quoteRequestStatuses.labels,
            datasets: [
                {
                    data: quoteRequestStatuses.data,
                    backgroundColor: quoteRequestStatuses.backgroundColor,
                    hoverBackgroundColor: quoteRequestStatuses.hoverBackgroundColor,
                }
            ]
        };
    }

    renderDashboard() {
        let {dashboard} = this.state;
        if (!dashboard) {
            return (
                <Container>
                    <Row>
                        <Col>
                            <h4 align='center' style={{marginTop: 30}}>Selecione uma banda ☺️</h4>
                        </Col>
                    </Row>
                </Container>
            );
        }
        let {eventQuantityCurrentYear, eventQuantityPossibleYears} = this.state;

        return (
            <Container>
                <Row>
                    <Col sm={12} md={4}>
                        <Card style={CARD_MARGIN}>
                            <h4>Status dos pedidos de orçamentos</h4>
                            <Chart
                                type="pie"
                                data={this.generateQuoteStatusesChartData()}
                                style={StyleConstants.WIDTH_100_PERCENT}
                            />
                        </Card>
                    </Col>
                    <Col sm={12} md={8}>
                        <Card style={CARD_MARGIN}>
                            <h4>Próximos eventops</h4>
                            <DataTable value={dashboard['nextEvents']} responsiveLayout="scroll">
                                <Column header="Evento" field="name"/>
                                <Column
                                    header="Data"
                                    body={(row) => {
                                        return (<p>{DateUtil.DATE_TO_STRING(new Date(row.dateTimestamp))}</p>);
                                    }}
                                />
                            </DataTable>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card style={CARD_MARGIN}>
                            <h4>Quantidade de eventos por mes</h4>
                            <Chart
                                type="bar"
                                data={this.generateEventQuantityPerMonthChartData()}
                                options={
                                    {
                                        maintainAspectRatio: false,
                                        aspectRatio: .8,
                                        plugins: {
                                            legend: {
                                                labels: {
                                                    color: '#495057'
                                                }
                                            }
                                        },
                                        scales: {
                                            x: {
                                                ticks: {
                                                    color: '#495057'
                                                },
                                                grid: {
                                                    color: '#ebedef'
                                                }
                                            },
                                            y: {
                                                ticks: {
                                                    color: '#495057'
                                                },
                                                grid: {
                                                    color: '#ebedef'
                                                }
                                            }
                                        }
                                    }
                                }
                            />

                            {
                                eventQuantityPossibleYears.length === 0
                                    ? (<></>)
                                    : (
                                        <>
                                            <Button
                                                className='p-button-rounded'
                                                icon='pi pi-arrow-left'
                                                disabled={eventQuantityCurrentYear === 0}
                                                onClick={() => {
                                                    this.setState(
                                                        {eventQuantityCurrentYear: eventQuantityCurrentYear - 1}
                                                    )
                                                }}
                                            />
                                            <span style={{marginLeft: 10, marginRight: 10}}>
                                                {eventQuantityPossibleYears[eventQuantityCurrentYear]}
                                            </span>
                                            <Button
                                                className='p-button-rounded'
                                                icon='pi pi-arrow-right'
                                                disabled={
                                                    eventQuantityCurrentYear === (eventQuantityPossibleYears.length - 1)
                                                }
                                                onClick={() => {
                                                    this.setState(
                                                        {eventQuantityCurrentYear: eventQuantityCurrentYear + 1}
                                                    )
                                                }}
                                            />
                                        </>
                                    )
                            }
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const CARD_MARGIN = {marginBottom: 10};
