// getTranscription.js
const connectToDatabase = require('./utils/mongooseClient');
const Transcription = require('./models/Transcription');
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

        // Conectar a la base de datos
        await connectToDatabase(process.env.MONGODB_URI);

        // Obtener el projectId desde los parámetros de la consulta
        const { projectId } = event.queryStringParameters;

        if (!projectId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'El ID del proyecto es requerido' }),
            };
        }

        // Obtener la transcripción relacionada con el proyecto
        const transcription = await Transcription.findOne({ projectId });

        // Verificar si se encontró una transcripción
        if (!transcription) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'No se encontró transcripción para este proyecto' }),
            };
        }

        // Responder con la transcripción
        return {
            statusCode: 200,
            body: JSON.stringify({ transcription }),
        };
    } catch (error) {
        console.error('Error al obtener la transcripción:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor' }),
        };
    }
};