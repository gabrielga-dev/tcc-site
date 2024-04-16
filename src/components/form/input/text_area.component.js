import React from "react";
import {InputTextarea} from "primereact/inputtextarea";

export const TextAreaComponent = (
    {
        label = 'INPUT_TEXT',
        placeHolder = 'PLACE_HOLDER',
        value,
        maxLength = 75,
        minLength = 3,
        onChange = (value) => {
            console.log(value)
        },
        optional = false,
        disabled = false
    }
) => (
    <>
        <h6 className='input-field-label'>{label}{!optional ? '*' : ''}</h6>
        <InputTextarea
            className="input-field"
            disabled={disabled}
            placeholder={placeHolder}
            value={value}
            rows={5}
            maxLength={maxLength}
            minLength={minLength}
            style={{width: '100%', resize: 'none'}}
            onChange={(e) => onChange(e.target.value)}
        />
    </>
);
