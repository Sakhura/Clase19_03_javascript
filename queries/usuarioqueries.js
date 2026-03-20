// src/queries/usuarioQueries.js
const pool = require('../config/db');

// ==========================================
// 1. OBTENER TODOS LOS REGISTROS
// ==========================================
const obtenerTodos = async () => {
    try {
        const resultado = await pool.query('SELECT * FROM usuarios');
        return resultado.rows; // array con todos los usuarios
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }
};

// ==========================================
// 2. OBTENER UNO POR ID
// ==========================================
const obtenerPorId = async (id) => {
    try {
        // Siempre usar $1, $2... en vez de concatenar strings
        // Evita inyección SQL (SQL Injection)
        const resultado = await pool.query(
            'SELECT * FROM usuarios WHERE id = $1',
            [id]  // el array reemplaza los $1, $2...
        );
        return resultado.rows[0]; // un solo objeto
    } catch (error) {
        console.error('Error al obtener usuario:', error.message);
        throw error;
    }
};

// ==========================================
// 3. INSERTAR
// ==========================================
const crear = async (nombre, email) => {
    try {
        const resultado = await pool.query(
            'INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING *',
            [nombre, email]
            //              ↑ RETURNING * devuelve el registro recién creado
        );
        return resultado.rows[0];
    } catch (error) {
        console.error(' Error al crear usuario:', error.message);
        throw error;
    }
};

// ==========================================
// 4. ACTUALIZAR
// ==========================================
const actualizar = async (id, nombre) => {
    try {
        const resultado = await pool.query(
            'UPDATE usuarios SET nombre = $1 WHERE id = $2 RETURNING *',
            [nombre, id]
        );
        return resultado.rows[0];
    } catch (error) {
        console.error(' Error al actualizar usuario:', error.message);
        throw error;
    }
};

// ==========================================
// 5. ELIMINAR
// ==========================================
const eliminar = async (id) => {
    try {
        await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
        console.log(` Usuario ${id} eliminado`);
    } catch (error) {
        console.error(' Error al eliminar usuario:', error.message);
        throw error;
    }
};

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };