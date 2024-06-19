import React, {useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import {connect} from "react-redux";
import HomeTemplate from "../../../template/home_template";
import {BandService} from "../../../../service/new/band.service";
import {ToastUtils} from "../../../../util/toast.utils";
import {BandProfileResponse} from "../../../../domain/new/band/response/band_profile.response";
import {ActivityIndicatorComponent} from "../../../../components/activity_indicator.component";
import {Card} from "primereact/card";
import {Col, Container, Row} from "react-bootstrap";
import {Avatar} from "primereact/avatar";
import {FileService} from "../../../../service/new/file.service";
import {Divider} from "primereact/divider";
import {Button} from "primereact/button";
import {StyleConstants} from "../../../../service/style.constants";
import {ContactType} from "../../../../domain/new/enum/contact_type.enum";
import {Tag} from "primereact/tag";
import {RoleEnum} from "../../../../domain/new/enum/role.enum";
import './band_profile_style.css';
import '../../../../App.css';

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
        let {bandProfile, authenticatedUser, navigateTo} = this.state;
        return (
            <HomeTemplate steps={['Home', 'Bandas', this.state.bandProfile?.name]}>
                <Card className='main-card'>
                    <Container>
                        <Row>
                            <div className='wrapper'>
                                <div className='left-image'>
                                    <img
                                        src={
                                            !!!bandProfile.profilePictureUuid
                                                ? '/images/band_default_icon.png'
                                                : FileService.GET_IMAGE_URL(bandProfile.profilePictureUuid)
                                        }
                                        alt={`Imagem da banda ${bandProfile.name}`}
                                        width="250"
                                        height="250"
                                    />
                                </div>
                                <div className='banner'>
                                    <img
                                        src={
                                            !!!bandProfile.profilePictureUuid
                                                ? '/images/band_default_icon.png'
                                                : FileService.GET_IMAGE_URL(bandProfile.profilePictureUuid)
                                        }
                                        alt={`Imagem da banda ${bandProfile.name}`}
                                    />
                                </div>
                                <h2 align='center' className='band-name'>{bandProfile.name}</h2>
                                <h6 align='center' className='band-location'>
                                    <i className='pi pi-map-marker location-icon'/>
                                    {bandProfile.address.city}, {bandProfile.address.state}
                                </h6>
                            </div>
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
                                                onClick={
                                                    () => navigateTo(`/band/${this.state.bandUuid}/pedir-orcamento`)
                                                }
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
                <Col
                    key={musician.uuid}
                    xl={2} lg={3} md={4} sm={12}
                    className={musician.active ? 'musician-musician-card-active' : 'musician-card-non-active'}
                >
                    <div
                        className='musician-img-container'
                    >
                        <img
                            className='musician-img'
                            src={
                                !!musician.avatarUuid
                                    ? FileService.GET_IMAGE_URL(musician.avatarUuid)
                                    : '/images/musician_default_icon.png'
                            }
                            alt={`Imagem do integrante ${musician.name}`}
                        />
                    </div>
                    <p className='musician-name'>{musician.firstName}</p>
                    <p className='musician-age'>{`${musician.age} anos`}</p>
                    <div className='musician-type-container'>
                        {
                            musician.types
                                ? musician.types.map(
                                    type => (
                                        <Tag
                                            key={`${musician.uuid}-${type.name}`}
                                            value={type.name}
                                            rounded
                                        />
                                    )
                                ) : []
                        }
                    </div>
                </Col>
                // <Col key={musician.uuid} xl={3} lg={4} md={6} sm={12} style={MarginStyle.makeMargin(0, 5, 0, 5)}>
                //     <Card>
                //         <Container>
                //             <Row>
                //                 <Col style={STYLE_ALIGN_ITEM_CENTER}>
                //                     {
                //                         !!!musician.avatarUuid
                //                             ? (<Avatar label={musician.firstName[0]} size=" large"/>)
                //                             : (
                //                                 <Image
                //                                     src={FileService.GET_IMAGE_URL(musician.avatarUuid)}
                //                                     alt={`Imagem do integrante ${musician.name}`}
                //                                     width="100"
                //                                     height="100"
                //                                 />
                //                             )
                //                     }
                //                 </Col>
                //             </Row>
                //             <Row>
                //                 <Col md={12} style={STYLE_ALIGN_ITEM_CENTER}>
                //                     <h5>{`${musician.firstName} ${musician.lastName}`}</h5>
                //                 </Col>
                //                 <Col md={12} style={STYLE_ALIGN_ITEM_CENTER}>
                //                     <h6>{`${musician.age} anos`}</h6>
                //                 </Col>
                //             </Row>
                //             <Row>
                //                 {
                //                     musician.types.map(
                //                         type => (
                //                             <Col md={6} style={{marginTop: 5}}>
                //                                 <Tag
                //                                     style={StyleConstants.WIDTH_100_PERCENT}
                //                                     value={type.name}
                //                                     rounded
                //                                 />
                //                             </Col>
                //                         )
                //                     )
                //                 }
                //             </Row>
                //         </Container>
                //     </Card>
                // </Col>
            )
        )

        return (
            <Row>
                {cols}
            </Row>
        );
    }

    renderContacts() {
        let {bandProfile} = this.state;
        const contacts = bandProfile.contacts.map(
            contact => (
                <Avatar
                    icon={ContactType[contact.type].ICON}
                    key={contact.uuid}
                    className="mr-2 band-contact"
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

const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(BandProfilePage);
