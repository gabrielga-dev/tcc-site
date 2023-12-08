import {StyleConstants} from "../../../service/style.constants";
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
    }
) => (
    <>
        <h6>{label}</h6>
        <Dropdown
            style={StyleConstants.WIDTH_100_PERCENT}
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
