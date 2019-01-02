// Requires -> importaciones en NodeJs
var mongoose = require("mongoose");
var express  = require("express");
var bodyParser = require('body-parser');


// Para utilizar las rutas es necesario importarla
var appRoutes   = require("./routes/app");
var appUsuarios = require("./routes/usuario");
var routeLogin    = require("./routes/login")

// Inicializacion de variable
var app = express();

// Conexion a Mongo DB deprecated;

// mongoose.Connection.openUri('mongodb://localhost:2701/HospitalDB', 
//                            (err,Response) => { if (err) throw err;
//                             console.log('Base de datos:\x1b[32m%s\x1b[0m', 'online');
//                         });


// mongoose.connect('mongodb://localhost:27017/HospitalDB',{useMongoClient: true } )
mongoose.connect('mongodb://localhost:27017/HospitalDB',{useMongoClient: true })
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
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use('/usuario',appUsuarios);
app.use('/login',routeLogin);
app.use('/',appRoutes);

// Escuchar peticiones

app.listen(3000, () => { console.log('Express Server puerto 3000:\x1b[32m%s\x1b[0m', 'online'); } );