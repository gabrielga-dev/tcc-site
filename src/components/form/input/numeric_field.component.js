import React from "react";
import {InputNumber} from "primereact/inputnumber";

export const NumericFieldComponent = (
    {
        className = '',
        disabled = false,
        label = 'INPUT_NUMBER',
        placeHolder = 'PLACE_HOLDER',
        value,
        maxLength = 75,
        minLength = 3,
        min= null,
        onChange = (value) => {
            console.log(value)
        },
        onBlur = ()  => {
            console.log('blur')
        },
        optional = false
    }
) => (
    <>
        <h6 className='input-field-label'>{label}{!optional ? '*' : ''}</h6>
        <InputNumber
            disabled={disabled}
            className={`p-inputnumber-input ${className}`}
            placeholder={placeHolder}
            value={value}
            maxLength={maxLength}
            minLength={minLength}
            min={min}
            onChange={(e) => onChange(e.value)}
            onBlur={() => onBlur()}
        />
    </>
);
