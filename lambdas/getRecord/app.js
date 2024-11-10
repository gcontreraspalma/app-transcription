// getRecording.js
const AWS = require('aws-sdk');
const Recording = require('./models/Recording'); // Si usas el modelo
const jwt = require('jsonwebtoken');
const connectToDatabase = require('./utils/mongooseClient'); // Importamos el componente mongooseClient

// Configuración de S3
const s3 = new AWS.S3();

// Lambda Handler
exports.handler = async (event) => {
    try {
        // Verificar que el token JWT esté presente
        const token = event.headers.Authorization?.split(' ')[1];
        if (!token) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Token no proporcionado' }),
            };
        }

        // Decodificar el token JWT
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Token inválido o expirado' }),
            };
        }

        // Conectar a la base de datos usando el mongooseClient
        await connectToDatabase(process.env.MONGODB_URI);

        // Obtener el projectId desde los parámetros de la consulta
        const { projectId } = event.queryStringParameters;

        if (!projectId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'El ID del proyecto es requerido' }),
            };
        }

        // Buscar la grabación en la base de datos
        const recording = await Recording.findOne({ projectId });

        // Si no se encuentra la grabación en la base de datos
        if (!recording) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'No se encontró grabación para este proyecto' }),
            };
        }

        // Obtener la grabación desde S3 usando la URL almacenada en MongoDB
        const s3Params = {
            Bucket: process.env.S3_BUCKET_NAME, // Nombre del bucket S3
            Key: recording.s3Url, // Ruta de la grabación en S3
        };

        // Obtener el archivo de S3
        const s3Object = await s3.getObject(s3Params).promise();

        // Devuelve la URL de S3 o el archivo según sea necesario
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Grabación obtenida correctamente',
                recordingUrl: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${recording.s3Url}`,
            }),
        };
    } catch (error) {
        console.error('Error al obtener la grabación:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor' }),
        };
    }
};