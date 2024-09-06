import { configureStore } from "@reduxjs/toolkit"
import UserSlice from "./UserSlice"
import DataSlise from "./DataSlise"

const store = configureStore({
    reducer: {
        user: UserSlice,
        dataTable: DataSlise,
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
