import React from "react";
import {Password} from "primereact/password";

export const PasswordFieldComponent = (
    {
        disabled = false,
        label = 'INPUT_PASSWORD',
        placeHolder = 'PLACE_HOLDER',
        value,
        maxLength = 75,
        minLength = 3,
        onChange = (value) => {
            console.log(value)
        },
        optional = false,
        tooltip = null,
        toggleMask = false,
        feedback = false
    }
) => (
    <>
        <h6 className='input-field-label'>{label}{!optional ? '*' : ''}</h6>
        <Password
            className="p-inputtext-sm input-field"
            disabled={disabled}
            placeholder={placeHolder}
            value={value}
            maxLength={maxLength}
            minLength={minLength}
            onChange={(e) => onChange(e.target.value)}
            tooltip={tooltip}
            toggleMask={toggleMask}
            feedback={feedback}
        />
    </>
);
