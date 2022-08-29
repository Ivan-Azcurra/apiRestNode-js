// "require" es una función que se usa para importar símbolos desde otros modulos al ámbito actual. El parámetro pasado es el id del módulo. En la implementación de Node.
var express = require("express");
var mysql = require("mysql");

var cors = require("cors");

var app = express();

// Con esto le decimos a la aplición que vamos a usar JSON.
app.use(express.json());
app.use(cors());

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
// Mostrar todos los articulos.
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
  conexion.query(
    "SELECT * FROM articulos WHERE id = ?",
    [req.params.id],
    (error, fila) => {
      if (error) {
        // si hay un error lo capturamos y lo mostramos "throw"
        throw error;
      } else {
        res.send(fila);
        // res.send(fila[0].descripcion);
      }
    }
  );
});

// metodo crear articulo
app.post("/api/articulos", (req, res) => {
  //dentro de este obj van a estar todos los valores que le vamos a mandar la sentencia sql.
  // los valores de las "keys - llaves", se van a cargar desde postman con el parametro "req" -body = son los datos cargados en el cuerpo de la petición --body. y el valor cargado en postman.
  let data = {
    descripcion: req.body.descripcion,
    precio: req.body.precio,
    stock: req.body.stock,
  };

  let sql = "INSERT INTO articulos SET ?";
  // sentencia sql para crear un nuevo articulo en la tabla "articulos" / SET, para setear los campos a llenar. Con "?" definimos los los parametros (descripcion, precio, stock)
  conexion.query(sql, data, function (error, results) {
    if (error) {
      // si hay un error lo capturamos y lo mostramos "throw"
      throw error;
    } else {
      res.send(results);
    }
  });
});

// Editar articulo
// parametros req "request"/ res "response"
// req = a la consuta enviada desde postman / res = la respuesta de postman
app.put("/api/articulos/:id", (req, res) => {
  //necesitamos pasar el id y los valores que vamos a actualizar.
  let id = req.params.id;
  let descripcion = req.body.descripcion; //body contiene los datos de la "request"
  let precio = req.body.precio;
  let stock = req.body.stock;
  let sql =
    "UPDATE articulos SET descripcion = ?, precio = ?, stock = ? WHERE id = ?";
  // "?" va a tomar los valores de las variables delcaradas al principio y va a actualizar los valores "WHERE", cuando el "id" sea igual al que estamos ingresando en la ruta.

  // en el array estan los valores que capturamos.
  conexion.query(
    sql,
    [descripcion, precio, stock, id],
    function (error, results) {
      if (error) {
        // si hay un error lo capturamos y lo mostramos "throw"
        throw error;
      } else {
        res.send(results);
      }
    }
  );
});

// Eliminar articulo
app.delete("/api/articulos/:id", (req, res) => {
  conexion.query(
    "DELETE FROM articulos WHERE id = ?",
    [req.params.id],
    function (error, filas) {
      if (error) {
        // si hay un error lo capturamos y lo mostramos "throw"
        throw error;
      } else {
        res.send(filas);
      }
    }
  );
  // elimina el articulo "WHERE" cuando "?" coincidan los "/:id"
});

// Variable de entorno (al parece se definen en MAYUSCULAS)
const puerto = process.env.PUERTO || 3000; //se va ejecutar en el puerto 7000, si está disponible de lo contrario lo hará en el 3000.

// --SETEAR VARIABLE DE ENTORNO EN WINDOWS DESDE UN TERMINA(consola) =
// set PUERTO(nombre de la variable .env)=7000 u otro valor "númerico?"
app.listen(puerto, function () {
  console.log("Servidor Ok en puerto: " + puerto);
});
