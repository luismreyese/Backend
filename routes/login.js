// los require son igual al import statement

var express = require('express');
var bcrypt  = require('bcryptjs');
var jwt     = require('jsonwebtoken');
var seed    = require('../config/config').SEED;

var usuario  = require('../models/usaurio');

var appLogin = express();

appLogin.post('/', (req,res) => {

    var body = req.body;
    
    usuario.findOne( { email: body.email }, (err,usrBD) => {
        if(err){
            return res.status(500).json({
                Ok: false,
                mensaje: 'Error en la lectura de la BDD',
                error: err
        } ); };
        if(!usrBD) {
            return res.status(404).json({
                Ok: true,
                mensaje: 'Error en los parametros de Autenticación' } );
        };
        if(!bcrypt.compareSync(body.password, usrBD.password)){
            return res.status(404).json({
                Ok: true,
                mensaje: 'Error de Autenticación' } );

        }

// Generar Token
        usrBD.password = ';)'
        var token = jwt.sign({usuario: usrBD},seed,{expiresIn: 3600});
        res.status(200).json({
            Ok: true,
            usrtoken: token,
            mensaje: 'Post Realizado con exito'
    } );

    });
} );


module.exports = appLogin;
