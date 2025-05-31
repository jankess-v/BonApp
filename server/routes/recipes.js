const express = require("express");
const { getUserRecipes, getRecipe, createRecipe,
    updateRecipe, deleteRecipe, getPublicRecipes} = require("../controllers/recipeController")
const auth = require("../middleware/auth")
const { upload, handleMulterError, uploadImageToGCS } = require("../middleware/uploadGCS")

const router = express.Router();
//Public
router.get("/public", getPublicRecipes);
//Private
router.get("/my", auth, getUserRecipes);
router.get("/:id", getRecipe);
router.post("/", auth, upload.single("image"), handleMulterError, createRecipe);
// router.post("/", auth, createRecipe)
router.put("/recipe/edit/:id", auth, upload.single("image"), handleMulterError, uploadImageToGCS, updateRecipe)
router.delete("/:id", auth, deleteRecipe);

module.exports = router;