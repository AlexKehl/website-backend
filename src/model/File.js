const { Schema, model } = require('mongoose');

const FileSchema = new Schema({
  path: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
});

module.exports = model('File', FileSchema);
