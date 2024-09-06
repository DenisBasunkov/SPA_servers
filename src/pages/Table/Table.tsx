import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../assets/hooks"
import { FetchData } from "../../store/DataSlise"
import { Table } from "../../components/Table/Table"
import { useNavigate } from "react-router-dom"



const Table_page = () => {
    const navigation = useNavigate()
    const dispatch = useAppDispatch()
    const { loading, error } = useAppSelector(state => state.dataTable)
    const { token } = useAppSelector(state => state.user)

    useEffect(() => {
        if (token !== '') {
            dispatch(FetchData())
        }
    }, [token])

    useEffect(() => {
        if (token == '') {
            navigation('/')
        }
    }, [])

    if (!loading) {
        return <main>


            <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
                <Table />
            </div>

            {
                error
            }

        </main>
    }


}

export default Table_page