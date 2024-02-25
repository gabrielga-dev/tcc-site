import React, {useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import {connect} from "react-redux";
import {BandService} from "../../../../service/new/band.service";
import {BandProfileDto} from "../../../../domain/new/dto/band/band_profile.dto";
import {ToastUtils} from "../../../../util/toast.utils";
import HomeTemplate from "../../../template/home_template";
import {Card} from "primereact/card";
import {Col, Container, Row} from "react-bootstrap";
import {ActivityIndicatorComponent} from "../../../../components/activity_indicator.component";
import {Button} from "primereact/button";
import {StyleConstants} from "../../../../service/style.constants";
import {MarginStyle} from "../../../../style/margin.style";
import {Avatar} from "primereact/avatar";
import {Image} from "primereact/image";
import {FileService} from "../../../../service/new/file.service";
import {Tag} from "primereact/tag";
import {Divider} from "primereact/divider";

const AdministrateBandMusicians = ({token, user}) => {
    const toast = useRef(null);
    let {band_uuid} = useParams();
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
            <_AdministrateBandMusicians
                token={token}
                authenticatedUser={user}
                navigateTo={redirectTo}
                showToast={showToast}
                bandUuid={band_uuid}
            />
        </>
    );
}

class _AdministrateBandMusicians extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bandUuid: props.bandUuid,
            isLoading: true,
            token: props.token,
            authenticatedUser: props.authenticatedUser,
            navigateTo: props.navigateTo,
            showToast: props.showToast,

            bandProfile: new BandProfileDto(),
        }
    }

    componentDidMount() {
        let {bandUuid, token} = this.state;
        BandService.FIND_PROFILE(bandUuid, token)
            .then(response => {
                const profile = new BandProfileDto(response.data);
                this.setState({bandProfile: profile});
            }).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isLoading: false}))
    }

    render() {
        if (this.state.isLoading) {
            return (<ActivityIndicatorComponent/>);
        }
        let {navigateTo} = this.state;
        return (
            <HomeTemplate steps={['Home', 'Bandas', this.state.bandProfile?.name, 'Gerenciar Músicos']}>
                <Card>
                    <Container>
                        <Row>
                            <Col md={4} sm={0}/>
                            <Col md={4} sm={12}>
                                <Button
                                    label="Cadastrar músico"
                                    className="p-button-success"
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    icon="pi pi-plus"
                                    onClick={() => navigateTo("criar")}
                                />
                            </Col>
                            <Col md={4} sm={12}>
                                <Button
                                    label="Vincular músico já cadastrado"
                                    className="info"
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    icon="pi pi-plus"
                                    onClick={() => navigateTo("vincular")}
                                />
                            </Col>
                        </Row>
                        <Divider align="center"><span>Músicos</span></Divider>
                        <Row>
                            <Col>
                                {this.renderMusicians()}
                            </Col>
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    renderMusicians() {
        let {bandProfile} = this.state;

        if (bandProfile.musicians.length === 0)
            return (
                <Col>
                    <h5 align="center">Nenhum músico vinculado à essa banda! 😢</h5>
                </Col>
            );

        let {navigateTo} = this.state

        let cols = bandProfile.musicians.map(
            musician => (
                <Col key={musician.uuid} xl={3} lg={4} md={6} sm={12} style={MarginStyle.makeMargin(0, 5, 0, 5)}>
                    <Card key={musician.uuid}>
                        <Container>
                            <Row>
                                <Col style={STYLE_ALIGN_ITEM_CENTER}>
                                    {
                                        !!!musician.avatarUuid
                                            ? (<Avatar label={musician.firstName[0]} size=" large"/>)
                                            : (
                                                <Image
                                                    src={FileService.GET_IMAGE_URL(musician.avatarUuid)}
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
                                    <h5>{`${musician.firstName} ${musician.lastName}`}</h5>
                                </Col>
                                <Col md={12} style={STYLE_ALIGN_ITEM_CENTER}>
                                    <h6>{`${musician.age} anos`}</h6>
                                </Col>
                            </Row>
                            <Row>
                                {
                                    musician.types
                                        ? musician.types.map(
                                            type => (
                                                <Col key={`${musician.uuid}_${type.uuid}`} md={6} style={{marginTop: 5}}>
                                                    <Tag
                                                        style={StyleConstants.WIDTH_100_PERCENT}
                                                        value={type.name}
                                                        rounded
                                                    />
                                                </Col>
                                            )
                                        ) : []
                                }
                            </Row>
                            <Divider/>
                            <Row style={{marginTop: 5}}>
                                <Col md={6} sm={12} style={{marginBottom: 5}}>
                                    <Button
                                        className="p-button-danger"
                                        icon="pi pi-times"
                                        style={StyleConstants.WIDTH_100_PERCENT}
                                    />
                                </Col>
                                <Col md={6} sm={12} style={{marginBottom: 5}}>
                                    <Button
                                        className="p-button-warning"
                                        icon="pi pi-pencil"
                                        style={StyleConstants.WIDTH_100_PERCENT}
                                        onClick={() => navigateTo(`${musician.uuid}/editar`)}
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </Card>
                </Col>
            )
        )

        return (
            <Col>
                <Container>
                    <Row>
                        {cols}
                    </Row>
                </Container>
            </Col>
        );
    }
}

const STYLE_ALIGN_ITEM_CENTER = {display: 'flex', alignItems: 'center', justifyContent: 'center'};

const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(AdministrateBandMusicians);
