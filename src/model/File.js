const { Schema, model } = require('mongoose');

const FileSchema = new Schema({
  path: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  description: { type: String },
});

module.exports = model('File', FileSchema);
