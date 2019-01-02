var express    = require('express');
var bcrypt     = require('bcryptjs');
// var jwt        = require('jsonwebtoken');
// var seed       = require('../config/config').SEED;
var chkToken   = require('../Middleware/checktocken');



var appRoute   = express();
var appUsuario = require('../models/usaurio');


var salt = bcrypt.genSaltSync(10);
// Rutas

// ============================================
// Obtiene todos los usuarios de la Bdd
// ============================================
appRoute.get('/',chkToken.verificaToken,(Request,Response,next) => {

    appUsuario.find({ },'nombre email role img' )
            .exec( (err,data) => {
                if (err) {
                    return Response.status(500).json({
                        Ok: false,
                        mensaje: 'Error cargando usuarios'
                        });
                };
        
                Response.status(200).json({
                    Ok: true,
                    mensaje: 'Listado de Usuarios',
                    usuarios: data,
                    usrToken: Request.usuario
                    });
            }
            );
        } );

// ============================================
// Validar Token
// Se crea una funcion que recibe como parametros el Request, Response y el Next
// Posteriormente se coloca como segundo parametro en los llamados
// ============================================

// ============================================
// ACtualiza los usuarios en la Bdd
// ============================================

appRoute.put('/:id', chkToken.verificaToken ,(req,res) => {

    var id = req.params.id;
    var body = res.body;

    appUsuario.findById(id,(err,usuarioMdb) => {
        if(err){
                return res.status(500).json({
                Ok: false,
                mensaje: `Error en la base de Datos, Id no encontrado ${id}`,
                errors: err,
                });
        }

        if(!usuarioMdb){
                return res.status(404).json({
                Ok: false,
                mensaje: `El usuario no Existe en la base de datos ${id}`,
                errors:{ message: 'Error en el ingreso del Id'}
                });
        }

        usuarioMdb.nombre = body.nombre;
        usuarioMdb.role = body.role;
        usuarioMdb.email = body.email;

        // res.status(200).json({
        //     data: usuarioMdb
        // });

        usuarioMdb.save((error,usuarioUpdate) => {
            if(error){
                return res.status(400).json({
                    Ok: false,
                    mensaje: 'error al actualizar el usuario con',
                    errors: error
                    });
            }
            res.status(200).json({
                Ok: true,
                mensaje: 'Usuario Actualizado',
                data: usuarioUpdate
            });
        } );
    } );
} );

// ============================================
// Crea los usuarios en la Bdd
// ============================================

appRoute.post('/',chkToken.verificaToken,(req, res, next) => {

    var body = req.body;  // Solamente funciona al configurar el body parser en el app.js

    var usuario = new appUsuario ({
        nombre:   body.nombre,
        email:    body.email,
        password: bcrypt.hashSync(body.password, salt),
        img:      body.img,
        role:     body.role
    });

    usuario.save(( err, userMDB )=> {
        if (err){
            return res.status(400).json({
                Ok: false,
                mensaje: 'Error creando usuarios',
                error: err
                });
        };
        res.status(201).json({
            ok: true,
            body: userMDB,
            usrToken: req.usuario
        });
    } );
})

// ================================================
// elimina los usuarios en la Bdd por medio del Id
// ================================================

appRoute.delete('/:id',chkToken.verificaToken,(req, res, next) => {
    var id = req.params.id;
    appUsuario.findByIdAndRemove(id,(err,respBd) =>{
     if (err) {
        return  res.status(404).json({
                                      Ok: false,
                                      mensaje: 'Error al eliminar el registro de la Bdd',
                                      error: err

         });
     };

     if ( !respBd ) {
        return  res.status(403).json({
                                      Ok: false,
                                      mensaje: `No existe el usuario con el Id ${id}`,
                                      error: err

         });
     };


     res.status(200).json({
                            Ok: true,
                            mensaje: 'Registro eliminado correctamente',
                            resp : respBd
     });
    } );
} );


module.exports = appRoute;
