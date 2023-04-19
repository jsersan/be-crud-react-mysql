const express = require('express');
const mysql = require('mysql');
const myconn = require('express-myconnection');
const path = require('path');

const cors = require('cors');

const app = express();

app.use(myconn(mysql,{
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'images'
}))
app.use(cors());

// Para hacer que dbimages sea una carpeta estática accesible desde el navegador:
app.use(express.static(path.join(__dirname,'dbimages')))

app.use(require('./routes/routes'));

app.listen(9000, ()=>{
    console.log('Servidor ejecutándose en el puerto', 'http://localhost:' + 9000);
})