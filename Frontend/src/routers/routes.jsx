import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Principal } from "../pages/Home/Principal";
import { Register } from "../pages/register/register";
import { HistorialES } from "../pages/history/HistorialES";
import { BuscarRegistro } from "../pages/history/BuscarRegistro";



export function MyRoutes() {
    return(
        <BrowserRouter>
        <Routes>
           
            <Route path="/" element={<Principal/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/history" element={<HistorialES/>} />
            <Route path="/buscarRegistro" element={<BuscarRegistro/>} />
            
        </Routes>
        </BrowserRouter>
    )
}
