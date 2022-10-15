const usersRoutes = require('express').Router();
const users = require('../controllers/users.controller');
const { validaToken } = require('../middlewares/auth');

usersRoutes.get("/all", users.findAll);
usersRoutes.get("/show/:id",validaToken, users.findOne);
usersRoutes.post("/create",users.create);
usersRoutes.put("/update",validaToken, users.update);
usersRoutes.delete("/delete/:id",validaToken, users.delete);
usersRoutes.post("/login", users.login);
usersRoutes.put("/recovery", users.recoverypassword);
usersRoutes.put("/updatepassword", users.updatepassword);


module.exports = usersRoutes;