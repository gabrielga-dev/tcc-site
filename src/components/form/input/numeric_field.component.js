import React from "react";
import {InputNumber} from "primereact/inputnumber";

export const NumericFieldComponent = (
    {
        label = 'INPUT_NUMBER',
        placeHolder = 'PLACE_HOLDER',
        value,
        maxLength = 75,
        minLength = 3,
        onChange = (value) => {
            console.log(value)
        },
        optional = false
    }
) => (
    <>
        <h6 className='input-field-label'>{label}{!optional ? '*' : ''}</h6>
        <InputNumber
            className="p-inputnumber-input"
            placeholder={placeHolder}
            value={value}
            maxLength={maxLength}
            minLength={minLength}
            onChange={(e) => onChange(e.value)}
        />
    </>
);
