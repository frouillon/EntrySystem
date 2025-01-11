import React, { useState, useEffect } from "react";
import { FormRegister } from "../../components/formRegister";
import "./Register.css";

export function Register() {

    const [cards, setCards] = useState([]);
  // Obtener usuarios al cargar la página
  useEffect(() => {
    fetch("https://backendproyectoarquitectura.onrender.com/free-cards")
      .then((response) => response.json())
      .then((data) => {
        setCards(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <>
      <div className="tituloRegistro">
        <h1>Registrar Usuario</h1>
      </div>
      <FormRegister DBCards={cards} />
    </>
  );
}
