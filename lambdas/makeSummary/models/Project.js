// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    recordingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recording' },
    transcriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transcription' },
    summaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Summary' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);