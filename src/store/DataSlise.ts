import { AnyAction, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { HOST, IUserdocs } from "../assets/GlobalVariables";

interface IData {
    list: IUserdocs[],
    loading: boolean,
    error: string | null,
    messege: string | null,
    Item_loading: boolean,
}

const initialState: IData = {
    list: [],
    loading: false,
    error: null,
    messege: null,
    Item_loading: false
}

const DataSlice = createSlice({
    name: "userdocs",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FeatchData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(FeatchData.fulfilled, (state, action: PayloadAction<IUserdocs[]>) => {
                state.list = action.payload
                state.loading = false
            })
            .addCase(AddData.pending, (state) => {
                state.error = null;
                state.messege = null;
                state.Item_loading = true
            })
            .addCase(AddData.fulfilled, (state, action) => {
                state.list.push(action.payload)
                state.messege = "Запись добавлена";
                state.Item_loading = false
            })
            .addCase(RemoveData.pending, (state) => {
                state.error = null
                state.messege = null;
                state.Item_loading = true
            })
            .addCase(RemoveData.fulfilled, (state, action) => {
                state.list = action.payload
                state.messege = "Запись удалена";
                state.Item_loading = false
            })
            .addCase(RenameData.pending, (state) => {
                state.error = null
                state.messege = null;
                state.Item_loading = true
            })
            .addCase(RenameData.fulfilled, (state, action) => {
                state.list = action.payload
                state.messege = "Запись изменина";
                state.Item_loading = false
            })
            .addCase(CopyData.pending, (state) => {
                state.error = null
                state.messege = null;
                state.Item_loading = true
            })
            .addCase(CopyData.fulfilled, (state, action) => {
                state.list.push(action.payload)
                state.messege = "Запись скопированна";
                state.Item_loading = false
            })
            .addCase(RemoveAll.pending, (state) => {
                state.error = null
                state.messege = null;
                state.Item_loading = true
            })
            .addCase(RemoveAll.fulfilled, (state, action) => {
                state.list = action.payload
                state.messege = "Выбранные записи удалены";
                state.Item_loading = false
            })
            .addMatcher(IsError, (state, action: PayloadAction<string>) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

function IsError(action: AnyAction) {
    return action.type.endsWith("rejected")
}

export default DataSlice.reducer;
export const { } = DataSlice.actions;

export const FeatchData = createAsyncThunk<IUserdocs[], undefined, { rejectValue: string, state: { user: { token: string } } }>(
    "userdocs/FeatchData",
    async function (_, { rejectWithValue, getState }) {

        const token = getState().user.token

        const { data } = await axios({
            method: "get",
            url: HOST + "/ru/data/v3/testmethods/docs/userdocs/get",
            headers: {
                "x-auth": token,
            }
        })
        if (data.error_code !== 0) return rejectWithValue(data.error_message)


        return data.data
    }
)


export const AddData = createAsyncThunk<IUserdocs, IUserdocs, { rejectValue: string, state: { user: { token: string } } }>(
    "userdocs/AddData",
    async function (ItemUserdocs, { rejectWithValue, getState }) {

        const token = getState().user.token

        const { data } = await axios({
            method: "post",
            url: HOST + "/ru/data/v3/testmethods/docs/userdocs/create",
            headers: {
                "x-auth": token,
            },
            data: ItemUserdocs
        })
        if (data.error_code !== 0) return rejectWithValue(data.error_message)
        console.log(data.data)
        return data.data as IUserdocs
    }
)

export const RemoveData = createAsyncThunk<IUserdocs[], string, { rejectValue: string, state: { user: { token: string }, dataTable: IData } }>(
    "userdocs/RemoveData",
    async (DataId, { rejectWithValue, getState }) => {

        const token = getState().user.token
        const datas = getState().dataTable.list

        const { data } = await axios({
            method: "post",
            url: `${HOST}/ru/data/v3/testmethods/docs/userdocs/delete/${DataId}`,
            headers: {
                "x-auth": token,
            },
        });

        if (data.error_code) {
            return rejectWithValue(data.errors.id[0]);
        }

        return datas.filter((item) => item.id !== DataId);

    }
)

export const RenameData = createAsyncThunk<IUserdocs[], IUserdocs, { rejectValue: string, state: { user: { token: string }, dataTable: IData } }>(
    "userdocs/RenameData",
    async (newData, { rejectWithValue, getState }) => {

        const token = getState().user.token
        const datas = getState().dataTable.list

        const { data } = await axios({
            method: "post",
            url: `${HOST}/ru/data/v3/testmethods/docs/userdocs/set/${newData.id}`,
            headers: {
                "x-auth": token,
            },
            data: newData
        });
        if (data.error_code !== 0) return rejectWithValue(data.error_message);
        return datas.map((item) => {
            if (item.id === data.data.id) return data.data
            return item
        });

    }
)


export const CopyData = createAsyncThunk<IUserdocs, IUserdocs, { rejectValue: string, state: { user: { token: string }, dataTable: IData } }>(
    "userdocs/CopyData",
    async (newData, { rejectWithValue, getState }) => {

        const token = getState().user.token

        const object: { [key: string]: FormDataEntryValue } = {}

        Object.entries(newData).forEach(([key, value]) => {
            if (key !== "id") {
                object[key] = value
            }
        })

        const { data } = await axios({
            method: "post",
            url: `${HOST}/ru/data/v3/testmethods/docs/userdocs/create`,
            headers: {
                "x-auth": token,
            },
            data: object
        });
        if (data.error_code !== 0) return rejectWithValue(data.error_message);
        return data.data

    }
)


export const RemoveAll = createAsyncThunk<IUserdocs[], string[], { rejectValue: string, state: { user: { token: string }, dataTable: IData } }>(
    "userdocs/RemoveAll",
    async (DataId, { rejectWithValue, getState }) => {

        const token = getState().user.token
        const datas = getState().dataTable.list
        let isFinal = false

        for (const item of DataId) {
            try {
                const { data } = await axios({
                    method: "post",
                    url: `${HOST}/ru/data/v3/testmethods/docs/userdocs/delete/${item}`,
                    headers: {
                        "x-auth": token,
                    },
                });

                if (data.error_code) {
                    isFinal = false;
                    alert(data.errors.id[0]);
                    break; // Прекратить выполнение при первой ошибке
                }
                isFinal = true
            } catch (error) {
                isFinal = false;
                alert("Ошибка при удалении данных");
                break; // Прекратить выполнение при ошибке запроса
            }
        }

        if (isFinal) {
            // Если все элементы успешно удалены, возвращаем обновленные данные
            return datas.filter((item) => !DataId.includes(item.id));
        } else {
            // Если удаление завершилось неудачей
            return rejectWithValue("Данные не удалились");
        }
    }
)