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
        dateFormat = "dd/mm/yy",
        showTime = true,
    }
) => (
    <>
        <h6 className='input-field-label'>{label}{!optional ? '*' : ''}</h6>
        <Calendar
            showTime={showTime}
            className="input-field"
            disabled={disabled}
            placeholder={placeHolder}
            value={value}
            maxDate={maxDate}
            minDate={minDate}
            dateFormat={dateFormat}
            onChange={(e) => {
                onChange(e.value)
            }}
        />
    </>
);
