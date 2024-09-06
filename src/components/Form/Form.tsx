import React, { useState } from "react"
import styles from "./Form.module.scss"
import { Input } from "../Input/Input"
import { Button } from "../Buttons/Buttons"
import { useAppDispatch, useAppSelector } from "../../assets/hooks"
import { AuthUser } from "../../store/UserSlice"
import { IDataAuth, IUserdocs } from "../../assets/GlobalVariables"
import { AddData, RenameData } from "../../store/DataSlise"
import { LinearProgress } from "@mui/material"
import { Message } from "../Message/Message"

interface IFormAddDataProps {
    value?: IUserdocs
}

export const FormAddData: React.FC<IFormAddDataProps> = ({ value }) => {

    const { error } = useAppSelector(state => state.dataTable)
    const dispatch = useAppDispatch()

    const [isLoading, setIsLoading] = useState(false)

    const objectData: { [ket: string]: any } = {}

    if (value) {
        Object.entries(value).forEach(([key, val]) => {
            if (key.includes("Date")) {
                objectData[key] = new Date(value?.companySigDate as string).toISOString().slice(0, 16);
            } else {
                objectData[key] = String(val);
            }
        });
    }

    const Title = Object.keys(objectData).length !== 0 ? "Изменить" : "Добавить";

    const Submit = (e: React.FormEvent<HTMLFormElement>) => {
        setIsLoading(true)
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        var object: { [key: string]: FormDataEntryValue } = {};
        formData.forEach((value, key) => {
            object[key] = value
        });
        const FormDatas = object as unknown as IUserdocs;
        if (Object.keys(objectData).length !== 0) {
            dispatch(RenameData(FormDatas))
        } else {
            dispatch(AddData(FormDatas))
        }

    }

    return <form className={styles.FormAddData} onSubmit={Submit}>
        <div className={styles.FromInputs}>
            <input name="id" type="hidden" value={objectData.id} />
            <div>
                <p>Название подписи компании</p>
                <Input name="companySignatureName" type="text" required value={objectData.companySignatureName} />
                <p>Дата подписи компании</p>
                <Input name="companySigDate" type="datetime-local" required value={objectData.companySigDate} />
            </div>
            <div>
                <p>Название документа</p>
                <Input name="documentName" type="text" required value={objectData.documentName} />
                <p>Тип документа</p>
                <Input name="documentType" type="text" required value={objectData.documentType} />
                <p>Статус документа</p>
                <Input name="documentStatus" type="text" required value={objectData.documentStatus} />
            </div>
            <div>
                <p>Номер сотрудника</p>
                <Input name="employeeNumber" type="number" required value={objectData.employeeNumber} />
                <p>Имя подписи сотрудника</p>
                <Input name="employeeSignatureName" type="text" required value={objectData.employeeSignatureName} />
                <p>Дата подписи сотрудника</p>
                <Input name="employeeSigDate" type="datetime-local" required value={objectData.employeeSigDate} />
            </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", justifyItems: "center", alignItems: "center", gap: "15px" }}>
            <Button style={{ width: "100%", float: "right" }} type="submit">{Title} запись </Button>
        </div>
        {isLoading ? <LinearProgress /> : null}

        <Message message={error} position="bottom_left" type="error" />

    </form>
}


interface IFormAuthProps {

}

export const FormAuthProps: React.FC<IFormAuthProps> = ({ }) => {

    const dispatch = useAppDispatch()
    // const { loading } = useAppSelector((store) => store.user)
    const [isLocal, setIsLocal] = useState(false)

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget);

        var object: { [key: string]: FormDataEntryValue } = {};
        formData.forEach((value, key) => {
            object[key] = value
        });
        const AuthData = {
            dataAuth: object as unknown as IDataAuth,
            isLocal: isLocal,
        }

        dispatch(AuthUser(AuthData))

    }


    return <form onSubmit={onSubmit} className={styles.FormAuth}>
        <p>Имя пользователя</p>
        <Input name="username" type="text" required placeholder="введите имя пользователя" />
        <p>Пароль</p>
        <Input name="password" type="password" required placeholder="введите пароль" />
        <label htmlFor="isLocal">
            <input id="isLocal" type="checkbox" checked={isLocal} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsLocal(e.target.checked)} />
            запомнить меня
        </label>
        <div style={{ border: "1px solid hsla(0,0%,0%,.1)" }}></div>
        <Button type="submit">Войти</Button>
    </form>
}

