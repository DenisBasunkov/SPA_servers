import React, { useEffect, useRef, useState } from "react"
import styles from "./Table.module.scss"
import { useAppDispatch, useAppSelector } from "../../assets/hooks"
import { CopyData, RemoveAll, RemoveData } from "../../store/DataSlise"
import { Button } from "../Buttons/Buttons"
import { FormAddData } from "../Form/Form"
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, TablePagination, Tooltip } from "@mui/material"
import { generatePass, IUserdocs } from "../../assets/GlobalVariables"
import { Input } from "../Input/Input"
import { Message } from "../Message/Message"

// interface ITableProps {
//     data?: IUserdocs[],
//     header?: string[],
// }

export const Table: React.FC = ({ }) => {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isOpenDelete, setIsOpennDelete] = useState<boolean>(false)
    const [isOpenAllDelete, setIsOpennAllDelete] = useState<boolean>(false)
    const [KeyDelete, setKeyDelete] = useState<string | null>(null)
    const [Userdocs, setUserdocs] = useState<IUserdocs>()
    const dispatch = useAppDispatch()
    const [isLoading, setIsLoading] = useState<boolean>(false)


    const { list, loading, error, Item_loading } = useAppSelector(state => state.dataTable)
    const CheckRef = useRef<(HTMLInputElement | null)[]>([])
    const [currentPage, setCurrentPage] = useState<number>(0)// Состояние текущей страницы 
    const [postPerPage, setPostPerPage] = useState<number>(10);// Состояние колличества постов на странице
    const firstPostIndex = currentPage * postPerPage;
    const lastPointIndex = firstPostIndex + postPerPage;
    const currentData = list.slice(firstPostIndex, lastPointIndex); // Срезанный список репозиториев

    const [isDisable, setIsDisable] = useState<boolean>(true)

    const OpenDeleteForm = (id: string) => {
        setIsOpennDelete(true)
        setKeyDelete(generatePass(Math.random() * (10 - 1) + 1) + "_" + id)
    }

    const Delete = (e: React.FormEvent<HTMLFormElement>) => {
        setIsLoading(true)
        e.preventDefault()

        const code = new FormData(e.currentTarget).get("code")?.toString()
        if (code === KeyDelete) {
            const timer = setTimeout(() => {
                dispatch(RemoveData(code?.split("_")[1]))
                setIsLoading(false)
            }, 2000)
            return () => clearTimeout(timer)
        }

    }

    const Rename = (data: IUserdocs) => {
        setIsOpen(true)
        setUserdocs(data)
    }

    const Add = () => {
        setIsOpen(true)
        setUserdocs(undefined)
    }

    const Copy = (item: IUserdocs) => {
        dispatch(CopyData(item))
    }

    const AllDelete = () => {
        const checkedItems = CheckRef.current
            .filter(checkBox => checkBox?.checked)
            .map(checkBox => checkBox?.value)

        dispatch(RemoveAll(checkedItems))
        setIsOpennAllDelete(false)

    }

    useEffect(() => {
        if (!loading) {
            setIsOpen(false)
            setIsOpennDelete(false)
        }
    }, [list])

    const Checked = () => {
        const checkBoxes = CheckRef.current;
        const isAnyChecked = checkBoxes.some(item => item?.checked);
        setIsDisable(!isAnyChecked);
    }

    const CheckAll = (e: React.MouseEvent<HTMLInputElement>) => {
        const checkBoxes = CheckRef.current;
        checkBoxes.forEach(item => {
            if (e.currentTarget.checked) {
                if (item) {
                    item.checked = true;
                }
            } else {
                if (item) {
                    item.checked = false;
                }
            }


        });
    }

    const title = [{ label: "companySigDate", value: "Дата подписи компании" }, { label: "companySignatureName", value: "Название подписи компании" }, { label: "documentName", value: "Название документа" }, { label: "documentStatus", value: "Статус документа" }, { label: "documentType", value: "Тип документа" }, { label: "employeeNumber", value: "Номер сотрудника" }, { label: "employeeSigDate", value: "Дата подписи сотрудника" }, { label: "employeeSignatureName", value: "Имя подписи сотрудника" },]

    return <>
        <table className={`${styles.Table_container}`}>
            <caption>
                <div style={{ padding: "10px 5px", width: "100%", display: "flex", gap: "15px", justifyContent: "space-between" }}>
                    <Button OnClick={Add}>Добавить запись</Button>
                    <Button Disabled={isDisable} OnClick={() => setIsOpennAllDelete(true)} color="red">Удалить выбранные записи</Button>
                </div></caption>
            <thead>
                <tr>
                    <th><input type="checkbox" onClick={CheckAll} /></th>
                    {
                        title.map((item, i) => {
                            return <th key={i}>
                                <Tooltip title={item.label}>
                                    <p>{item.value}</p>
                                </Tooltip>
                            </th>
                        })
                    }
                </tr>
            </thead>
            <tbody>
                {
                    currentData.map((item, index) => {
                        return <tr key={item.id}>
                            <td className={styles.Cell}><input type="checkbox" onClick={Checked} name="ID_item" ref={el => (CheckRef.current[index] = el)} value={item.id} /></td>
                            <td className={styles.Cell}>{item.companySigDate}</td>
                            <td className={styles.Cell}>{item.companySignatureName}</td>
                            <td className={styles.Cell}>{item.documentName}</td>
                            <td className={styles.Cell}>{item.documentStatus}</td>
                            <td className={styles.Cell}>{item.documentType}</td>
                            <td className={styles.Cell}>{item.employeeNumber}</td>
                            <td className={styles.Cell}>{item.employeeSigDate}</td>
                            <td className={styles.Cell}>{item.employeeSignatureName}</td>
                            <td className={styles.Cell}><div className={styles.Row_Nav}>
                                <button onClick={() => OpenDeleteForm(item.id)}>🗑</button>
                                <button onClick={() => Rename(item)}>🖊</button>
                                <button onClick={() => Copy(item)}>📝📝</button>
                            </div></td>
                        </tr>
                    })
                }
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={9}>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginTop: "15px" }}>
                            <TablePagination
                                style={{ width: "100%" }}
                                component={"div"}
                                page={currentPage}
                                onPageChange={(_, n) => setCurrentPage(n)}
                                rowsPerPage={postPerPage}
                                count={list.length}
                                rowsPerPageOptions={[10, 20, 30]}
                                onRowsPerPageChange={(e) => { setPostPerPage(+e.target.value); setCurrentPage(0) }}
                            />
                        </div>
                    </td>
                </tr>
            </tfoot>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogTitle>Ввод данных</DialogTitle>
                <DialogContent>
                    <FormAddData value={Userdocs} />
                </DialogContent>
            </Dialog>

            <Dialog open={isOpenAllDelete} onClose={() => setIsOpennAllDelete(false)}>
                <DialogTitle>Желаете удалить выбранные строки?</DialogTitle>
                <DialogActions>
                    <Button color="red" OnClick={AllDelete}>Удалить</Button>
                    <Button OnClick={() => setIsOpennAllDelete(false)}>Отмена</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isOpenDelete}>

                <form onSubmit={Delete} >
                    <DialogTitle><h5>Удаление записи</h5></DialogTitle>
                    <DialogContent>
                        <div className={styles.Form_Delete}>
                            <p>Для удаления записи необходимо ввести ключ:<br /><code>{KeyDelete}</code></p>
                            <Input name="code" type="text" placeholder="Введите ключ" required />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button color="red" type="submit">Удалить</Button>
                        <Button OnClick={() => setIsOpennDelete(false)}>Отмена</Button>
                    </DialogActions>

                    {
                        isLoading ? <LinearProgress /> : null
                    }
                </form>
            </Dialog>


        </table >

        {
            Item_loading ? <CircularProgress style={{ position: 'absolute', bottom: "25px", left: "25px" }} /> : null
        }

        <Message message={error} position="bottom_left" type="error" />
    </>

}