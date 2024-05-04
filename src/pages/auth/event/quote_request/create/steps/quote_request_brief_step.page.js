import {Col, Container, Row} from "react-bootstrap";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import React from "react";
import {TextAreaComponent} from "../../../../../../components/form/input/text_area.component";

export const QuoteRequestBriefStepPage = ({quoteRequest, currentStep, description, updateDescription}) => {
    if (currentStep !== 3) {
        return (<></>)
    }
    return (
        <Container>
            <Row>
                <Col>
                    <h3>Resumo</h3>
                    <h4>Músicas:</h4>
                    <DataTable
                        value={quoteRequest.playlist}
                    >
                        <Column style={{width: '10%'}} field='order' header="#"/>
                        <Column style={{width: '30%'}} field='musicName' header="Nome"/>
                        <Column style={{width: '20%'}} field='musicArtist' header="Artista"/>
                        <Column
                            style={{width: '40%'}}
                            header="Observação"
                            body={
                                (music) => {
                                    if (music.observation) {
                                        return(music.observation);
                                    } else {
                                        return ("N/A");
                                    }
                                }
                            }
                        />
                    </DataTable>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h4>Músicos:</h4>
                    <DataTable
                        value={quoteRequest.musicianTypes}
                    >
                        <Column style={{width: '20%'}} field='musicianTypeName' header="Nome"/>
                        <Column
                            style={{width: '30%'}}
                            header="Quantidade"
                            body={
                                (musicianType) => {
                                    if (!musicianType.quantity || musicianType.quantity < 0) {
                                        return ('Nenhuma quantidade específica');
                                    }
                                    return (musicianType.quantity)
                                }
                            }
                        />
                        <Column
                            style={{width: '30%'}}
                            header="Observação"
                            body={
                                (musicianType) => {
                                    if (!musicianType.observation || musicianType.observation === 0) {
                                        return ('N/A');
                                    }
                                    return(musicianType.observation);
                                }
                            }
                        />
                    </DataTable>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TextAreaComponent
                        optional={true}
                        label='Mensagem adicional'
                        placeHolder='Digite aqui qualquer informação adicional'
                        value={description}
                        maxLength={1000}
                        onChange={newValue => updateDescription(newValue)}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <p><b>Atenção!</b> Uma vez submetido o pedido de orçamento ele não poderá ser alterado!</p>
                </Col>
            </Row>
        </Container>
    );
}
