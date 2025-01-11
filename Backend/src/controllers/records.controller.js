import { pool } from "../db.js";



export const createRegister = async (req, res) => {

    const registros = req.body;
    
    try {
        for (const registro of registros) {
            let [result] = await pool.query('INSERT INTO registros (usuario, fecha, hora) VALUES (?, ?, ?)', [registro.usuario, registro.fecha, registro.hora]);
        }
        res.status(200).json({ message: "Registros guardados exitosamente." });

    } catch (error) {
        console.error("Error al guardar los registros:", error);
        res.status(500).json({ message: "Error al guardar los registros." });
    }

}

export const getRegister = async(req, res) =>{
    const { dia, mes, year } = req.query;
    const fechaFiltro = `${year}-${mes}-${dia}`;

    try {
        let [result] = await pool.query('SELECT * FROM registros WHERE DATE(fecha) = ?', [fechaFiltro]);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error al obtener los registros:", error);
    }
}