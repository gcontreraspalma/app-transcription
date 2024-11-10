// mongooseClient.js
const mongoose = require('mongoose');

let cachedConnection = null;

const connectToDatabase = async (uri) => {
    if (cachedConnection) {
        return cachedConnection;
    }

    // Configuraciones recomendadas para evitar advertencias de Mongoose
    mongoose.set('strictQuery', false);
    mongoose.set('strictPopulate', false);

    // Conectar a MongoDB
    cachedConnection = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    return cachedConnection;
};

module.exports = connectToDatabase;