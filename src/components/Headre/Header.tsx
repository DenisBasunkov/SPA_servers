import React, { useState } from "react"
import styles from "./Header.module.scss"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogActions, DialogTitle } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../assets/hooks"
import { RenameToken } from "../../store/UserSlice"
import { Button } from "../Buttons/Buttons"

const Header: React.FC = ({ }) => {

    // const location = useLocation()
    const { token } = useAppSelector(state => state.user)

    return <header className={styles.Header_container}>
        {
            token !== "" ? <Profile /> : null
        }

    </header>

}

interface IProfileProps {
}

const Profile: React.FC<IProfileProps> = ({ }) => {
    const dipatch = useAppDispatch()
    const navigate = useNavigate();

    const [isOpenRename, setIsOpenRename] = useState<boolean>(false)

    const user = JSON.parse(sessionStorage.getItem("user") as string || localStorage.getItem("user") as string).username

    const Rename = () => {
        dipatch(RenameToken())
        navigate("/")
    }

    return <div className={styles.nav_User}>
        <h3>{user}</h3>
        <Button color="orange" OnClick={() => setIsOpenRename(true)}>Выйти</Button>

        <Dialog open={isOpenRename}>
            <DialogTitle><h5>Желаете выйти из учетной записи?</h5></DialogTitle>
            <DialogActions>
                <Button color="red" OnClick={Rename}>Выйти</Button>
                <Button OnClick={() => setIsOpenRename(false)}>Отмена</Button>
            </DialogActions>
        </Dialog>

    </div>

}

export default Header