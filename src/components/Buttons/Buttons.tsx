import React from "react"
import styles from "./Buttons.module.scss"


interface IButtonProps {
    children?: React.ReactNode,
    style?: React.CSSProperties,
    color?: "red" | "blue" | "green" | "orange" | "yellow",
    ClassName?: string,
    OnClick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
    Disabled?: boolean,
    type?: "button" | "reset" | "submit",
}

export const Button: React.FC<IButtonProps> = ({
    children,
    style,
    color = "",
    ClassName = "",
    OnClick,
    Disabled = false,
    type = "button",
}) => {

    return <button
        style={style}
        className={`${styles.Button_container} ${ClassName} 
        ${color !== "" ? styles[`Button_${color}`] : ""}
        `}
        onClick={Disabled ? undefined : OnClick}
        disabled={Disabled}
        type={type}
    >
        {children}
    </button>

}