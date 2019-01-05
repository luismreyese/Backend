var mongoose = require('mongoose');
var validator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
    nombre: {type: String, required: [true, 'El nombre es Necesario']},
    img: {type: String, required:false},
    usuario: {type: Schema.Types.ObjectId, ref: 'usuario' },
},{collection:'hospitales'});

module.exports = mongoose.model('Hospital',hospitalSchema);