import React from "react";
import {InputMask} from "primereact/inputmask";

export const TextMaskFieldComponent = (
    {
        label = 'INPUT_TEXT',
        placeHolder = 'PLACE_HOLDER',
        value,
        mask = '',
        onChange = (value) => {
            console.log(value)
        },
        optional = false,
        disabled = false
    }
) => (
    <>
        <h6 className='input-field-label'>{label}{!optional ? '*' : ''}</h6>
        <InputMask
            className="input-field"
            placeholder={placeHolder}
            value={value}
            mask={mask}
            onChange={(e) => {
                if (e.value) {
                    onChange(e.value);
                }
            }}
            disabled={disabled}
        />
    </>
);
