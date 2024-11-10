// models/Recording.js
const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
    s3Url: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Recording = mongoose.model('Recording', recordingSchema);

module.exports = Recording;