var jwt        = require('jsonwebtoken');
var seed       = require('../config/config').SEED;

exports.verificaToken = function (req,res,next) {
    
    var token = req.query.token;

    jwt.verify(token,seed,(err,decoded) => {
        if (err) {
            return res.status(401).json({
                Ok: false,
                mensaje: 'Error validando el token'
                });
        
        };
        req.usuario = decoded.usuario; // Se agraga el atributo usuario en el request para que este disponible despues de la
                                       // verificacion del token
        next();


    } );
}
