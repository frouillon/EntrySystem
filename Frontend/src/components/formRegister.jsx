
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./formRegister.css";
import Swal from 'sweetalert2';

export function FormRegister( props ){

    
    const [inputName, setInputName] = useState('');
    const [cardId, setCardId] = useState('0'); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 

    const handleChange = (e) =>{
        setInputName(e.target.value);
    }

    const handleSelectChange = (e)=>{
        // setCardId(parseInt(e.target.value));
        setCardId(e.target.value);
    }

    const showAlert = () => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Usuario registrado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      };

    // Obtener Número de tarjeta
    // const fetchCardNumber = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     try {
    //         const response = await fetch('http://localhost:3000/api/card');
    //         const data = await response.json();
    //         if (data) {
    //             setCardNumber(data);
    //         }
    //     } catch (error) {
    //         console.error("Error:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // Registrar Usuario
    
    const registerUser = (e) => {
      e.preventDefault();

      let nombre = inputName;
      const fecha_registro = new Date().toISOString().split('T')[0];

      let url = "https://backendproyectoarquitectura.onrender.com/users";

      fetch( url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, fecha_registro, cardId }),
      })
        .then(response => response.json())
        .then(data => {
            if (data) { 
                showAlert();
                setTimeout( ()=>{
                    navigate('/'); 
                },2000)
            } else {
              console.log('Error en el registro:');
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });  
    };

    return(
        <div className="box">
            <form onSubmit={registerUser}>                
                <div className="input__wrapper">
                    <input 
                        id="nombre" 
                        type="text" 
                        name="nombre" 
                        placeholder="Tu nombre" 
                        className="input__field"
                        required 
                        value={inputName}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                    <label htmlFor="nombre" className="input__label">
                        Nombres
                    </label>
                </div>
                
                <div className="input__wrapper">
                    <select 
                    name="card" 
                    id="card" 
                    className="input__field " 
                    onChange={handleSelectChange}
                    defaultValue="">

                        <option  className="input__field--bl " value="" disabled>Seleccione tarjeta</option>
                        
                        {
                            //? Mostrar solo cards que no tengan un usuario asignado
                            props.DBCards.map( (card, index) => ( 
                            <option key={index} className="input__field--bl " value={card.id_card}>{card.codigo_card}</option>
                        )) 
                        }
                        
                    </select>
                    <label htmlFor="card" className="input__label">
                        Cards Disponibles
                    </label>
                </div>


                {/* <button onClick={fetchCardNumber} className="detectarTarjeta">
                    {buttonText}
                </button> */}
                
                <button type="submit">Registrar Usuario</button>

            </form>
        </div>
    );
}
