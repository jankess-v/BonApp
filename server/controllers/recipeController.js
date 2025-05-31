const Recipe = require("../models/Recipe")
const mongoose = require("mongoose")
const { deleteFromGCS } = require("../config/gcs")

// Pobieranie wszystkich przepisów użytkownika
const getUserRecipes = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, difficulty, search } = req.query

        // Budowanie filtru
        const filter = { authorId: req.user._id }

        if (category && category !== "all") {
            filter.category = category
        }

        if (difficulty && difficulty !== "all") {
            filter.difficultyLevel = difficulty
        }

        // Wyszukiwanie tekstowe
        if (search) {
            filter.$text = { $search: search }
        }

        const recipes = await Recipe.find(filter)
            .populate("authorId", "username firstName lastName")
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)

        const total = await Recipe.countDocuments(filter)

        res.status(200).json({
            success: true,
            data: {
                recipes,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total,
                },
            },
        })
    } catch (error) {
        console.error("Get user recipes error:", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

// Pobieranie pojedynczego przepisu
const getRecipe = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Nieprawidłowe ID przepisu",
            })
        }

        const recipe = await Recipe.findById(id).populate("authorId", "username firstName lastName")

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: "Nie znaleziono przepisu o podanym ID",
            })
        }


        // // Sprawdzenie czy użytkownik ma dostęp do przepisu
        // if (recipe.authorId._id.toString() !== req.user._id && !recipe.isPublic) {
        //     return res.status(403).json({
        //         success: false,
        //         message: "Dostęp zabroniony",
        //     })
        // }

        res.status(200).json({
            success: true,
            data: { recipe },
        })
    } catch (error) {
        console.error("Get recipe error:", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

// Tworzenie nowego przepisu
const createRecipe = async (req, res) => {
    try {
        const recipeData = {
            ...req.body,
            authorId: req.user._id,
        }

        // Walidacja składników
        if (!recipeData.ingredients || recipeData.ingredients.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Wymagany jest conajmniej jeden składnik",
            })
        }

        // Walidacja instrukcji
        if (!recipeData.instructions || recipeData.instructions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Conajmniej jeden krok jest wymagany",
            })
        }

        const recipe = new Recipe(recipeData)
        await recipe.save()

        if (req.uploadedImage) {
            recipe.image = req.uploadedImage
            await recipe.save()
        }

        // Populate author info
        await recipe.populate("authorId", "username firstName lastName")

        res.status(201).json({
            success: true,
            message: "Przepis utworzony pomyślnie",
            data: { recipe },
        })
    } catch (error) {
        console.error("Create recipe error:", error)

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err) => err.message)
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: messages,
            })
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

// Aktualizacja przepisu
const updateRecipe = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Nieprawidłowe ID przepisu",
            })
        }

        const recipe = await Recipe.findById(id)

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: "Nie znaleziono przepisu o podanym ID",
            })
        }

        // Sprawdzenie czy użytkownik jest autorem przepisu
        if (recipe.authorId.toString() !== req.user._id) {
            return res.status(403).json({
                success: false,
                message: "Dostęp zabroniony",
            })
        }

        // Jeśli jest nowe zdjęcie, usuń stare
        if (req.uploadedImage && recipe.image && recipe.image.gcsFileName) {
            try {
                await deleteFromGCS(recipe.image.gcsFileName)
            } catch (error) {
                console.error("Error deleting old image:", error)
            }
        }

        // Aktualizacja danych
        const updateData = { ...req.body }
        if (req.uploadedImage) {
            updateData.image = req.uploadedImage
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        }).populate("authorId", "username firstName lastName")

        res.status(200).json({
            success: true,
            message: "Przepis edytowany pomyślnie",
            data: { recipe: updatedRecipe },
        })
    } catch (error) {
        console.error("Update recipe error:", error)

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err) => err.message)
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: messages,
            })
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

// Usuwanie przepisu
const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Nieprawidłowe ID przepisu",
            })
        }

        const recipe = await Recipe.findById(id)

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: "Nie znaleziono przepisu o podanym ID",
            })
        }

        // Sprawdzenie czy użytkownik jest autorem przepisu
        if (recipe.authorId.toString() !== req.user._id) {
            return res.status(403).json({
                success: false,
                message: "Dostęp zabroniony",
            })
        }

        // Usunięcie zdjęcia z GCS jeśli istnieje
        if (recipe.image && recipe.image.gcsFileName) {
            try {
                await deleteFromGCS(recipe.image.gcsFileName)
            } catch (error) {
                console.error("Error deleting image from GCS:", error)
            }
        }

        await Recipe.findByIdAndDelete(id)

        res.status(200).json({
            success: true,
            message: "Recipe deleted successfully",
        })
    } catch (error) {
        console.error("Delete recipe error:", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

// Pobieranie publicznych przepisów
const getPublicRecipes = async (req, res) => {
    try {
        const { page = 1, limit = 12, category, difficulty, search } = req.query

        const filter = { isPublic: true }

        if (category && category !== "all") {
            filter.category = category
        }

        if (difficulty && difficulty !== "all") {
            filter.difficultyLevel = difficulty
        }

        if (search) {
            filter.$text = { $search: search }
        }

        const recipes = await Recipe.find(filter)
            .populate("authorId", "username firstName lastName")
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)

        const total = await Recipe.countDocuments(filter)

        res.status(200).json({
            success: true,
            data: {
                recipes,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total,
                },
            },
        })
    } catch (error) {
        console.error("Get public recipes error:", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

module.exports = {
    getUserRecipes,
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getPublicRecipes,
}
