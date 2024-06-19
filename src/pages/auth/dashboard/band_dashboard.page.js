import {useNavigate} from "react-router-dom";
import React, {useRef} from "react";
import {Toast} from "primereact/toast";
import {Col, Container, Row} from "react-bootstrap";
import {CalendarFieldComponent} from "../../../components/form/input/calendar_field.component";
import {DropDownFieldComponent} from "../../../components/form/input/dropdown_field.component";
import {Accordion, AccordionTab} from "primereact/accordion";
import {BandService} from "../../../service/new/band.service";
import {DashboardFailPage} from "./dashboard_fail.page";
import {ActivityIndicatorComponent} from "../../../components/activity_indicator.component";
import {FormEndingComponent} from "../../../components/form_ending.component";
import {ToastUtils} from "../../../util/toast.utils";
import {Chart} from "primereact/chart";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {StyleConstants} from "../../../service/style.constants";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {QuoteRequestStatusType} from "../../../domain/new/quote_request/quote_request_status.type";
import {DateUtil} from "../../../util/date.util";
import {EventService} from "../../../service/new/event.service";

export const BandDashboardPage = ({token, user, dashboard}) => {
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
            <_BandDashboardPage
                token={token}
                navigateTo={redirectTo}
                showToast={showToast}
                authenticatedUser={user}
                dashboard={dashboard}
            />
        </>
    );
}

class _BandDashboardPage extends React.Component {
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
            selectedBand: null,
            criteria: {
                bandUuid: null,
                startDate: null,
                endDate: null,
            },
            bandNames: [],

            eventNames: null,

            quotePricesCurrentYear: null,
            quotePricesPossibleYears: null,

            dashboardType: null,
            dashboardError: false,
            dashboard: null,
        }
    }

    componentDidMount() {
        let {token} = this.state;
        this.setState({isMasterLoading: true, error: false});
        BandService.FIND_AUTHENTICATED_PERSON_BANDS_NAMES(token)
            .then(response => {
                const bandNames = [];

                for (const key in response.data) {
                    if (response.data.hasOwnProperty(key)) {
                        bandNames.push({uuid: key, name: response.data[key]});
                    }
                }
                this.setState({bandNames})
            }).catch(() => this.setState({error: true}))
            .finally(() => this.setState({isMasterLoading: false}))
    }

    searchDashBoard() {
        let {criteria, token, showToast} = this.state;

        if (!criteria.bandUuid) {
            showToast(ToastUtils.BUILD_TOAST_FORM_ERROR('Error', 'Selecione uma banda primeiro!'));
            return;
        }

        this.setState({isLoading: true});
        BandService.DASHBOARD(criteria.bandUuid, criteria.startDate, criteria.endDate, token)
            .then(
                ({data}) => {
                    let quotePricesPossibleYears = data['quotePrices'].data.map(d => (d.year));
                    this.setState(
                        {
                            dashboard: data,
                            quotePricesCurrentYear: 0,
                            quotePricesPossibleYears: quotePricesPossibleYears,
                        }
                    );
                    this.searchForEvents(data['allQuotes'].map(q => q.eventUuid))
                }
            ).catch(() => this.setState({error: true}))
            .finally(() => this.setState({isLoading: false}))
    }

    searchForEvents(eventsUuids) {
        let {token} = this.state;
        this.setState({isLoading: true});
        EventService.FIND_NAMES(eventsUuids, token)
            .then(({data}) => {
                this.setState({eventNames: data})
            })
            .catch(() => this.setState({error: true}))
            .finally(() => this.setState({isLoading: false}));
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
                        <Accordion activeIndex={0}>
                            <AccordionTab header="Filtros">
                                {this.renderFilters()}
                            </AccordionTab>
                        </Accordion>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {this.renderDashboard()}
                    </Col>
                </Row>
            </Container>
        )
    }

    renderFilters() {
        let {isLoading, criteria, selectedBand, bandNames} = this.state;
        return (
            <Container>
                <Row>
                    <Col sm={12} md={4} style={{paddingBottom: 5}}>
                        <DropDownFieldComponent
                            label='Banda'
                            placeHolder='Selecione uma banda'
                            disabled={isLoading}
                            value={selectedBand}
                            options={bandNames}
                            optionLabel='name'
                            onChange={
                                value => {
                                    criteria.bandUuid = value.uuid;
                                    this.setState({criteria: criteria, selectedBand: value});
                                }
                            }
                        />
                    </Col>
                    <Col sm={12} md={4} style={{paddingBottom: 5}}>
                        <CalendarFieldComponent
                            optional={true}
                            label='Data início'
                            placeHolder='Orçamentos após esta data'
                            disabled={isLoading}
                            value={criteria.startDate}
                            minDate={null}
                            maxDate={criteria.endDate ? criteria.endDate : null}
                            dateFormat='dd/mm/yy'
                            showTime={false}
                            onChange={
                                newDate => {
                                    criteria.startDate = newDate;
                                    this.setState({criteria: criteria});
                                }
                            }
                        />
                    </Col>
                    <Col sm={12} md={4} style={{paddingBottom: 5}}>
                        <CalendarFieldComponent
                            optional={true}
                            label='Data fim'
                            placeHolder='Orçamentos antes esta data'
                            disabled={isLoading}
                            value={criteria.endDate}
                            minDate={criteria.startDate ? criteria.startDate : null}
                            maxDate={null}
                            dateFormat='dd/mm/yy'
                            showTime={false}
                            onChange={
                                newDate => {
                                    criteria.endDate = newDate;
                                    this.setState({criteria: criteria});
                                }
                            }
                        />
                    </Col>
                </Row>
                <Row>
                    <Col sm={0} md={6}></Col>
                    <Col sm={12} md={6}>
                        <FormEndingComponent
                            showFirst={false}
                            disableSecond={isLoading}
                            disableThird={isLoading}
                            onClickSecond={
                                () => {
                                    this.setState({
                                        selectedBand: null,
                                        criteria: {
                                            bandUuid: null,
                                            startDate: null,
                                            endDate: null,
                                        }
                                    });
                                }
                            }
                            onClickThird={() => this.searchDashBoard()}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }

    generateQuotePricesChartData() {
        let {quotePricesCurrentYear, quotePricesPossibleYears} = this.state;
        let {quotePrices} = this.state.dashboard;

        return {
            labels: quotePrices.labels,
            datasets: [
                {
                    label: quotePrices.label,
                    backgroundColor: quotePrices.backgroundColor,
                    data: quotePrices.data.filter(
                        d => (d.year === quotePricesPossibleYears[quotePricesCurrentYear])
                    )[0].values,
                }
            ],
        };
    }

    generateQuoteStatusesChartData() {
        let {quoteStatuses} = this.state.dashboard;
        return {
            labels: quoteStatuses.labels,
            datasets: [
                {
                    data: quoteStatuses.data,
                    backgroundColor: quoteStatuses.backgroundColor,
                    hoverBackgroundColor: quoteStatuses.hoverBackgroundColor,
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
        let {quotePricesCurrentYear, quotePricesPossibleYears, eventNames} = this.state;

        return (
            <Container>
                <Row>
                    <Col>
                        <Card style={CARD_MARGIN}>
                            <h4>Status dos orçamentos</h4>
                            <Chart
                                type="pie"
                                data={this.generateQuoteStatusesChartData()}
                                style={StyleConstants.WIDTH_100_PERCENT}
                            />
                        </Card>
                    </Col>
                    <Col>
                        <Card style={CARD_MARGIN}>
                        <h4>Ultimos orçamentos</h4>
                            <DataTable value={dashboard['allQuotes']} responsiveLayout="scroll">
                                <Column
                                    header="Evento"
                                    body={(row) => {
                                        if(!eventNames) {
                                            return (<p>{JSON.stringify(row)}</p>);
                                        }
                                        return (<p>{eventNames[row.eventUuid]}</p>);
                                    }}
                                />
                                <Column
                                    field="creationDate"
                                    header="Data"
                                    body={(row) => {
                                        if (!row.creationDate) {
                                            return (<p>{JSON.stringify(row)}</p>);
                                        }
                                        return (<p>{DateUtil.DATE_TO_STRING(new Date(row.creationDate))}</p>);
                                    }}
                                />
                                <Column
                                    field="status"
                                    header="Status"
                                    body={(row) => {
                                        if (!row.status) {
                                            return (<p>{JSON.stringify(row)}</p>);
                                        }
                                        if (row.hired) {
                                            return (<p>Contratado</p>);
                                        }
                                        let status = QuoteRequestStatusType[row.status];
                                        return (<p>{status.translatedName}</p>);
                                    }}
                                />
                            </DataTable>
                        </Card>
                    </Col>
                </Row>
                <Row>
                <Col>
                        <Card style={CARD_MARGIN}>
                            <h4>Faturamento total por mes</h4>
                            <Chart
                                type="bar"
                                data={this.generateQuotePricesChartData()}
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
                                quotePricesPossibleYears.length === 0
                                    ? (<></>)
                                    : (
                                        <>
                                            <Button
                                                className='p-button-rounded'
                                                icon='pi pi-arrow-left'
                                                disabled={quotePricesCurrentYear === 0}
                                                onClick={() => {
                                                    this.setState({quotePricesCurrentYear: quotePricesCurrentYear - 1})
                                                }}
                                            />
                                            <span style={{marginLeft: 10, marginRight: 10}}>
                                                {quotePricesPossibleYears[quotePricesCurrentYear]}
                                            </span>
                                            <Button
                                                className='p-button-rounded'
                                                icon='pi pi-arrow-right'
                                                disabled={
                                                    quotePricesCurrentYear === (quotePricesPossibleYears.length - 1)
                                                }
                                                onClick={() => {
                                                    this.setState({quotePricesCurrentYear: quotePricesCurrentYear + 1})
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
