import "./asignarTarjeta.css";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import  {TarjetaUsuario} from "./TarjetaUsuario";

export function AsignarTarjeta({idUsuario}) {

  const navigate = useNavigate();

  const [tarjeta, setTarjeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerTarjeta = async (idUsuario) => {
      try {
        const response = await fetch(`https://backendproyectoarquitectura.onrender.com/card/${idUsuario}`);
        const data = await response.json();
        setTarjeta(data[0][0]);
        // console.log(data[0][0])
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerTarjeta(idUsuario);
  }, [idUsuario]);

  
  return (

    tarjeta ? null :  <span className="material-symbols-outlined add_card" title="Asignar Tarjeta"> add_card </span>

  )
}
