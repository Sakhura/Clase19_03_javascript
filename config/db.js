const { Pool , Client } = require('pg');
require('dotenv').config();

// Configuración de la conexión a la base de datos
const credenciales = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

// conn client
const conectarClient = async () => {
    const client = new Client(credenciales);
    try {
        await client.connect(); 
        console.log('Cliente conectado a la base de datos');

        const resultado = await client.query('SELECT NOW()');
        console.log('Hora actual desde la base de datos:', resultado.rows[0].now);
    } catch (error) {
        console.error('Error al conectar al cliente:', error.message);
    } finally {
        await client.end();
        console.log('Cliente desconectado');
    }
};

//conn pool
const pool = new Pool({...credenciales,
    max: 20, // número máximo de conexiones en el pool
    idleTimeoutMillis: 30000, // tiempo máximo que una conexión puede estar inactiva antes de ser cerrada
    connectionTimeoutMillis: 2000 // tiempo máximo para establecer una conexión antes de lanzar un error
});

pool.on('error', (err) => {
    console.error('Error en el pool de conexiones:', err.message);
    process.exit(-1); // salir del proceso si el pool tiene un error crítico
});

pool.on('connect', () => {
    console.log('Nueva conexión establecida en el pool');
});

pool.on('remove', () => {
    console.log('Conexión eliminada del pool');
});

const probarPool = async () => {
    try {
        const conn = await pool.query('SELECT NOW()');
        console.log('Hora actual desde el pool:', conn.rows[0].now);

        const resultado = await pool.query('SELECT * FROM usuarios');
        console.log('Usuarios obtenidos desde el pool:', resultado.rows);

        conn.release(); // liberar la conexión de vuelta al pool    
        console.log('Conexión liberada al pool');
    } catch (error) {
        console.error('Error al probar el pool:', error.message);
        process.exit(-1); // salir del proceso si hay un error crítico al probar el pool
    }
};

module.exports = { pool, probarPool, conectarClient };