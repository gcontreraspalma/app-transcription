const connectToDatabase = require('./utils/mongooseClient');
const User = require('./models/User');

exports.handler = async (event) => {
    try {
        // Conectar a la base de datos usando mongooseClient
        await connectToDatabase(process.env.MONGODB_URI);

        // Parsear el cuerpo de la solicitud
        const body = JSON.parse(event.body);

        const { name, email, password } = body;

        // Validar los datos proporcionados
        if (!name || !email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Todos los campos (name, email, password) son requeridos',
                }),
            };
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return {
                statusCode: 409,
                body: JSON.stringify({ message: 'El correo electrónico ya está registrado' }),
            };
        }

        // Crear el nuevo usuario
        const user = new User({ name, email, password });
        await user.save();

        // Retornar la respuesta exitosa
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Usuario registrado exitosamente',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            }),
        };
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor' }),
        };
    }
};
