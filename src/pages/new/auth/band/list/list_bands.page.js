import {useNavigate} from "react-router-dom";
import React, {useRef} from "react";
import {Toast} from "primereact/toast";
import {connect} from "react-redux";
import HomeTemplate from "../../../template/home_template";
import {Col, Container, Row} from "react-bootstrap";
import {ListBandFilterComponent} from "./components/list_band_filter.component";
import {ListBandTableComponent} from "./components/list_band_table.component";
import {Paginator} from "primereact/paginator";
import {PaginationRequest} from "../../../../../domain/new/commom/request/pagination.request";
import {PageResponse} from "../../../../../domain/new/commom/response/page.response";
import {BandService} from "../../../../../service/new/band.service";
import {ToastUtils} from "../../../../../util/toast.utils";
import {BandResponse} from "../../../../../domain/new/band/response/band.response";
import {Card} from "primereact/card";

const ListBandsPage = ({token, user}) => {
    const toast = useRef(null);
    const showToast = (body) => {
        toast.current.show(body);
    };

    const navigate = useNavigate();
    const redirectTo = (route) => {
        navigate(route);
    };
    return (
        <>
            <Toast ref={toast} id="toast"/>
            <_ListBandsPage id="page"
                            token={token}
                            authenticatedUser={user}
                            navigateTo={redirectTo}
                            showToast={showToast}
            />
        </>
    );
}

class _ListBandsPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            isTableLoading: false,
            bands: [],
            pagination: new PaginationRequest(5),
            pageable: new PageResponse(),
        }
    }

    componentDidMount() {
        this.findBands();
    }

    findBands(criteria) {
        this.setState({isTableLoading: true});

        let {pagination, showToast} = this.state;
        BandService.FIND_BANDS(criteria, pagination)
            .then(response => {
                this.setupBands(response);
            }).catch(error => showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isTableLoading: false}))
    }

    setupBands(response) {
        let bands = response.data.content.map(b => (new BandResponse(b)));
        let newPageable = new PageResponse(response.data);
        this.setState({bands: bands, pageable: newPageable});
    }

    render() {
        return (
            <HomeTemplate steps={['Home', 'Bandas']}>
                <Card>
                    <Container>
                        <Row>
                            <Col>
                                <ListBandFilterComponent
                                    showToast={this.state.showToast}
                                    search={(criteria) => this.search(criteria)}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <ListBandTableComponent
                                    bands={this.state.bands}
                                    navigateTo={this.state.navigateTo}
                                    isLoading={this.state.isTableLoading}
                                />
                            </Col>
                        </Row>
                        <Row>
                            {this.renderPaginator()}
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    renderPaginator() {
        let {pagination, pageable} = this.state;
        return (
            <Paginator
                number={pagination.page}
                rows={pagination.quantityPerPage}
                totalRecords={pageable.totalElements}
                onPageChange={(e) => {
                    let {pagination} = this.state;
                    pagination.page = e.page;
                    this.setState({pagination})
                    this.findBands()
                }}/>
        );
    }

    search(criteria) {
        this.findBands(criteria);
    }
}

const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(ListBandsPage);
