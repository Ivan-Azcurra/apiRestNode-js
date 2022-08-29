var express = require("express");
var mysql = require("mysql");

var app = express();

// Establecemos los párametros de conexión con la DB
var conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "articulosdb",
});

// Probando la conexión
conexion.connect(function (error) {
  if (error) {
    throw error;
  } else {
    console.log("Conexión exitosa a la base de datos!");
  }
});

app.get("/", function (req, res) {
  // '/' = significa que el navagedor va acceder a la raiz de nuestro proyecto.
  res.send("Ruta INICIO");
});

// Variable de entorno (al parece se definen en MAYUSCULAS)
const puerto = process.env.PUERTO || 3000; //se va ejecutar en el puerto 7000, si está disponible de lo contrario lo hará en el 3000.

// --SETEAR VARIABLE DE ENTORNO EN WINDOWS DESDE UN TERMINA(consola) =
// set PUERTO(nombre de la variable .env)=7000 u otro valor "númerico?"
app.listen(puerto, function () {
  console.log("Servidor Ok en puerto: " + puerto);
});
