const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Configurar EJS como motor de vistas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/crear', (req, res) => {
  res.sendFile(__dirname + '/public/form.html');
});
app.post('/guardar', (req, res) => {
  const data = `Nombre: ${req.body.nombre}, Correo: ${req.body.correo}, Mensaje: ${req.body.mensaje}, Mensaje2: ${req.body.mensaje2}\n`;

  fs.appendFile('datos.txt', data, (err) => {
    if (err) throw err;
    console.log('Datos guardados en datos.txt');
    
    // Redirigir al usuario al índice después de guardar
    res.redirect('/');
  });
});

app.get('/visualizar', (req, res) => {
  fs.readFile('datos.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.send('Error al leer los datos.');
    } else {
      const lines = data.split('\n');
      res.render('resultados', { datos: lines });
    }
  });
});

// Ruta para mostrar la página de confirmación de eliminación
app.get('/borrar', (req, res) => {
  res.sendFile(__dirname + '/public/borrar.html');
});

// Ruta para realizar la eliminación de datos
app.post('/borrar', (req, res) => {
  fs.writeFile('datos.txt', '', (err) => {
    if (err) {
      console.error(err);
      res.send('Error al borrar los datos.');
    } else {
      console.log('Datos borrados de datos.txt');
      res.redirect('/');
    }
  });
});

app.listen(port, () => {
  console.log(`La aplicación está escuchando en el puerto ${port}`);
});
