const express = require("express")
const {register, login, verifyToken, getUser, changeUserPassword} = require("../controllers/authController");
const registerValidator = require("../middleware/registerValidator")
const auth = require("../middleware/auth")
const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", login);
// router.get("/verifyToken", verifyToken);
router.get("/me", auth, getUser)
router.patch("/change-password", auth, changeUserPassword)
module.exports = router;