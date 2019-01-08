
var express    = require('express');
var bcrypt     = require('bcryptjs');

var chkToken   = require('../Middleware/checktocken');
var messg      = require('../Messages/mssgservices');

var appMedicos  = express();
var appHospital = require('../routes/hospitales')
var dataHosptl  = require('../models/hospital');
var dataMedics  = require('../models/medicos');
 
var salt = bcrypt.genSaltSync(10);
// Rutas

// ============================================
// Obtiene todos los medicos Creados de la Bdd
// ============================================
// appMedicos.get('/',chkToken.verificaToken,(Request,Response) => {
 appMedicos.get('/', (Request,Response) => {

    var desde  = Request.query.desde  || 0;
    desde  = Number( desde );
    var limite  = Request.query.limite  || 1;
    limite  = Number( limite );

    dataMedics.find({ },'nombre hospital img' )
              .populate('usuario','nombre email')
              .populate('hospital', 'nombre')
              .skip(desde)
              .limit(limite)
              .exec( (err,data) => {
                if (err) {
                    messg(Response,500,err);return;
                };
                dataMedics.count({ },(err,counter) => {messg(Response,200,{ noRegistros: counter,
                                                                            medicos: data});return; });
            }
            )
        } );

// ============================================
// Validar Token
// Se crea una funcion que recibe como parametros el Request, Response y el Next
// Posteriormente se coloca como segundo parametro en los llamados
// ============================================

// ============================================
// Actualiza datos de un medico en la Bdd
// ============================================

appMedicos.put('/:id', chkToken.verificaToken ,(req,res) => {

    var id   = req.params.id;
    var body = req.body;
    
    dataMedics.findById(id,(err,medicoMdb) => {
        if(err){
               messg(res,500,err);return;
        }

        if(!medicoMdb){
            messg(res,404,{ message: `Error en el ingreso del Id ${id}` });return;
        }

        medicoMdb.nombre   = body.nombre;
        
        dataHosptl.findById(body.hslId,(err,hospitalMdb) => {
            if(err){
                   messg(res,500,err);return;
            }
            if(!hospitalMdb){
                messg(res,404,{ message: `Error en el ingreso del Id ${id}` });return;
            };
        } );
        medicoMdb.hospital   = body.hslId;

        medicoMdb.save((error,medicoUpdate) => {
            if(error){
                messg(res,400,{ message: `Error al actualizar el Medico con el Id ${id}`,
                                error  : error });return;
            }
            messg(res,201,{ message: 'Medico Actualizado',
                            usr: medicoUpdate});return;
        } );
    } );
} );

// ============================================
// Crea los Medicos en la Bdd
// ============================================

appMedicos.post('/',chkToken.verificaToken,(req, res) => {

    var body = req.body;  // Solamente funciona al configurar el body parser en el app.js

    var medics = new dataMedics ({
        nombre:   body.nombre,
        img:      body.img,
        usuario:  req.usuario._id
    });

    dataHosptl.findById(body.hslId,(err,hospitalMdb) => {
        if(err){
               messg(res,500,err);return;
        }
        if(!hospitalMdb){
            messg(res,404,{ message: `Error en el ingreso del Id ${id}` });return;
        };
    } );
    medics.hospital   = body.hslId;

    medics.save(( err, medicsMDB )=> {
        if (err){
            messg(res,400,err);return;
        };
        messg(res,200,{ message : 'usuario Creado',
                        medico  : medicsMDB,
                        usrToken: req.usuario });return;
    } );
})

// ================================================
// elimina los usuarios en la Bdd por medio del Id
// ================================================

appMedicos.delete('/:id',chkToken.verificaToken,(req, res) => {
    var id = req.params.id;
    dataMedics.findByIdAndRemove(id,(err,respBd) =>{
     if (err) {
        messg(res,500,err);return;
     };

     if ( !respBd ) {
        messg(res,403,{ message: `No existe el usuario con el Id ${id}` });return;
     };

     messg(res,200,{ message: 'Registro eliminado correctamente',
                     resp: respBd});return;
    } );
} );
module.exports = appMedicos;
