import { pool } from "../db.js";

import { io } from "../../index.js";


export const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
}

export const getUserCard = async (req, res) => {    
    const { codigo_card } = req.params;

    try {
        const result = await pool.query('SELECT u.nombre FROM usuarios u JOIN cards c ON u.idUsuario = c.idUsuario WHERE c.codigo_card = ?', [codigo_card]);
        
        // Emite un evento por WebSocket con el código de la tarjeta
        io.emit('card-escaneada', {
            codigo_card,
            user: result.length > 0 ? result[0][0].nombre : null
        });
        
        res.json(result);
    } catch (error) {
        res.status(404).json({ message: 'Error al obtener la tarjeta del usuario', error });
        
        io.emit('card-escaneada', {
            codigo_card,
            user: null,
        });
    }
}

export const createUser = async (req, res) => {
    try {
        const { nombre, fecha_registro, cardId } = req.body;
        let [result] = await pool.query('INSERT INTO usuarios (nombre, fecha_registro) VALUES (?, ?)', [nombre, fecha_registro]);

        const idUsuario = result.insertId;
        const [cardUdpResult] = await pool.query('UPDATE cards SET idUsuario = ? WHERE id_card = ?', [idUsuario, cardId] );

        res.json({ message: 'Usuario creado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear usuario', error });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { idUsuario, nombre } = req.body;
        await pool.query('UPDATE usuarios SET nombre = ? WHERE idUsuario = ?', [nombre, idUsuario]);
        res.json({ message: 'Usuario actualizado' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Error al actualizar usuario', error });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { nombre } = req.body;
        await pool.query('DELETE FROM usuarios WHERE nombre = ?', [nombre]);
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario', error });
    }
}