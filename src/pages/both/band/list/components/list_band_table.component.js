import {Col, Container, Row} from "react-bootstrap";
import {ActivityIndicatorComponent} from "../../../../../components/activity_indicator.component";
import {FileService} from "../../../../../service/new/file.service";
import {StyleConstants} from "../../../../../service/style.constants";
import {ColorConstants} from "../../../../../style/color.constants";
import './list_band_table_style.css';

export const ListBandTableComponent = ({bands, navigateTo, isLoading}) => {
    if (isLoading) {
        return (<ActivityIndicatorComponent/>)
    }
    if (bands.length === 0) {
        return (<h4 align="center">Nenhuma banda encontrada 😢</h4>);
    }
    return (
        <Container>
            <Row>
                {bands?.map(band => (generateBandCard(band, navigateTo)))}
            </Row>
        </Container>
    );
};


const generateBandCard = (band, navigateTo) => (
    <Col md={3} sm={12} key={band.uuid}>
        <div
            className="band-card"
            key={band.uuid}
            onClick={() => navigateTo(`/servicos/bandas/${band.uuid}`)}
        >
            {generateBandCardHeader(band.profilePictureUuid)}
            <p
                style={
                    {
                        marginBottom: 0,
                        color: ColorConstants.TEXT_COLOR_MAIN,
                        fontSize: 18
                    }
                }
            >
                <b>{band.name}</b>
            </p>
            <p
                style={
                    {
                        marginBottom: 0,
                        color: ColorConstants.TEXT_COLOR_MAIN,
                        fontSize: 12
                    }
                }
            >
                {`${band.address.city}, ${band.address.state}`}
            </p>
        </div>
    </Col>
);

const generateBandCardHeader = (profilePictureUuid) => (
    <div style={{width: '100%', textAlign: 'center'}}>
        <img
            style={StyleConstants.IMAGE_STYLE}
            alt="Card"
            src={
                (!profilePictureUuid)
                    ? 'images/band_default_icon.png'
                    : FileService.GET_IMAGE_URL(profilePictureUuid)
            }
            onError={(e) => e.target.src = 'images/band_default_icon.png'}
        />
    </div>
);
