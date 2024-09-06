import { useEffect } from "react";
import { useAppSelector } from "../../assets/hooks";
import { FormAuthProps } from "../../components/Form/Form";
import { useNavigate } from "react-router-dom";
import { Message } from "../../components/Message/Message";
import styles from "./Home.module.scss"


const Home = () => {

    const navigation = useNavigate()
    const { token } = useAppSelector((store) => store.user)

    useEffect(() => {
        if (token !== "") {
            navigation("/Table")
        }
    }, [token])

    return <main>
        <div className={styles.container}>
            < FormAuthProps />
        </div>


    </main>
}

export default Home