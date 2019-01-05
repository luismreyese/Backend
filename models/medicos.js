var mongoose = require('mongoose');
var validator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var medicoSchema = new Schema({
    nombre: {type: String, required: [true, 'El nombre es Necesario']},
    img: {type: String, required:false},
    usuario: {type: Schema.Types.ObjectId, ref: 'usuario' },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital',required: [true, 'El Id del Hospital es Necesario']} });

module.exports = mongoose.model('Medico',medicoSchema);