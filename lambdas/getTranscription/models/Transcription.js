// models/Transcription.js
const mongoose = require('mongoose');

const transcriptionSchema = new mongoose.Schema({
    text: { type: String, required: true }, // El texto de la transcripción
    createdAt: { type: Date, default: Date.now },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, // Relación con el proyecto
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Transcription', transcriptionSchema);