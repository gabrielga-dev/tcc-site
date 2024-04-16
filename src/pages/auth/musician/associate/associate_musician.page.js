import React, {useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import {ActivityIndicatorComponent} from "../../../../components/activity_indicator.component";
import HomeTemplate from "../../../template/home_template";
import {Card} from "primereact/card";
import {Col, Container, Row} from "react-bootstrap";
import {BandService} from "../../../../service/new/band.service";
import {ToastUtils} from "../../../../util/toast.utils";
import {connect} from "react-redux";
import {TextMaskFieldComponent} from "../../../../components/form/input/text_mask_field.component";
import {Button} from "primereact/button";
import {StyleConstants} from "../../../../service/style.constants";
import {MusicianResponse} from "../../../../domain/new/musician/response/musician.response";
import {MusicianService} from "../../../../service/new/musician.service";
import {Divider} from "primereact/divider";
import {FileService} from "../../../../service/new/file.service";
import {Tag} from "primereact/tag";

import './associate_musician.style.css';

const AssociateMusicianPage = ({token, user}) => {
    const toast = useRef(null);
    let {band_uuid, cpf} = useParams();
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
            <_AssociateMusicianPage
                token={token}
                authenticatedUser={user}
                navigateTo={redirectTo}
                showToast={showToast}
                bandUuid={band_uuid}
                cpf={cpf}
            />
        </>
    );
}

class _AssociateMusicianPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bandUuid: props.bandUuid,
            masterLoading: true,
            isLoading: true,
            token: props.token,
            authenticatedUser: props.authenticatedUser,
            navigateTo: props.navigateTo,
            showToast: props.showToast,

            cpf: this.props.cpf ? this.props.cpf : '008.548.970-03',
            bandName: '',
            searched: false,
            foundMusician: new MusicianResponse(),
        }
    }

    componentDidMount() {
        let {bandUuid, token} = this.state;
        BandService.FIND_PROFILE(bandUuid, token)
            .then(response => {
                this.setState({bandName: response.data.name});
            }).catch(error => this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error)))
            .finally(() => this.setState({isLoading: false, masterLoading: false}))
    }

    render() {
        if (this.state.masterLoading) {
            return (<ActivityIndicatorComponent/>);
        }
        let {cpf, isLoading} = this.state;
        return (
            <HomeTemplate steps={['Home', 'Bandas', this.state.bandName, 'Gerenciar Músicos', 'Vincular Músico']}>
                <Card className='main-card'>
                    <Container>
                        <Row>
                            <Col>
                                <TextMaskFieldComponent
                                    label="CPF"
                                    value={cpf}
                                    onChange={(newCpf) => {
                                        if (newCpf) {
                                            this.setState({cpf: newCpf})
                                        }
                                    }}
                                    placeHolder="Digite o CPF do músico aqui!"
                                    mask="999.999.999-99"
                                    disabled={isLoading}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={8} sm={0}/>
                            <Col>
                                <Button
                                    style={StyleConstants.WIDTH_100_PERCENT}
                                    label="Pesquisar"
                                    className="p-button-info"
                                    icon="pi pi-search"
                                    onClick={() => this.searchMusician()}
                                    disabled={isLoading}
                                />
                            </Col>
                        </Row>
                        <Divider align='center'><span>Resultado</span></Divider>
                        <Row>
                            {this.renderSearchResult()}
                        </Row>
                    </Container>
                </Card>
            </HomeTemplate>
        );
    }

    renderSearchResult() {
        if (this.state.isLoading) {
            return (<ActivityIndicatorComponent/>);
        }
        let {searched, foundMusician} = this.state;

        if (!searched) {
            return (
                <Col>
                    <h6 align='center'>Pesquise por um músico! 🤩</h6>
                </Col>
            )
        }

        if (!foundMusician.uuid) {
            return (
                <Col>
                    <h6 align='center'>Nenhum músico encontrado com esse cpf! 😢</h6>
                </Col>
            )
        }
        return (
            <>
                <Col />
                {this.renderMusician()}
                <Col />
            </>
        );
    }

    renderMusician() {
        let {foundMusician} = this.state;
        return (
            <Col
                xl={2} lg={3} md={4} sm={12}
                className={foundMusician.active ? 'musician-musician-card-active' : 'musician-card-non-active'}
            >
                <div
                    className='musician-img-container'
                >
                    <img
                        className='musician-img'
                        src={
                            !!foundMusician.avatarUuid
                                ? FileService.GET_IMAGE_URL(foundMusician.avatarUuid)
                                : '/images/musician_default_icon.png'
                        }
                        alt={`Imagem do integrante ${foundMusician.name}`}
                    />
                </div>
                <p className='musician-name'>{foundMusician.firstName}</p>
                <p className='musician-age'>{`${foundMusician.age} anos`}</p>
                <div className='musician-type-container'>
                    {
                        foundMusician.types
                            ? foundMusician.types.map(
                                type => (
                                    <Tag
                                        key={`${foundMusician.uuid}-${type.name}`}
                                        value={type.name}
                                        rounded
                                    />
                                )
                            ) : []
                    }
                </div>
                <Button
                    label="Vincular"
                    className="p-button-success assoc-button"
                    icon="pi pi-plus"
                    onClick={() => this.associateMusician()}
                />
            </Col>
        );
    }

    associateMusician() {
        this.setState({isLoading: true});
        let {bandUuid, cpf, token, showToast, navigateTo} = this.state;
        MusicianService.ASSOCIATE(bandUuid, cpf, token)
            .then(
                () => {
                    showToast(ToastUtils.BUILD_TOAST_SUCCESS_BODY('Músico vinculado com sucesso!'))
                    setTimeout(() => navigateTo(`/bandas/${bandUuid}/gerenciar-musicos`), 2500);
                }
            ).catch(
            error => {
                this.setState({isLoading: false})
                this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error));
            }
        )
    }

    searchMusician() {
        this.setState({isLoading: true});

        MusicianService.FIND_BY_CPF(this.state.cpf, this.state.token)
            .then(
                response => {
                    let musician = new MusicianResponse(response.data);
                    this.setState({foundMusician: musician});
                }
            ).catch(
            error => {
                this.setState({foundMusician: new MusicianResponse()});
                this.state.showToast(ToastUtils.BUILD_TOAST_ERROR_BODY(error))
            }
        ).finally(() => this.setState({isLoading: false, searched: true}))
    }
}


const mapStateToProps = state => {
    return state
};
export default connect(mapStateToProps)(AssociateMusicianPage);
