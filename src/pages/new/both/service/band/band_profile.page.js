import React, {useRef} from "react";
import {updateToken} from "../../../../../service/redux/action/token.action";
import {updateUser} from "../../../../../service/redux/action/user.action";
import {connect} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import HomeTemplate from "../../../template/home_template";
import {BandService} from "../../../../../service/new/band.service";
import {ActivityIndicatorComponent} from "../../../../../components/activity_indicator.component";
import {BandProfileDto} from "../../../../../domain/new/dto/band/band_profile.dto";
import {ToastUtils} from "../../../../../util/toast.utils";
import {Col, Container, Row} from "react-bootstrap";
import {Avatar} from "primereact/avatar";
import {FileService} from "../../../../../service/new/file.service";
import {Card} from "primereact/card";
import {Image} from "primereact/image";
import {TabPanel, TabView} from "primereact/tabview";
import {MarginStyle} from "../../../../../style/margin.style";
import {Button} from "primereact/button";
import {StyleConstants} from "../../../../../service/style.constants";

const BandProfilePage = ({token, user}) => {
    let {uuid} = useParams();

    const toast = useRef(null);
    const showToast = (body) => {
        toast.current.show(body);
    };

    const navigate = useNavigate();
    const redirectTo = (route) => {
        navigate(route);
    };
    return (
        <_BandProfilePage
            token={token}
            user={user}
            navigateTo={redirectTo}
            authenticatedUser={user}
            bandUuid={uuid}
            showToast={showToast}
        />
    );
}

class _BandProfilePage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,

            bandUuid: props.bandUuid,
            band: new BandProfileDto(),
            user: props.user,
            bandName: 'Banda',

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,
        }
    }

    componentDidMount() {
        this.setState({isLoading: true})
        BandService.FIND_BAND_BY_UUID(this.state.bandUuid)
            .then(
                response => {
                    //band
                    let band = new BandProfileDto(response.data)
                    this.setState({band, bandName: band.name})
                }
            ).catch(error => {
            this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
        }).finally(() => this.setState({isLoading: false}))
    }

    render() {
        let {bandName} = this.state
        return (
            <HomeTemplate steps={['Serviços', 'Bandas', bandName]}>
                {this.renderProfile()}
            </HomeTemplate>
        );
    }

    renderProfile() {
        let {isLoading, band} = this.state
        if (isLoading || !band.uuid) {
            return (<ActivityIndicatorComponent/>)
        }
        return (
            <Card>
                <Container>
                    <Row>
                        <Col/>
                        <Col>
                            <Row>
                                <Col style={STYLE_ALIGN_ITEM_CENTER}>
                                    {
                                        !!!band.profilePictureUuid
                                            ? (<Avatar label={band.name[0]} size="xlarge"/>)
                                            : (
                                                <Image
                                                    src={FileService.GET_IMAGE_URL(band.profilePictureUuid)}
                                                    alt={`Imagem da banda ${band.name}`}
                                                    width="250"
                                                    height="250"
                                                />
                                            )
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <h3 align="center">{band.name}</h3>
                                </Col>
                            </Row>
                        </Col>
                        <Col/>
                    </Row>
                    <hr/>
                    {this.renderOwnerButtons()}
                    <Row>
                        <Col>
                            <TabView activeIndex={0}>
                                <TabPanel header="Sobre nós">
                                    {band.description}
                                </TabPanel>
                                <TabPanel header="Eventos">
                                    Eventos
                                </TabPanel>
                                <TabPanel header="Integrantes">
                                    {this.renderMusicians()}
                                </TabPanel>
                            </TabView>
                        </Col>
                    </Row>
                    <hr/>
                </Container>
            </Card>
        );
    }

    renderOwnerButtons(){
        let {band, user} = this.state;
        if (!user || (user.uuid !== band.ownerUuid)) {
            return (<p>{user?1:2}</p>);
        }
        return(
            <Row>
                <Col>
                    <Button
                        label="Editar"
                        icon="pi pi-pencil"
                        style={StyleConstants.WIDTH_100_PERCENT}
                        className="p-button-warning"
                    />
                </Col>
                <Col>
                    <Button
                        label="Desativar"
                        icon="pi pi-trash"
                        style={StyleConstants.WIDTH_100_PERCENT}
                        className="p-button-danger"
                    />
                </Col>
            </Row>
        )
    }

    renderMusicians() {
        let {band} = this.state

        let cols = band.musicians.map(
            musician => (
                <Col lg={3} md={6} sm={12} style={MarginStyle.makeMargin(0, 5, 0, 5)}>
                    <Card>
                        <Container>
                            <Row>
                                <Col style={STYLE_ALIGN_ITEM_CENTER}>
                                    {
                                        !!!musician.profilePictureUuid
                                            ? (<Avatar label={musician.firstName[0]} size="large"/>)
                                            : (
                                                <Image
                                                    src={FileService.GET_IMAGE_URL(band.profilePictureUuid)}
                                                    alt={`Imagem do integrante ${musician.name}`}
                                                    width="100"
                                                    height="100"
                                                />
                                            )
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12} style={STYLE_ALIGN_ITEM_CENTER}>
                                    <h5>{`${musician.firstName} ${musician.lastName[0]}.`}</h5>
                                </Col>
                                <Col md={12} style={STYLE_ALIGN_ITEM_CENTER}>
                                    <h6>{`${musician.age} anos`}</h6>
                                </Col>
                            </Row>
                        </Container>
                    </Card>
                </Col>
            )
        )

        return (
            <Container>
                <Row>
                    {cols}
                </Row>
            </Container>
        )
    }
}

const STYLE_ALIGN_ITEM_CENTER = {display: 'flex', alignItems: 'center', justifyContent: 'center'};

const myMapDispatchToProps = {
    updateToken: updateToken,
    updateUser: updateUser,
};
const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps, myMapDispatchToProps)(BandProfilePage);
