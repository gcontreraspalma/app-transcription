// getProjects.js
const connectToDatabase = require('./mongooseClient');
const Project = require('./models/Project');

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

        // Obtener los proyectos del usuario autenticado sin necesidad de "populate"
        const projects = await Project.find({ userId: decoded.id }).select('title description'); // Solo traemos 'title' y 'description'

        return {
            statusCode: 200,
            body: JSON.stringify({ projects }),
        };
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor' }),
        };
    }
};