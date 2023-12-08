import {StyleConstants} from "../../../service/style.constants";
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
        }
    }
) => (
    <>
        <h6>{label}</h6>
        <InputNumber
            placeholder={placeHolder}
            value={value}
            maxLength={maxLength}
            minLength={minLength}
            style={StyleConstants.WIDTH_100_PERCENT}
            onChange={(e) => onChange(e.value)}
        />
    </>
);
