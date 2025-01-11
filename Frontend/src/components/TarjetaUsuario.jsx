import { useState, useEffect } from "react";

export function TarjetaUsuario({ idUsuario }) {
  const [tarjeta, setTarjeta] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerTarjeta = (idUsuario) => {
      let url = `https://backendproyectoarquitectura.onrender.com/card/${idUsuario}`; 

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setTarjeta(data[0][0]); 
        })
        .catch((error) => console.error("Error:", error))
        .finally(() => setLoading(false)); 
    };

    obtenerTarjeta(idUsuario); 
  }, [idUsuario]);

  return (
    <>
      {loading ? (
        <span>Cargando...</span>
      ) : tarjeta ? (
        <span>{tarjeta.codigo_card}</span>
      ) : (
        <span>No asignada</span>
      )}
    </>
  );
}


