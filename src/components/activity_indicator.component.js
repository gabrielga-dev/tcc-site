import {Col, Container, Row} from "react-bootstrap";
import {Dots} from "react-activity";

export const ActivityIndicatorComponent = () => (
    <Container>
        <Row>
            <Col>
                <div align="center">
                    <Dots/>
                </div>
            </Col>
        </Row>
    </Container>
)