import { AnyAction, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { HOST, IDataAuth } from "../assets/GlobalVariables";

interface IinitialState {

    token: string | unknown,
    loading: boolean,
    error: string | null,
}

const initialState: IinitialState = {
    token: "",
    error: null,
    loading: false,
}
const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        SessionToken: function (state) {
            if (sessionStorage.getItem("token")) {
                state.token = sessionStorage.getItem("token") as string
            }
            if (localStorage.getItem("token")) {
                state.token = localStorage.getItem("token") as string
            }
        },
        RenameToken: (state) => {
            sessionStorage.removeItem("token")
            localStorage.removeItem("token")
            sessionStorage.removeItem("user")
            localStorage.removeItem("user")
            state.token = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(AuthUser.pending, (state) => {
                sessionStorage.clear()
                state.loading = true;
                state.error = null
                state.token = ""
            })
            .addCase(AuthUser.fulfilled, (state, action) => {
                state.token = action.payload.token
                state.loading = false
                state.error = null
            })
            .addMatcher(IsError, (state, action: PayloadAction<string>) => {
                state.error = action.payload;
                state.loading = false

            })
    }
})

function IsError(action: AnyAction) {
    return action.type.endsWith("rejected")
}

export const { SessionToken, RenameToken } = UserSlice.actions;
export default UserSlice.reducer;

interface IPropsAuth {
    dataAuth: IDataAuth,
    isLocal: boolean,
}

export const AuthUser = createAsyncThunk<{ token: string }, IPropsAuth, { rejectValue: string }>(
    "user/AuthUser",
    async function (dataAuth, { rejectWithValue }) {
        try {
            // const navigate = useNavigate()
            const { data } = await axios({
                method: "post",
                url: HOST + "/ru/data/v3/testmethods/docs/login",
                data: dataAuth.dataAuth
            })

            if (data.error_code !== 0) {
                return rejectWithValue(data.error_text)
            }
            // navigate("/Table")
            if (dataAuth.isLocal) {
                localStorage.setItem("user", JSON.stringify(dataAuth.dataAuth))
                localStorage.setItem("token", data.data.token)
            } else {
                sessionStorage.setItem("user", JSON.stringify(dataAuth.dataAuth))
                sessionStorage.setItem("token", data.data.token)
            }
            return data.data

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // Сервер вернул ошибку с ответом
                return rejectWithValue(error.response.data?.error_message || "Error occurred");
            } else {
                // Ошибка сети или другие непредвиденные ошибки
                return rejectWithValue("Network Error or Server is down");
            }
        }

    }
)