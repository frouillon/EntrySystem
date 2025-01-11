import React from "react";
import './activarPuerta.css';


function accionActivarPuerta(){
    alert('Puerta abierta');
}

export function ActivarPuerta(){ 

    return(
        <>
        {/* Esto aun no se implementa */}
        <button onClick={accionActivarPuerta} className="activarPuerta__boton">Activar Puerta</button>
        </>
    );
}