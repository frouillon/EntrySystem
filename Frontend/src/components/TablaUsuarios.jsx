import "./tablaUsuarios.css";

import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TarjetaUsuario } from "./TarjetaUsuario";
import { AsignarTarjeta } from "./AsignarTarjeta";

export function TablaUsuarios(props) {
  const theadRef = useRef(null);
  const tbodyRef = useRef(null);
  const navigate = useNavigate();

  const toAdmin = (e)=>{
    navigate('/register'); 
  }

  const obtenerTarjeta = (idUsuario)=>{
    let url  = `https://backendproyectoarquitectura.onrender.com/users/${idUsuario}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        // setUsers(data); 
        console.log(data)
      })
      .catch(error => console.error('Error:', error)); 
  }

  
  return (
    <div>
      <div className="card">
        <header>
          <h2>Usuarios</h2>
          <button type="button" onClick={toAdmin} title="Agregar Usuario">
            <span className="material-symbols-outlined"> person_add </span>
            Agregar
          </button>
        </header>

        <div className="wrapper">
          <table>
            <thead ref={theadRef}>
              <tr>
                <th draggable="true">Nombre</th>
                <th draggable="true">Fecha De Registro</th>
                <th draggable="true">Tarjeta</th>
                <th draggable="true">Accion</th>
              </tr>
            </thead>
            <tbody ref={tbodyRef}>
              {props.usuarios.length > 0 ? (
                props.usuarios.map((usuario, index) => (
                  <tr key={index}>
                    <td>{usuario.nombre}</td>
                    <td>{new Date(usuario.fecha_registro).toLocaleDateString('es-ES')}</td>
                    <td>
                      <TarjetaUsuario idUsuario={usuario.idUsuario} />
                    </td>
                    <td>
                      <AsignarTarjeta idUsuario={usuario.idUsuario}></AsignarTarjeta>
                    </td>
                  </tr>

                ))
              ) : (
                <tr>
                  <td colSpan="3">No hay usuarios disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
