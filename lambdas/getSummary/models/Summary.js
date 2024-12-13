// models/Summary.js
const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
    summary: { type: String, required: true }, 
    inProgress: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Summary', summarySchema);