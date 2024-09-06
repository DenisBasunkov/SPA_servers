import React from "react"
import styles from "./Message.module.scss"

interface IMessageProps {
    message?: React.ReactNode | null,
    position?: "top_left" | "top_rigth" | "bottom_left" | "bottom_rigth",
    type?: "error" | "warning" | "sucess" | "info"
}

export const Message: React.FC<IMessageProps> = ({
    message = null,
    position = "bottom_left",
    type = "info"
}) => {

    return <div className={`
        ${styles.Message}
        ${styles[`Message_position_${position}`]}
        ${styles[`Message_type_${type}`]}
        ${message === null ? null : styles.open}
        `}
    >{message}</div>

}