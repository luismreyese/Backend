// Requires -> importaciones en NodeJs
var mongoose = require("mongoose");
var express  = require("express");
var bodyParser = require('body-parser');


// Para utilizar las rutas es necesario importarla
var appRoutes     = require("./routes/app");
var appUsuarios   = require("./routes/usuario");
var routeLogin    = require("./routes/login")
var routeHospital = require("./routes/hospitales");
var routeMedico   = require("./routes/medicos");
var routeBusqueda = require("./routes/busqueda");
var routeUpload   = require('./routes/fileupload');
var routeImg      = require('./routes/img');

// Inicializacion de variable
var app = express();

// CORS

app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "POST, PUT, GET,DELETE, OPTIONS");
        next();
      });

// Conexion a Mongo DB deprecated;

// mongoose.Connection.openUri('mongodb://localhost:2701/HospitalDB', 
//                            (err,Response) => { if (err) throw err;
//                             console.log('Base de datos:\x1b[32m%s\x1b[0m', 'online');
//                         });


// mongoose.connect('mongodb://localhost:27017/HospitalDB',{useMongoClient: true } )
mongoose.connect('mongodb://localhost:27017/HospitalDB')
        .then( () => { console.log('conexion realizada con exito \x1b[32m%s\x1b[0m','HospitalDB')})
        .catch((err) => { console.log('error de conexion',err)});

// **** Otra manera de conectarse *****

// mongoose.connect('mongodb://localhost:27017');

// var db = mongoose.connection;
// db.openUri()
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//  // we're connected!
// });

// middlewhare xxx.use<>

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use('/busqueda',routeBusqueda);
app.use('/hospitales',routeHospital);
app.use('/medicos',routeMedico);
app.use('/usuario',appUsuarios);
app.use('/login',routeLogin);
app.use('/upload',routeUpload);
app.use('/img', routeImg);
app.use('/',appRoutes);

// Escuchar peticiones

app.listen(3000, () => { console.log('Express Server puerto 3000:\x1b[32m%s\x1b[0m', 'online'); } );