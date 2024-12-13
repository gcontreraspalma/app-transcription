const connectToDatabase = require('./utils/mongooseClient');
const Project = require('./models/Project');
const Transcription = require('./models/Transcription');  // Suponiendo que tienes este modelo
const Summary = require('./models/Summary');  // Suponiendo que tienes este modelo
const jwt = require('jsonwebtoken');

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

        // Obtener el ID del proyecto desde los parámetros de la solicitud
        const { projectId } = event.queryStringParameters;

        // Verificar si el proyecto existe
        const project = await Project.findOne({ _id: projectId, userId: decoded.id });
        if (!project) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Proyecto no encontrado' }),
            };
        }

        // Eliminar las transcripciones asociadas al proyecto
        await Transcription.deleteMany({ projectId });

        // Eliminar los resúmenes asociados al proyecto
        await Summary.deleteMany({ projectId });

        // Eliminar el proyecto
        await Project.deleteOne({ _id: projectId });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Proyecto y sus asociados eliminados exitosamente' }),
        };

    } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor' }),
        };
    }
};
