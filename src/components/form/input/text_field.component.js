import {InputText} from "primereact/inputtext";
import React from "react";

export const TextFieldComponent = (
    {
        disabled = false,
        label = 'INPUT_TEXT',
        placeHolder = 'PLACE_HOLDER',
        value,
        maxLength = 75,
        minLength = 3,
        onChange = (value) => {
            console.log(value)
        },
        optional = false,
        tooltip = null
    }
) => (
    <>
        <h6 className='input-field-label'>{label}{!optional ? '*' : ''}</h6>
        <InputText
            className="p-inputtext-sm input-field"
            disabled={disabled}
            placeholder={placeHolder}
            value={value}
            maxLength={maxLength}
            minLength={minLength}
            onChange={(e) => onChange(e.target.value)}
            tooltip={tooltip}
        />
    </>
);
