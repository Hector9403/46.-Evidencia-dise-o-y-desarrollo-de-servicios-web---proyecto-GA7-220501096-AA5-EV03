const express = require("express");
const UsuarioController = require("../controllers/UsuarioController");
const router = express.Router();

router.get("/", UsuarioController.isLogin, (request, response) => {
  response.render("home", { user: request.user });
});
router.get("/login", UsuarioController.login);
router.post("/login", UsuarioController.loginPOST);

router.get("/usuarios", UsuarioController.index);
router.get("/listar", UsuarioController.listar);

router.get("/create", UsuarioController.create);
router.post("/create", UsuarioController.store);
router.post("/create2", UsuarioController.store2);

router.post("/tasks/delete", UsuarioController.destroy);
router.get("/tasks/eliminar", UsuarioController.eliminar);
router.get("/tasks/edit/:id", UsuarioController.edit);
router.post("/tasks/edit/:id", UsuarioController.update);
router.post("/tasks/edit", UsuarioController.update2);

router.get("/contacto", UsuarioController.isLogin, (request, response) => {
  response.render("contacto", { user: request.user });
});

router.get("/productos", UsuarioController.isLogin, (request, response) => {
  response.render("productos", { user: request.user });
});

router.get("/servicios", UsuarioController.isLogin, (request, response) => {
  response.render("servicios", { user: request.user });
});

router.get("/cirugia",UsuarioController.isLogin, (request, response) => {
  response.render("servicios/cirugia", { user: request.user });
});
router.get("/consulta",UsuarioController.isLogin, (request, response) => {
  response.render("servicios/consulta", { user: request.user });
});
router.get("/vacunacion",UsuarioController.isLogin, (request, response) => {
  response.render("servicios/vacunacion", { user: request.user });
});


router.get("/logout", UsuarioController.logout);



module.exports = router;


