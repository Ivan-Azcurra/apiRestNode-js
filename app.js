// "require" es una función que se usa para importar símbolos desde otros modulos al ámbito actual. El parámetro pasado es el id del módulo. En la implementación de Node.
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

// me faltaba un "/" en la ruta del get.
// mostrar todos los articulos.
app.get("/api/articulos", (req, res) => {
  // "query" consulta a la DB
  conexion.query("SELECT * FROM articulos", (error, filas) => {
    if (error) {
      // si hay un error lo capturamos y lo mostramos "throw"
      throw error;
    } else {
      res.send(filas);
    }
  });
});

// mostrar un SOLO artículo mediante "id", se agrega a la ruta el "/:id"
app.get("/api/articulos/:id", (req, res) => {
    // "query" consulta a la DB
    // en la sentencion de abajo debemos usar la clausula "WHERE"
    // cuando en la ruta coloquemos un id, el mismo va a ocupar el lugar de "?"
    // req.params = es el parametro que especificamos en la ruta, en este caso es "/:id"
    conexion.query("SELECT * FROM articulos WHERE id = ?", [req.params.id], (error, fila) => {
      if (error) {
        // si hay un error lo capturamos y lo mostramos "throw"
        throw error;
      } else {
        // res.send(fila);
        res.send(fila[0].descripcion);
      }
    });
  });

  app.post('/api/articulos', (req, res)=>{
    //dentro de este obj van a estar todos los valores que le vamos a mandar la sentencia sql.
      let data = {
    // los valores de las "keys - llaves", se van a cargar desde postman con el parametro "req" -body = son los datos cargados en el cuerpo de la petición --body. y el valor cargado en postman. 
        descripcion:req.body.descripcion, 
        precio:req.body.precio, 
        stock:req.body.stock}
    conexion.query(sql, data, function(error, results){

    });
  });


// Variable de entorno (al parece se definen en MAYUSCULAS)
const puerto = process.env.PUERTO || 3000; //se va ejecutar en el puerto 7000, si está disponible de lo contrario lo hará en el 3000.

// --SETEAR VARIABLE DE ENTORNO EN WINDOWS DESDE UN TERMINA(consola) =
// set PUERTO(nombre de la variable .env)=7000 u otro valor "númerico?"
app.listen(puerto, function () {
  console.log("Servidor Ok en puerto: " + puerto);
});
