import {InputText} from "primereact/inputtext";
import {StyleConstants} from "../../../service/style.constants";
import React from "react";

export const TextFieldComponent = (
    {
        disabled=false,
        label='INPUT_TEXT',
        placeHolder='PLACE_HOLDER',
        value,
        maxLength=75,
        minLength=3,
        onChange=(value)=>{console.log(value)},
    }
) => (
    <>
        <h6>{label}</h6>
        <InputText
            disabled={disabled}
            placeholder={placeHolder}
            value={value}
            maxLength={maxLength}
            minLength={minLength}
            style={StyleConstants.WIDTH_100_PERCENT}
            onChange={(e) => onChange(e.target.value)}
        />
    </>
);
