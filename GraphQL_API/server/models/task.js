const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const taskSchema = new Schema({
  title: String,
  weight: Number,
  description: String,
  projectId: String
});

module.exports = model('Task', taskSchema);
