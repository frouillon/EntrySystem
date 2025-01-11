import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./buscarRegistro.css";

export function BuscarRegistro() {
  const [registro, setRegistro] = useState([]);
  const [dia, setDia] = useState();
  const [mes, setMes] = useState();
  const [year, setYear] = useState();

  const navigate = useNavigate();


  const handleClick = ()=> {
    navigate('/history')
  }

  function cambiarFecha(tipo, value) {
    if (tipo === "dia") {
      setDia(value); 
    } else if (tipo === "mes") {
      setMes(value);
    } else if (tipo === "year") {
      setYear(value);
    }
  }
  const buscarEnHistorial = ()=>{

    const url = `https://backendproyectoarquitectura.onrender.com/registros?dia=${dia}&mes=${mes}&year=${year}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setRegistro(data);
      })
      .catch((error) => console.error("Error al filtrar registros:", error));
  }

  return (
    <div>
      <div className="card card--hes">
        <header>
          <h2>Historial: </h2>
          <div className="buscarRegistro__inputBoxes">
            <input
              onChange={(e) => cambiarFecha("dia", e.target.value)}
              className="buscarRegistro__input"
              type="text"
              placeholder="dd"
              maxLength={2}
              value={dia}
            />
            <input
              onChange={(e) => cambiarFecha("mes", e.target.value)}
              className="buscarRegistro__input"
              type="text"
              placeholder="mm"
              maxLength={2}
              value={mes}
            />
            <input
              onChange={(e) => cambiarFecha("year", e.target.value)}
              className="buscarRegistro__input"
              type="text"
              placeholder="aaaa"
              maxLength={4}
              value={year}
            />
          </div>
          <button onClick={buscarEnHistorial}>Buscar</button>
        </header>

        <div className="wrapper">
          <table>
            <thead>
              <tr>
                <th draggable="false">Usuario</th>
                <th draggable="false">Fecha De Accion</th>
                <th draggable="false">Hora</th>
              </tr>
            </thead>
            <tbody>
              {registro.length > 0 ? (
                registro.map((regis, index) => {
                    // const fechaFormateada = new Date(regis.fecha).toLocaleDateString("es-PE");
                    const fechaFormateada = regis.fecha.split("T")[0].split("-").reverse().join("/");;
                    return (
                      <tr key={index}>
                        <td>{regis.usuario}</td>
                        <td>{fechaFormateada}</td>
                        <td>{regis.hora}</td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td colSpan="3">No hay registros aquí 💀</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="historialES__boxacciones izquierda">
        <button onClick={handleClick} className="principal__botonHistorial">
            Volver 
        </button>
      </div>
    </div>
  );
}
