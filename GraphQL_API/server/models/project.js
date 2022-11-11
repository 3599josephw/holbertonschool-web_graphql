const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const projectSchema = new Schema({
  title: String,
  weight: Number,
  description: String,
});

module.exports = model('Project', projectSchema);
