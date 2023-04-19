const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const diskstorage = multer.diskStorage({
    destination: path.join(__dirname,'../images'),
    filename: (req,file,callback)=>{
        callback(null,Date.now()+'-imagekit-'+file.originalname)
    }
})

const fileUpload = multer({
    storage: diskstorage
}).single('image')


router.get('/',(req,res)=>{
    res.send('Bienvenido a mi app de imágenes')
})

// Añadimos la ruta donde se colocan las imágenes
router.post('/images/post', fileUpload, (req,res)=>{
    
    req.getConnection((err, conn)=>{
        if(err) return res. status(500).send('Error en el servidor')
        
        const data = fs.readFileSync(path.join(__dirname, '../images/'+req.file.filename))
        const tipo = req.file.mimetype;
        const nombre = req.file.originalname;

        conn.query('INSERT INTO image set ?',[{tipo, nombre, data }], (err, rows)=>{
            if(err) return res. status(500).send('Error en el servidor');

            res.send('imagen guardada!')
        })

    })
  })

// Ruta para listar las imágenes
// No necesitamos el middleware fileUpload
router.get('/images/get', (req,res)=>{
    
    req.getConnection((err, conn)=>{
        if(err) return res. status(500).send('Error en el servidor')
        
        conn.query('SELECT * FROM image', (err, rows)=>{
            if(err) return res. status(500).send('Error en el servidor');

            rows.map(img =>{
                fs.writeFileSync(path.join(__dirname, '../dbimages/'+img.id+'-imagekit.png'),img.data)
            })

            // Obtenemos las imágenes del directorio

            const imagedir = fs.readdirSync(path.join(__dirname,'../dbimages/'))

            // Damos respuesta a la máquina cliente
            res.json(imagedir);

        })

    })
  })


  // Ruta para eliminar las imágenes
  // No necesitamos el middleware fileUpload
router.delete('/images/delete/:id', (req,res)=>{
    
    req.getConnection((err, conn)=>{
        if(err) return res. status(500).send('Error en el servidor')
        
        conn.query('DELETE FROM image WHERE id=?',[req.params.id], (err, rows)=>{
            if(err) return res. status(500).send('Error en el servidor');

            fs.unlinkSync(path.join(__dirname, '../dbimages/'+req.params.id+'-imagekit.png'))

            // Damos respuesta a la máquina cliente
            res.send('Imagen eliminada correctamente');
        })
     })
  })

module.exports =router;