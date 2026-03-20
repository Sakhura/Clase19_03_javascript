const mensajeErrorDB = (err, res) => {
    console.log('Error en la base de datos PostgreSQL: ',{
        codigo: err.code,
        detalle: err.detail,
        tabla: err.table,
    });

    switch (error.code){
         // Valor duplicado — campo UNIQUE violado
        // Ej: email o rut que ya existe en la BD
        case '23505':
            return res.status(409).json({
                status:  'error',
                message: 'El registro ya existe',
                detalle: error.detail,
                data:    null,
            });

        // Campo NOT NULL recibió un valor nulo
        // Ej: insertar un usuario sin nombre
        case '23502':
            return res.status(400).json({
                status:  'error',
                message: 'Faltan campos obligatorios',
                detalle: error.detail,
                data:    null,
            });

        // Violación de llave foránea
        // Ej: insertar una cuenta con un usuario_id que no existe
        case '23503':
            return res.status(400).json({
                status:  'error',
                message: 'El registro relacionado no existe',
                detalle: error.detail,
                data:    null,
            });

        // Tabla no existe
        // Ej: hacer SELECT a una tabla que no fue creada
        case '42P01':
            return res.status(500).json({
                status:  'error',
                message: 'La tabla no existe en la base de datos',
                data:    null,
            });

        // Credenciales incorrectas en el .env
        case '28P01':
            return res.status(500).json({
                status:  'error',
                message: 'Credenciales de base de datos incorrectas',
                data:    null,
            });

        // Cualquier otro error no contemplado
        default:
            return res.status(500).json({
                status:  'error',
                message: 'Error interno en la base de datos',
                data:    null,
            });
    }
    };


module.exports = {
    mensajeErrorDB,
};
