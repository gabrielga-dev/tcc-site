import {Col, Container, Row} from "react-bootstrap";
import React from "react";
import {Accordion, AccordionTab} from "primereact/accordion";
import {TextFieldComponent} from "../../../components/form/input/text_field.component";
import {CalendarFieldComponent} from "../../../components/form/input/calendar_field.component";
import {DateUtil} from "../../../util/date.util";
import {RadioButton} from "primereact/radiobutton";
import {FormEndingComponent} from "../../../components/form_ending.component";
import {EventCriteria} from "../../../domain/new/event/request/event.criteria";

export const EventCriteriaComponent = (
    {
        isLoading, criteria, setValues = (newCriteria) => {
        console.log(newCriteria)
    }, startDate, setStartDate = (newStartDate) => {
        console.log(newStartDate);
    }, finalDate, setFinalDate = (finalDate) => {
        console.log(finalDate)
    }, ownerUuid, search = () => {
    }
    }
) => {
    return (
        <Accordion activeIndex={null}>
            <AccordionTab header="Filtros">
                <Container>
                    <Row>
                        <Col md={4} sm={12} style={FIELD_MARGIN}>
                            <TextFieldComponent
                                optional={true}
                                disabled={isLoading}
                                maxLength={100}
                                value={criteria.name}
                                label="Nome do evento"
                                placeHolder="Digite aqui o nome do evento"
                                onChange={(newName) => {
                                    criteria.name = newName;
                                    setValues(criteria)
                                }}
                            />
                        </Col>
                        <Col md={4} sm={12} style={FIELD_MARGIN}>
                            <CalendarFieldComponent
                                optional={true}
                                disabled={isLoading}
                                value={startDate}
                                label="Data inicial"
                                placeHolder="Início do período de busca"
                                minDate={null}
                                maxDate={finalDate}
                                onChange={(newStartDate) => {
                                    if (newStartDate > finalDate) {
                                        criteria.finalDate = null;
                                        setFinalDate(null);
                                    }
                                    let newDate = new Date(newStartDate);
                                    criteria.startDate = DateUtil.DATE_TO_EPOCH(newDate);
                                    setValues(criteria);
                                    setStartDate(newDate);
                                }}
                            />
                        </Col>
                        <Col md={4} sm={12} style={FIELD_MARGIN}>
                            <CalendarFieldComponent
                                optional={true}
                                disabled={isLoading}
                                value={finalDate}
                                label="Data final"
                                placeHolder="Final do período de busca"
                                minDate={startDate}
                                maxDate={null}
                                onChange={(newFinalDate) => {
                                    let newDate = new Date(newFinalDate);
                                    criteria.finalDate = DateUtil.DATE_TO_EPOCH(newDate);
                                    setValues(criteria);
                                    setFinalDate(newDate);
                                }}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} sm={12}>
                            <div className="field-radiobutton">
                                <RadioButton
                                    disabled={isLoading}
                                    inputId="eventStatus1"
                                    name="eventStatus"
                                    value={null}
                                    onChange={
                                        (e) => {
                                            criteria.concluded = null;
                                            setValues(criteria);
                                        }
                                    }
                                    checked={criteria.concluded === null}
                                />
                                <label htmlFor="eventStatus1" style={FIELD_MARGIN_RIGHT}>Todos</label>
                                <RadioButton
                                    disabled={isLoading}
                                    inputId="eventStatus2"
                                    name="eventStatus"
                                    value={true}
                                    onChange={
                                        (e) => {
                                            criteria.concluded = true;
                                            setValues(criteria);
                                        }
                                    }
                                    checked={criteria.concluded === true}
                                />
                                <label htmlFor="eventStatus2" style={FIELD_MARGIN_RIGHT}>Concluídos</label>
                                <RadioButton
                                    disabled={isLoading}
                                    inputId="eventStatus3"
                                    name="eventStatus"
                                    value={false}
                                    onChange={
                                        (e) => {
                                            criteria.concluded = false;
                                            setValues(criteria);
                                        }
                                    }
                                    checked={criteria.concluded === false}
                                />
                                <label htmlFor="eventStatus3">Não Concluídos</label>
                            </div>
                        </Col>
                        <Col md={6} sm={12}>
                            <FormEndingComponent
                                showFirst={false}
                                disableSecond={isLoading}
                                disableThird={isLoading}
                                onClickSecond={
                                    () => {
                                        setStartDate(null);
                                        setFinalDate(null);
                                        setValues(new EventCriteria(ownerUuid))
                                    }
                                }
                                onClickThird={() => search()}
                            />
                        </Col>
                    </Row>
                </Container>
            </AccordionTab>
        </Accordion>
    );
}

const FIELD_MARGIN = {marginBottom: 20};
const FIELD_MARGIN_RIGHT = {marginRight: 20};
