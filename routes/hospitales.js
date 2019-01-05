
var express  = require("express");
var bcrypt   = require("bcryptjs");
var hsmodel  = require("../models/hospital");

var chkToken = require("../Middleware/checktocken");
var messages = require("../Messages/mssgservices");

var appHsptl = express();


// Servicios para realizar CRUD
// C: Create -> POST/
// R: Read   -> GET
// U: Update -> PUT/
// D: Delete -> DELETE

// =======================================
//    Servicio GET - Lectura de datos
// =======================================
appHsptl.get('/',(req,res) => {

    var desde  = req.query.desde  || 0;
    desde  = Number( desde );
    var limite  = req.query.limite  || 1;
    limite  = Number( limite );
    
    hsmodel.find({ },(err,datares)=> {
        if (err){
            messages(res,500,err);
        };

        hsmodel.count({},(err,counter) => {messages(res,200,{ noRegistros:counter,
                                                             hospitales: datares});});
    } ).populate('usuario','nombre email img')
       .skip(desde)
       .limit(limite)
       ;

} );

// ============================================
//  Servicio PUT - actualizacion de datos
//  ACtualiza los Hospitales en la Bdd
// ============================================

appHsptl.put('/:id', chkToken.verificaToken ,(req,res) => {

    var id     = req.params.id;
    var body   = req.body;

    hsmodel.findById(id,(err,hospitalMdb) => {
        if(err){
            messages(res,500,err);
        };
        if(!hospitalMdb){
            messages(res,404,{ message: `Error en el ingreso del Id ${id}` });
        };

        hospitalMdb.nombre  = body.nombre;
        hospitalMdb.usuario = req.usuario._id;

        hospitalMdb.save((error,hospitalUpdate) => {
            if(error){
                messages(res,400,{ message: `Error al actualizar el hospital con el Id ${id}`,
                                   error  : error });
            };
            messages(res,201,{ message: 'Hospital Actualizado',
                               Hospital: hospitalUpdate});
        } );
    } ); 
} );
 
// ============================================
// Crea los Hospitales en la Bdd
// ============================================

appHsptl.post('/',chkToken.verificaToken,(req, res) => {

    var body = req.body;  // Solamente funciona al configurar el body parser en el app.js

    var hospital = new hsmodel ({
        nombre:   body.nombre,
        img:      body.img,
        usuario:  req.usuario._id
    });

    hospital.save(( err, hospitalMDB )=> {
        if (err){
            messages(res,400,err)
        };
        messages(res,200,{ message : 'Hospital Creado',
                        body    : hospitalMDB,
                        usrToken: req.usuario });
    } );
})

// ================================================
// elimina los usuarios en la Bdd por medio del Id
// ================================================

appHsptl.delete('/:id',chkToken.verificaToken,(req, res) => {
    var id = req.params.id;
    hsmodel.findByIdAndRemove(id,(err,respBd) =>{
     if (err) {
        messages(res,500,err);
     };

     if ( !respBd ) {
        messages(res,403,{ message: `No existe el hospital con el Id ${id}` })
     };

     messages(res,200,{ message: 'Registro eliminado correctamente',
                     resp: respBd});
    } );
} );

function getById  (p_id) {
    hsmodel.findById(id,(err,hospitalMdb) => {
        if(err){
            messages(res,500,err)
        }
        if(!hospitalMdb){
            messages(res,404,{ message: `Error en el ingreso del Id ${id}` });
        };

        return hospitalMdb;

} );
 };


module.exports = appHsptl;

