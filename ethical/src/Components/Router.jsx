import ProtectedRoutes from "../utils/ProtectedRoutes.jsx" 
import Login from "../Pages/Login.jsx" 
import Signup from "../Pages/Signup.jsx" 

import CreateList from "../Pages/CreateList.jsx" 
import {BrowserRouter, Routes, Route, Outlet} from "react-router-dom"

export default function Router() {
    return ( 
        <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            {/* <Route path="/logout" element={<Logout />} />  */}
            {/* <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<Home />} />
                <Route path="/CreateList" element={<CreateList />} />
            </Route> */}
            <Route element={<ProtectedRoutes  />}>
                        <Route path="/CreateList" element={<CreateList />} />
            </Route>

        </Routes>
    </BrowserRouter>
    )
}
