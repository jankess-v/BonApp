const express = require("express")
const {register, login} = require("../controllers/authController");
const registerValidator = require("../middleware/registerValidator")

const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", login);

module.exports = router;