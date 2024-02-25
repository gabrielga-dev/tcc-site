import {StyleConstants} from "../../../service/style.constants";
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
        disabled=false
    }
) => (
    <>
        <h6>{label}{!optional ? '*' : ''}</h6>
        <InputMask
            placeholder={placeHolder}
            value={value}
            mask={mask}
            style={StyleConstants.WIDTH_100_PERCENT}
            onChange={(e) => onChange(e.value)}
            disabled={disabled}
        />
    </>
);
