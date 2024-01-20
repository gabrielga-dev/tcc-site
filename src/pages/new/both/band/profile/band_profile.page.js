import React, {useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import {connect} from "react-redux";
import HomeTemplate from "../../../template/home_template";
import {BandService} from "../../../../../service/new/band.service";
import {ToastUtils} from "../../../../../util/toast.utils";
import {BandProfileResponse} from "../../../../../domain/new/band/response/band_profile.response";
import {ActivityIndicatorComponent} from "../../../../../components/activity_indicator.component";
import {Card} from "primereact/card";
import {Col, Container, Row} from "react-bootstrap";
import {Avatar} from "primereact/avatar";
import {Image} from "primereact/image";
import {FileService} from "../../../../../service/new/file.service";
import {Divider} from "primereact/divider";
import {Button} from "primereact/button";
import {StyleConstants} from "../../../../../service/style.constants";
import {ContactType} from "../../../../../domain/new/enum/contact_type.enum";
import {MarginStyle} from "../../../../../style/margin.style";
import {Tag} from "primereact/tag";
import {RoleEnum} from "../../../../../domain/new/enum/role.enum";

const BandProfilePage = ({token, user}) => {
    const toast = useRef(null);
    const {uuid} = useParams();

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
            <_BandProfilePage
                token={token}
                authenticatedUser={user}
                navigateTo={redirectTo}
                showToast={showToast}
                bandUuid={uuid}
            />
        </>
    );
}


class _BandProfilePage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,

            token: props.token,
            authenticatedUser: props.authenticatedUser,

            navigateTo: props.navigateTo,
            showToast: props.showToast,

            bandUuid: this.props.bandUuid,
            bandProfile: null,
        }
    }

    componentDidMount() {
        let {bandUuid, token, showToast, navigateTo} = this.state;
        BandService.FIND_PROFILE(bandUuid, token)
            .then(
                response => {
                    this.setState({bandProfile: new BandProfileResponse(response.data)})
                }
            ).catch(
            error => {
                showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
                setTimeout(() => navigateTo('/'), 1500)
            }
        ).finally(() => this.setState({isLoading: false}));
    }

    render() {
        if (this.state.isLoading) {
            return (<ActivityIndicatorComponent/>);
        }
        let {bandProfile, authenticatedUser} = this.state;
        return (
            <HomeTemplate steps={['Home', 'Bandas', this.state.bandProfile?.name]}>
                <Card>
                    <Container>
                        <Row>
                            <Col/>
                            <Col>
                                <Row>
                                    <Col style={STYLE_ALIGN_ITEM_CENTER}>
                                        {
                                            !!!bandProfile.profilePictureUuid
                                                ? (<Avatar label={bandProfile.name[0]} size="xlarge"/>)
                                                : (
                                                    <Image
                                                        src={FileService.GET_IMAGE_URL(bandProfile.profilePictureUuid)}
                                                        alt={`Imagem da banda ${bandProfile.name}`}
                                                        width="250"
                                                        height="250"
                                                        imageStyle={{borderRadius: 180}}
                                                    />
                                                )
                                        }
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <h3 align="center">{bandProfile.name}</h3>
                                    </Col>
                                </Row>
                            </Col>
                            <Col/>
                        </Row>
                        <Row>
                            <Col>
                                <p style={{textAlign: 'justify'}}>{bandProfile.description}</p>
                            </Col>
                        </Row>
                        {
                            authenticatedUser.roles.some(role => (role.name === RoleEnum.CONTRACTOR))
                                ? (
                                    <Row>
                                        <Col sm={12} md={8}/>
                                        <Col sm={12} md={4}>
                                            <Button
                                                label="Solicitar orçamento"
                                                style={StyleConstants.WIDTH_100_PERCENT}
                                                icon="pi pi-dollar"
                                                className="p-button-success"
                                            />
                                        </Col>
                                    </Row>
                                ) : (<></>)
                        }
                        <Divider align="center">
                            <span>Músicos</span>
                        </Divider>
                        <Row>
                            {this.renderMusicians()}
                        </Row>
                        {this.renderContacts()}
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

        let cols = bandProfile.musicians.map(
            musician => (
                <Col key={musician.uuid} lg={3} md={6} sm={12} style={MarginStyle.makeMargin(0, 5, 0, 5)}>
                    <Card>
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
                                    musician.types.map(
                                        type => (
                                            <Col md={6} style={{marginTop: 5}}>
                                                <Tag
                                                    style={StyleConstants.WIDTH_100_PERCENT}
                                                    value={type.name}
                                                    rounded
                                                />
                                            </Col>
                                        )
                                    )
                                }
                            </Row>
                        </Container>
                    </Card>
                </Col>
            )
        )

        return (
            <Col>
                {cols}
            </Col>
        );
    }

    renderContacts() {
        let {bandProfile} = this.state;
        const contacts = bandProfile.contacts.map(
            contact => (
                <Avatar
                    icon={ContactType[contact.type].ICON}
                    key={contact.uuid}
                    className="mr-2"
                    size="large"
                    shape="circle"
                    onClick={
                        () => ContactType[contact.type].OPEN(contact.content)
                    }
                />
            )
        );
        if (contacts.length === 0)
            return (<></>);
        return (
            <>
                <Divider align="center">
                    <span>Contatos</span>
                </Divider>
                <Row>
                    <Col style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
                        {contacts}
                    </Col>
                </Row>
            </>
        );
    }
}

const STYLE_ALIGN_ITEM_CENTER = {display: 'flex', alignItems: 'center', justifyContent: 'center'};

const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(BandProfilePage);
