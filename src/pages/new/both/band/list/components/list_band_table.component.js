import {Col, Container, Row} from "react-bootstrap";
import {ActivityIndicatorComponent} from "../../../../../../components/activity_indicator.component";
import {Card} from "primereact/card";
import {FileService} from "../../../../../../service/new/file.service";
import {Button} from "primereact/button";
import {StyleConstants} from "../../../../../../service/style.constants";

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
    <Col md={4} sm={12} key={band.uuid}>
        <Card
            title={band.name}
            subTitle={`${band.address.city}, ${band.address.state}`}
            header={generateBandCardHeader(band.profilePictureUuid)}
            footer={generateBandCardFooter(band.uuid, navigateTo)}
        >
            <p>{band.description}</p>
        </Card>
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

const generateBandCardFooter = (bandUuid, navigateTo) => (
    <Button
        style={StyleConstants.WIDTH_100_PERCENT}
        label="Ver perfil"
        icon="pi pi-user"
        className="p-button-sm"
        onClick={() => navigateTo(`/servicos/bandas/${bandUuid}`)}
    />
);
