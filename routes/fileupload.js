
var express    = require('express');
var fileUpload = require('express-fileupload');
var modelUsr   = require('../models/usuario');
var modelMed   = require('../models/medicos');
var modelHsl   = require('../models/hospital');
var mssges     = require('../Messages/mssgservices')
var fs         = require('fs');

var upload     = express();
var arraycol   = ['usuarios','medicos','hospitales'];
var arrayext   = ['jpg','imp','jpeg','gif','tif','png','JPG','IMP','JPG','GIF','TIF','PNG'];
var arrayName  = [];
var extension;
var fileName;
var coleccion;
var id;
var newname;


upload.use(fileUpload());

upload.put('/:coleccion/:id',(req,res,next) => {

coleccion = req.params.coleccion;
id        = req.params.id;

    if(!req.files){
        mssges(res,400,{Error: 'No existe ningun Archivo'});
    }

    if (arraycol.indexOf(coleccion) <= 0){
        mssges(res,403,{ Ok: false,
                         Error: `Extensión ${coleccion} no permitida`});
    };

fileName  = req.files.archivo;
arrayName = fileName.name.split('.');

if (fileName){
    extension = arrayName[arrayName.length - 1];
    if (arrayext.indexOf(extension) <= 0){
        mssges(res,403,{ Ok: false,
                         Error: `Extensión ${extension} no permitida`});
    };

// Nombre Personalizado
    newname = `${id}-${new Date().getMilliseconds()}.${extension}`;
    path    = `./uploads/${coleccion}/${newname}`;
    fileName.mv(path,(error) => {
      if (error){
       mssges(res,400,{ 'Ok': false,
                         'path':path,
                         'mensaje': 'Nombre personalizado',
                         'error': error });}
    } );  
 }

 imgColection(res,coleccion,id,newname);

 
} );

function imgColection(res,coleccion,id,filename)
{
  switch (coleccion) {
      case 'usuarios':
          modelUsr.findById(id,(err,user) => {
          if(err){mssges(res,400,{Error: err});};
          if(delOldImg(res,user.img,coleccion)){
            user.img= filename; };  
            user.save((err,userAct) => {
             if (err){mssges(res,400,{Error: err});};
             mssges(res,200,{'usuarioAct': userAct});
            } );
        });
          break;
      case 'hospitales':
          modelHsl.findById(id,(err,hsptl)=>{
            if(err){mssges(res,400,{Error: err});};
            if(delOldImg(res,hsptl.img,coleccion)){
                hsptl.img= filename; 
                hsptl.save((err,hsptlAct) => {
                    if (err){mssges(res,400,{Error: err});};
                    mssges(res,200,{'usuarioAct': hsptlAct});
                   } );
            };  });
          break;
      case 'medicos':
          modelMed.findById(id,(err,medics)=>{
            if(err){mssges(res,400,{Error: err});};
            if(delOldImg(res,medics.img,coleccion)){
                medics.img= filename; 
                medics.save((err,medicsAct) => {
                    if (err){mssges(res,400,{Error: err});};
                    mssges(res,200,{'usuarioAct': medicsAct});
                   } );}; });
          break;
      default:
           mssges(res,500,{Error:'Coleccion no valida'})
          break;
  }

};

function delOldImg(res,img,coleccion) {
    var oldPath = `./uploads/${coleccion}/${img}`;
   if(fs.existsSync(oldPath)){
       fs.unlink(oldPath,(error)=>{
        if(error){
            mssges(res,500,{'mensaje': 'Error en eliminacion del archivo',
                            'error'  : error}); 
        }
       });
   }else{
    mssges(res,400,{'mensaje': 'Error en la ruta del acceso',
                    'path'   : oldPath}); 
   };
   return true;
};

module.exports = upload; 