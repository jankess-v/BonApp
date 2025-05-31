const express = require("express")
const { uploadRecipeImage, deleteRecipeImage } = require("../controllers/imageController")
const { upload, handleMulterError } = require("../middleware/uploadGCS")
const auth = require("../middleware/auth")

const router = express.Router()


router.post("/recipes", uploadRecipeImage)

router.delete("/recipes/:recipeId", auth, deleteRecipeImage)

module.exports = router