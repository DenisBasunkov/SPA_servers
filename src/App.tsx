import { Route, Routes } from "react-router-dom";
import Header from "./components/Headre/Header";

import Home from "./pages/Home/Home";
import Error from "./pages/Error/Error";
import { useAppDispatch, useAppSelector } from "./assets/hooks";
import { SessionToken } from "./store/UserSlice";
import Table_page from "./pages/Table/Table";
import { CircularProgress } from "@mui/material";
import { Message } from "./components/Message/Message";

function App() {

  const dispatch = useAppDispatch()

  const { dataTable, user } = useAppSelector(state => state)

  onload = () => {
    dispatch(SessionToken())
  }

  return (
    <div className="body">
      <Header />
      <Routes>
        <Route path="/SPA_servers/" element={<Home />} />
        <Route path="/SPA_servers/Table" element={<Table_page />} />
        <Route path="/SPA_servers/*" element={<Error />} />
      </Routes>
      {
        user.loading || dataTable.loading ? <div style={{
          position: "absolute",
          zIndex: "100",
          width: "100%", height: "100%",
          top: 0, left: 0,
          backgroundColor: "hsla(0,0%,0%,.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <CircularProgress color="success" size={100} />
        </div> : null
      }

      {
        (user.error || dataTable.error) === null ? null :
          <Message message={user.error || dataTable.error} type="error" position="bottom_left" />

      }
      {
        (dataTable.messege) === null ? null :
          <Message message={dataTable.messege} type="sucess" position="bottom_left" />

      }
    </div>
  )
}

export default App
