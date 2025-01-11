import React, { useState, useEffect } from 'react';
import { TablaUsuarios } from '../../components/tablaUsuarios';
import { ActivarPuerta } from '../../components/ActivarPuerta';
import { io } from 'socket.io-client';

import Swal from 'sweetalert2';
import alertSoundFile from '../../assets/sonidoAlerta.mp3';
import warningSoundFile from '../../assets/sonidoWarning.mp3';

import './principal.css';
import { useNavigate } from 'react-router-dom';

const socket = io('https://backendproyectoarquitectura.onrender.com');

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

const alertaAcceso = ( usuario ) => {
  const alertaSonido = new Audio(alertSoundFile); 
  alertaSonido.play().catch((error) => {
    console.error('Error reproduciendo el sonido:', error);
  });

  Toast.fire({
    icon: "info",
    title: "¡Puerta Desbloqueada!",
    text: `${usuario} ha desbloquado la puerta.`
  })
};

const alertaWarning = () => {
  const alertaSonido = new Audio(warningSoundFile); 
  alertaSonido.play().catch((error) => {
    console.error('Error reproduciendo el sonido:', error);
  });

  Swal.fire({
    title: '¡Advertencia!',
    html: '<p>Usuario no admitido.</p><p>Se intento desbloquear la puerta con una tarjeta no válida.</p>',
    icon: 'warning',
    iconColor: 'red',
    confirmButtonText: 'Ok',
    backdrop: false,
    timerProgressBar: true
  });
};


//https://backendproyectoarquitectura.onrender.com/users

export function Principal() {
  const [users, setUsers] = useState([]); 

  const [registro, setRegistro] = useState(() => {
    const registroGuardado = sessionStorage.getItem("registro");
    return registroGuardado ? JSON.parse(registroGuardado) : [];
  });

  const navigate = useNavigate();
  
  const nuevoRegistro = ( user )=>{

    const fecha_registro = new Date();
    const fecha = fecha_registro.toISOString().split("T")[0]; 
    const hora = fecha_registro.toTimeString().split(" ")[0];
  
    var nuevo_registro = new Object();
        nuevo_registro.usuario = user;
        nuevo_registro.fecha  = fecha;
        nuevo_registro.hora = hora;

    setRegistro((prevRegistro) => {
      const nuevoRegistroActualizado = [...prevRegistro, nuevo_registro];
      sessionStorage.setItem("registro", JSON.stringify(nuevoRegistroActualizado)); // Actualizar sesión
      return nuevoRegistroActualizado; 
    });
  }

  // Usuarios al cargar la pagina y conectar el websocket.
  useEffect(() => {
    fetch('https://backendproyectoarquitectura.onrender.com/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data); 
      })
      .catch(error => console.error('Error:', error)); 

      socket.on('card-escaneada', (data) => {
        const { codigo_card, user } = data;
        const mensaje = user 
          ? `Tarjeta escaneada: ${codigo_card}. Usuario: ${user}`
          : `Tarjeta no registrada: ${codigo_card}`;
        // console.log(mensaje)
        
        if(user){
          alertaAcceso( user );
          nuevoRegistro( user );
        }else{
          alertaWarning();
        }

      });

      return () => {
        socket.off('card-escaneada');
      }

  }, []);
 
  const handleClick = ()=>{
    navigate("/history");
  }

  return (
    <div>
      <h1 className='principal__titulo'>Sistema de Seguridad SISG</h1>
      <TablaUsuarios usuarios={users} />

      <div className="principal__boxacciones">
        <ActivarPuerta />
        <button onClick={ handleClick } className="principal__botonHistorial">
          Historial de Acceso.
        </button>
      </div>
    </div>
  );
}