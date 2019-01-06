// los require son igual al import statement

var express   = require('express');
var bcrypt    = require('bcryptjs');
var jwt       = require('jsonwebtoken');
var seed      = require('../config/config').SEED;
var CLIENT_ID = require('../config/config').CLIENT_ID;
var messg     = require('../Messages/mssgservices');
var usuario   = require('../models/usuario');

//===Importaciones para Validacion de Login con Google===
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
//=======================================================

var appLogin = express();

//===Ruta para Validacion de Usuario con Google==========
appLogin.post('/google',async(req,res)=>{
    let idtoken = req.body.token;
    let googleUsr = await verify(idtoken).catch( error =>{
        messg(res,403,error);
    });

// Busca que el usuario autenticado se encuentre creado en la BDD
    usuario.findOne({email: googleUsr.correo},(err,usrMdb)=>{
        if(err){messg(res,500,err);}
// Si el usuario existe y no fue creado por la autenticacion de google, debe pedir Usuario y Password
        if(usrMdb){
            if(usrMdb.google === false){
                messg(res,403,{'mensaje': 'Debe autenticarse por medio de Usuario/Password'});
// Si el usuario existe y l aautenticacion es correcta se genera el token de la aplicación (gestion de servicios)
            }else{
                   var token = jwt.sign({usuario: usrMdb},seed,{expiresIn: 3600});
                   messg(res,200,{'token':token});
            }
        }else{
// El usuario autenticado por Google no existe debe crearse en la base de datos
       let newusr = new usuario();
       newusr.nombre   = googleUsr.nombre;
       newusr.email    = googleUsr.correo;
       newusr.img      = googleUsr.imagen;
       newusr.google   = true;
       newusr.password = ':)';

// guarda el usuario y genera el Token para la aplicación (gestion de servicios)
       newusr.save((error,usrsave)=>{
           if(error) { messg(res,500,{'mensaje': 'error al guardar en la Bdd'});};
           var token = jwt.sign({usuario: usrsave},seed,{expiresIn: 3600});
                   messg(res,200,{'usuario':usrsave,
                                   'token': token});
       } );
       };
    });
});
//=======================================================

//============Ruta para Validacion General ==============
appLogin.post('/', (req,res) => {

    var body = req.body;
    
    usuario.findOne( { email: body.email }, (err,usrBD) => {
        if(err){
            messg(res,500,err);
        //     return res.status(500).json({
        //         Ok: false,
        //         mensaje: 'Error en la lectura de la BDD',
        //         error: err
        // } );
     };
        if(!usrBD) {
            messg(res,404,err);

            // return res.status(404).json({
            //     Ok: true,
            //     mensaje: 'Error en los parametros de Autenticación' } );
        };
        if(!bcrypt.compareSync(body.password, usrBD.password)){

            messg(res,404,err);

            // return res.status(404).json({
            //     Ok: true,
            //     mensaje: 'Error de Autenticación' } );

        }

// Generar Token
        usrBD.password = ';)'
        var token = jwt.sign({usuario: usrBD},seed,{expiresIn: 3600});
        messg(res,200,token);
    //     res.status(200).json({
    //         Ok: true,
    //         usrtoken: token,
    //         mensaje: 'Post Realizado con exito'
    // } );

    });
} );

//=== Funcion para Validacion de Usuario Con Google ===
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
             nombre: payload.name,
             correo: payload.email,
             imagen: payload.picture

    };
  }

//=====================================================
module.exports = appLogin;
