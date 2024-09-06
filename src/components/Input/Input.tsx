import React, { useState } from "react";
import styles from "./Input.module.scss"

interface IInputProps {
    type?: React.HTMLInputTypeAttribute,
    name?: string | undefined,
    ClassContainer?: string,
    ClassData?: string,
    styleContainer?: React.CSSProperties,
    styleData?: React.CSSProperties,
    placeholder?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    LeftAddon?: React.ReactNode,
    RigthAddon?: React.ReactNode,
    required?: boolean,
    value?: string
}

export const Input: React.FC<IInputProps> = ({
    type = "text",
    name,
    ClassData = "",
    ClassContainer = "",
    styleData,
    styleContainer,
    placeholder = "",
    LeftAddon = null,
    RigthAddon = null,
    required,
    value,
}) => {

    const [values, setValue] = useState<string | number | readonly string[] | undefined>(value)

    return <div style={styleContainer}
        className={`${styles.input_group} ${ClassContainer}`}>
        {LeftAddon}
        <input type={type} name={name} style={styleData}
            className={`${styles.input_base} ${ClassData}`}
            placeholder={placeholder}
            onChange={(e) => setValue(e.target.value)}
            required={required}
            value={values}
        />
        {RigthAddon}
    </div>

}
