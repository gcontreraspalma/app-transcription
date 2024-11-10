// login.js
const connectToDatabase = require('./mongooseClient');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
    try {
        // Conectar a la base de datos
        await connectToDatabase(process.env.MONGODB_URI);
        
        const { email, password } = JSON.parse(event.body);

        // Validación de los campos
        if (!email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Email y contraseña son requeridos' }),
            };
        }

        // Busca al usuario
        const user = await User.findOne({ email });
        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Credenciales inválidas' }),
            };
        }

        // Verifica la contraseña
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Credenciales inválidas' }),
            };
        }

        // Genera el JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }  // Configura la expiración según tus necesidades
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Login exitoso',
                token,
            }),
        };
    } catch (error) {
        console.error('Error en login:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor' }),
        };
    }
};