import {StyleConstants} from "../../../service/style.constants";
import React from "react";
import {Calendar} from "primereact/calendar";

export const CalendarFieldComponent = (
    {
        disabled = false,
        label = 'INPUT_TEXT',
        placeHolder = 'PLACE_HOLDER',
        value,
        minDate = new Date(),
        maxDate = new Date(),
        onChange = (value) => {
            console.log(value)
        },
        optional = false
    }
) => (
    <>
        <h6>{label}{!optional ? '*' : ''}</h6>
        <Calendar
            disabled={disabled}
            placeholder={placeHolder}
            value={value}
            maxDate={maxDate}
            minDate={minDate}
            dateFormat="dd/mm/yy"
            style={StyleConstants.WIDTH_100_PERCENT}
            onChange={(e) => onChange(e.value)}
        />
    </>
);
