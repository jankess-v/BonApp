const express = require("express");
const { getAllUsers, deleteUser } = require("../controllers/userController")
const auth = require("../middleware/auth")

const router = express.Router();

router.get("/all", auth, getAllUsers);
router.delete("/:id", auth, deleteUser);

module.exports = router;