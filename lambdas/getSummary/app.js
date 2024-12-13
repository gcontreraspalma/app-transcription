// getProjects.js
const connectToDatabase = require('./utils/mongooseClient');
const Summary = require('./models/Summary');
const jwt = require('jsonwebtoken');



exports.handler = async (event) => {
    
    try {
        // Verificar que el token JWT esté presente
        const token = event.headers.authorization?.split(' ')[1];
        if (!token) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Token no proporcionado' }),
            };
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Token inválido o expirado' }),
            };
        }
        
        // Obtener el projectId desde los parámetros de la consulta
        const { projectId } = event.queryStringParameters;
        // Conectar a la base de datos
        await connectToDatabase(process.env.MONGODB_URI);
        
        const summary = await Summary.findOne({ projectId, userId: decoded.id, inProgress: false });

        if (!summary) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Resumen no encontrado' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ summary }),
        };
    } catch (error) {
        console.error('Error al obtener transcripciones:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor' }),
        };
    }
};