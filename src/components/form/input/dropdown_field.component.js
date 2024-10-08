import React from "react";
import {Dropdown} from "primereact/dropdown";

export const DropDownFieldComponent = (
    {
        label = 'DROPDOWN',
        placeHolder = 'DROPDOWN_PLACEHOLDER',
        value,
        options = [],
        onChange = (value) => {
            console.log(value)
        },
        optionLabel = 'name',
        disabled = false,
        optional = false
    }
) => (
    <>
        <h6 className='input-field-label'>{label}{!optional ? '*' : ''}</h6>
        <Dropdown
            className="input-field"
            optionLabel={optionLabel}
            placeholder={placeHolder}
            emptyFilterMessage="Nenhum dado encontrado 😢"
            emptyMessage="Nenhum dado encontrado 😢"
            value={value}
            options={options}
            disabled={disabled}
            onChange={(e) => onChange(e.value)}
        />
    </>
);
