const authController = require("../controllers/AutheticationController");
const middlewareController = require("../controllers/middlewareController");

const router = require("express").Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/refresh", authController.requestRefreshToken);

router.post("/logout", middlewareController.verifyToken, authController.logout);

module.exports = router;
