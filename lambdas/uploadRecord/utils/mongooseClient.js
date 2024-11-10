// mongooseClient.js
const mongoose = require('mongoose');

let isConnected = false;

const connectToDatabase = async (uri) => {
    if (isConnected) {
        console.log('Usando conexión existente a MongoDB');
        return;
    }
    
    console.log('Creando una nueva conexión a MongoDB');
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    isConnected = true;
};

module.exports = connectToDatabase;