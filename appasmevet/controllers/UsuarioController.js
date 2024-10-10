const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { promisify } = require("util");

let user;
let users;

async function index(req, res) {
  if (req.cookies.jwt) {
    const deco = await promisify(jwt.verify)(
      req.cookies.jwt,
      "secreto" // process.env.JWT_SECRETO
    );

    req.getConnection((err, conn) => {
      conn.query(
        "select * from usuarios where id = ?",
        [deco.id],
        (error, results) => {
          if (error) {
            res.json(error);
          }
          req.user = results[0];
          user = results[0];
        }
      );
    });

    req.getConnection((err, conn) => {
      conn.query("SELECT * FROM usuarios", (err, tasks) => {
        if (err) {
          res.json(err);
        }
        users = tasks;
        req.user = user;
        req.users = tasks;
        res.render("tasks/index", {
          user: user,
          tasks: tasks,
        });
      });
    });
  } else {
    res.redirect('/');
  }
}



async function isLogin(request, response, next) {
  if (request.cookies.jwt) {
    try {
      const deco = await promisify(jwt.verify)(
        request.cookies.jwt,
        'secreto' // process.env.JWT_SECRETO
      );

      request.getConnection((err, conn) => {
        conn.query( "select * from usuarios where id = ?", [deco.id], (error, results) => {
          if (error) {
            response.json(error);
          }
          request.user = results[0];
          user = results[0];
          return next();
        });
      });
    } catch (error) {
      return response.status(500).send({ message: error.message });
    }
  } else {
    response.redirect("/login");
  }
};

function login(req, res) {
  if (req.cookies.jwt) {
    res.redirect("/");
  }else{
    res.render("tasks/login", { alert: false });
  }
}

function loginPOST(request, response) {
  let username = request.body.usuario;
  let password = request.body.password;
  // console.log(`username c:${username}`);
  // console.log(`password c:${password}`);
  // Están vacios los campos entonces?
  if (!username || !password) {
    response.render("tasks/login", {
      alert: true,
      alertTitle: "Advertencia",
      alertMessage: "Ingrese usuario y contraseña",
      alertIcon: "info",
      showConfirmButton: false,
      timer: 1000,
      ruta: "login",
    });
  } else {
    try {
      // Ejecute una consulta SQL que seleccionará la cuenta de la base de datos en función del nombre de usuario y la contraseña especificados
      request.getConnection((err, conn) => {
        conn.query("SELECT * FROM usuarios WHERE usuario = ? and password=?", [username, password], async (error, results, fields) => {
            // Si hay un problema con la consulta, genere el error
            if (error) throw error;
            // Error no se encuentra usuario o la contraseña no coincide
            //if (results.length == 0 || !(await bcryptjs.compare(password, results[0].password))) {
            if (results.length == 0 ) {
              response.render("tasks/login", {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Usuario y contraseña incorrectas",
                alertIcon: "error",
                showConfirmButton: true,
                timer: 900,
                ruta: "login" 
              });
            } else {
              const id = results[0].id;
              // const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {expiresIn: process.env.JWT_TIEMPO_EXPIRA,});
              const token = jwt.sign({ id: id }, 'secreto', {expiresIn: '7d'});
              console.log(username + " - " + token);
              const cookiesOptions = {
                //expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRA * 24 * 60 * 60 * 1000 ),
                expires: new Date( Date.now() + 90 * 24 * 60 * 60 * 1000 ),
                httpOnly: true,
              };
              // nombrar cookie , pasar token y cookies
              response.cookie("jwt", token, cookiesOptions);
              response.render("tasks/login", {
                alert: true,
                alertTitle: "Conexion establecida",
                alertMessage: "Login correcto",
                alertIcon: "success",
                showConfirmButton: false,
                timer: 900, //milisegundos
                ruta: "",
              });
            }
          }
        );
      });
    } catch (error) {
      return response.status(500).send({ message: error.message });
    }
  }
}

function logout (request, response) {
  response.clearCookie("jwt");
  return response.redirect("/");
};

function cirugia (request, response) {
  response.render("servicios/cirugia");
};
function consulta (request, response) {
  response.render("servicios/consulta");
};
function vacunacion (request, response) {
  response.render("servicios/vacunacion");
};
function create(req, res) {
  res.render("tasks/create");
}

async function store(req, res) {
  try {
    const data = req.body;
    //data.password = await bcryptjs.hash(data.password, 8); encriptar contraseña
    req.getConnection((err, conn) => {
      conn.query("INSERT INTO usuarios SET ?", [data], (err, rows) => {
        res.redirect("/usuarios");
      });
    });
  } catch (error) {
    return response.status(500).send({ message: error.message });
  }
}

function destroy(req, res) {
  const id = req.body.id;
  req.getConnection((err, conn) => {
    conn.query("DELETE FROM usuarios WHERE id = ?", [id], (err, rows) => {
      res.redirect("/usuarios");
    });
  });
}

function eliminar(req, res) {
  const id = req.body.id;
  req.getConnection((err, conn) => {
    conn.query("DELETE FROM usuarios WHERE id = ?", [id], (err, rows) => {
      res.send("Registro eliminado");
    });
  });
}

async function edit(req, res) {
  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM usuarios WHERE id = ?", [req.params.id], async (err, tasks) => {
      if (err) {
        res.json(err);
      }
      res.render("tasks/edit", { tasks });
    });
  });
}

async function update(req, res) {
  const id = req.params.id;
  const data = req.body;
  //data.password = await bcryptjs.hash(data.password, 8); encriptar contraseña

  req.getConnection((err, conn) => {
    conn.query(
      "UPDATE usuarios SET ? WHERE id = ?", [data, id], (err, rows) => {
        res.redirect("/usuarios");
      }
    );
  });
}

function update2(req, res) {
  const data = req.body;
  const id = data.id;
  req.getConnection((err, conn) => {
    conn.query(
      "UPDATE usuarios SET ? WHERE id = ?",
      [data, id],
      (err, rows) => {
        res.send("El registro se ha actualizado");
      }
    );
  });
}

function contacto(req, res) {
  request.user = user;
  res.render("contacto");
}

function productos(req, res) {
  request.user = user;
  res.render("productos");
}

function servicios(request, response) {
  request.user = user;
  response.render("servicios");
}


async function listar(req, res) {
  req.getConnection((err, conn) => {
    conn.query("select * from usuarios", (error, results) => {
      if (error) {
        res.json(error);
      }
      res.send(results);
    });
  });
}

async function store2(req, res) {
  try {
    const data = req.body;
    var r;
    //data.password = await bcryptjs.hash(data.password, 8); encriptar contraseña
    req.getConnection((err, conn) => {
      conn.query("INSERT INTO usuarios SET ?", [data], (err, rows) => {
        r = rows;
        const aux = {
           "id": r.insertId,
           "usuario": data.usuario,
           "password":data.password,
           "email":data.email,
           "nombre":data.nombre,
           "cedula":data.cedula,
         }
         res.send(aux)
      });
    });

  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

module.exports = {
  index: index,
  create: create,
  store: store,
  store2: store2,
  destroy: destroy,
  eliminar:eliminar,
  edit: edit,
  update: update,
  update2:update2,
  login: login,
  loginPOST: loginPOST,
  isLogin: isLogin,
  logout: logout,
  contacto: contacto,
  productos: productos,
  servicios: servicios,
  cirugia: cirugia,
  consulta: consulta,
  vacunacion: vacunacion,
  listar:listar
};
