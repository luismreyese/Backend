
var express  = require('express');
var messages = require('../Messages/mssgservices');

var dataUsr = require('../models/usuario');
var datahsl = require('../models/hospital');
var datamed = require('../models/medicos');

var routeSearch = express();

//================================
// Busqueda - Usuarios
//================================
routeSearch.get('/coleccion/:tabla/:busqueda',(req,res) =>{
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    
    var regExp = RegExp(busqueda,'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa =  searchUsr(regExp);
        //               .then(data =>{
        //         messages( res,200,{ok: true,
        //                            usurios: data } );
        //     } )
        //                      .catch(err => { messages( res,400,{ok: false,
        //                         error: err }); } );
            break;
        case 'medicos':
        promesa =  searchMed(regExp);
            break;
        case 'hospitales':
        promesa =  searchHsl(regExp);
            break;
        default:
            messages( res,404,{ok: false,
                               error: 'Ruta no valida' });
           break;
    };
    promesa.then(data =>{
                messages( res,200,{ok: true,
                                   datos: data } );
            } )
            .catch(err => { messages( res,400,{ok: false,
                                               error: err }); } );
}
);

//================================
// Busqueda General - Medicos
//================================

//================================
// Busqueda General - Hospitales
//================================


//================================
// Busqueda General
//================================
routeSearch.get('/',(req,res) =>{
 
    var busqueda = req.query.busqueda;
    var regExp = new RegExp( busqueda,'i');

    Promise.all([searchUsr(regExp),searchHsl(regExp),searchMed(regExp)])
           .then( respuestas => {
            messages( res,200,{ok: true,
                   hospitales: respuestas[1],
                   medicos: respuestas[2],
                   usurios: respuestas[0]});
           } )
           .catch( errores => { 
            messages( res,400,{ok: false,
                               errorHsl: errores[1],
                               errorMed: errores[2],
                               errorusr: errores[0] });
           } );

} );

function searchUsr(regExp) {

    return new Promise((resolve,reject) => {
        dataUsr.find({},'nombre email role')
               .or([{'nombre': regExp},{'email': regExp}])
               .exec((err,response) => {
            if (err){
                reject('Error en la busqueda de usaurios',err);
            } else {
                resolve(response);
            }
        } )
    }); 
}

function searchHsl(regExp) {
    return new Promise((resolve,reject) => {
        datahsl.find({ nombre: regExp})
               .populate('usuario','nombre')
               .exec((err,response) =>{
               if(err){ reject('Error en la busqueda de Hospitales',err);}
               else{    resolve(response); };
               })
    } );
    
}
function searchMed(regExp) {
    return new Promise((resolve,reject) => {
        datamed.find({ nombre: regExp})
               .populate('usuario','nombre email')
               .populate('hospital','nombre')
               .exec((err,response) =>{
               if(err){ reject('Error en la busqueda de Hospitales',err);}
               else{    resolve(response); };
               })
    } );
}

module.exports = routeSearch;