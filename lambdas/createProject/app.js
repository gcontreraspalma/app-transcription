// createProject.js
const connectToDatabase = require('./utils/mongooseClient');
const Project = require('./models/Project');
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

        // Obtener los datos del cuerpo de la solicitud
        const { title, description } = JSON.parse(event.body);

        // Validar que se proporcionó un título
        if (!title) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'El título es requerido' }),
            };
        }

        // Crear un nuevo proyecto
        const project = new Project({
            title,
            description,
            userId: decoded.id, 
        });

        // Guardar el proyecto en la base de datos
        await project.save();

        return {
            statusCode: 201,
            body: JSON.stringify({ 
                message: 'Proyecto creado exitosamente',
                project: {
                    id: project._id,
                    title: project.title,
                    description: project.description
                } 
            }),
        };
    } catch (error) {
        console.error('Error al crear el proyecto:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor' }),
        };
    }
};