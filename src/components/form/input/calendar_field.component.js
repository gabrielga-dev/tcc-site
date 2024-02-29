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
        optional = false,
        dateFormat="dd/mm/yy",
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
            dateFormat={dateFormat}
            style={StyleConstants.WIDTH_100_PERCENT}
            onChange={(e) => {
                console.log(e.value)
                onChange(e.value)
            }}
        />
    </>
);
