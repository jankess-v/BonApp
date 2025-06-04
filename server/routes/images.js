const express = require("express")
const { uploadRecipeImage, deleteRecipeImage, updateRecipeImage } = require("../controllers/imageController")
const { upload, handleMulterError } = require("../middleware/uploadGCS")
const auth = require("../middleware/auth")

const router = express.Router()


router.post("/recipes", auth, upload.single("image"), handleMulterError, uploadRecipeImage)

router.delete("/recipes/:recipeId", auth, deleteRecipeImage)

router.put("/recipes/:recipeId", auth, upload.single("image"), handleMulterError, updateRecipeImage)

module.exports = router