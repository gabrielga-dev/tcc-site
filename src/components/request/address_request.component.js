import React from "react";
import {InputText} from "primereact/inputtext";
import {Col} from "react-bootstrap";

export const AddressRequestComponent = (

) => (
    <>
        <Col md={6} sm={12} style={FIELD_MARGIN}>
            <h6>Nome</h6>
            <InputText
                id="firstName"
                value={firstName}
                maxLength={30}
                onChange={(e) => this.setField('firstName', e.target.value)}
            />
        </Col>
    </>
);

const FIELD_MARGIN = {marginBottom: 10}
