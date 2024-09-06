import { useEffect } from "react";
import { useAppSelector } from "../../assets/hooks";
import { FormAuthProps } from "../../components/Form/Form";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.scss"


const Home = () => {

    const navigation = useNavigate()
    const { token } = useAppSelector((store) => store.user)

    useEffect(() => {
        if (token !== "") {
            navigation("/SPA_servers/Table")
        }
    }, [token])

    return <main>
        <div className={styles.container}>
            < FormAuthProps />
        </div>


    </main>
}

export default Home