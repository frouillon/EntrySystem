import { pool } from "../db.js";

export const getCards = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cards');
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cards', error });
    }
};

//? OBTENER CODIGO DE TARJETA ASOCIADO A UN USUARIO
export const getCard = async (req, res)=>{
    const { idUsuario } = req.params;
    const result = await pool.query('SELECT codigo_card FROM cards WHERE idUsuario = ?', [idUsuario]);
    res.json(result);
}

export const getFreeCards = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cards WHERE idUsuario IS NULL');
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving free cards', error });
    }
};