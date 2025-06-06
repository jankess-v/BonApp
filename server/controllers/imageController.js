const { uploadToGCS, deleteFromGCS } = require("../config/gcs")
const Recipe = require("../models/Recipe")
const path = require("path")

// Upload zdjęcia dla przepisu
const uploadRecipeImage = async (req, res) => {
    try {
        // if (!req.file) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Brak zdjęcia",
        //     })
        // }
        //
        const {recipeId} = req.body
        if(recipeId) {
            //
            // if (!recipeId) {
            //     return res.status(400).json({
            //         success: false,
            //         message: "ID przepisu jest wymagane",
            //     })
            // }
            //
            // // Sprawdzenie czy przepis istnieje i należy do użytkownika
            const recipe = await Recipe.findById(recipeId)
            console.log(recipeId)
            if (!recipe) {
                return res.status(404).json({
                    success: false,
                    message: "Nie znaleziono przepisu",
                })
            }

            if (recipe.authorId.toString() !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: "Dostęp zabroniony",
                })
            }

            await deleteFromGCS(recipe.image.gcsFileName)
        }

        // Generowanie nazwy pliku: recipeId.extension
        const extension = path.extname(req.file.originalname).toLowerCase()
        // const gcsFileName = `${recipeId}${extension}`
        const gcsFileName = `IMG_${Date.now()}${extension}`

        // Usunięcie starego zdjęcia jeśli istnieje
        // if (recipe.image && recipe.image.gcsFileName) {
        //     try {
        //         await deleteFromGCS(recipe.image.gcsFileName)
        //     } catch (error) {
        //         console.error("Error deleting old image:", error)
        //     }
        // }

        // Upload nowego zdjęcia
        const uploadResult = await uploadToGCS(req.file.buffer, gcsFileName, req.file.mimetype)

        console.log("uploadResult", uploadResult)

        const imageData = {
            filename: gcsFileName,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            url: uploadResult.publicUrl,
            gcsFileName: uploadResult.gcsFileName,
        }

        // Aktualizacja przepisu z nowym zdjęciem
        // recipe.image = imageData
        // await recipe.save()

        res.status(200).json({
            success: true,
            message: "Przesłano zdjęcie pomyślnie",
            data: { image: imageData },
        })
    } catch (error) {
        console.error("Upload image error:", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

// Usuwanie zdjęcia przepisu
const deleteRecipeImage = async (req, res) => {
    try {
        const { recipeId } = req.params

        if (!recipeId) {
            return res.status(400).json({
                success: false,
                message: "ID przepisu jest wymagane",
            })
        }

        // Sprawdzenie czy przepis istnieje i należy do użytkownika
        const recipe = await Recipe.findById(recipeId)
        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: "Nie znaleziono przepisu",
            })
        }

        if (recipe.authorId.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "Dostęp zabroniony",
            })
        }

        if (!recipe.image || !recipe.image.gcsFileName) {
            return res.status(404).json({
                success: false,
                message: "Brak zdjęcia do usunięcia",
            })
        }

        // Usunięcie z GCS
        await deleteFromGCS(recipe.image.gcsFileName)

        // Usunięcie z bazy danych
        recipe.image = undefined
        await recipe.save()

        res.status(200).json({
            success: true,
            message: "Zdjęcie usunięte pomyślnie",
        })
    } catch (error) {
        console.error("Delete image error:", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

const updateRecipeImage = async (req, res) => {
    try {
        const recipeId = req.params.id
        if(recipeId) {
            // Sprawdzenie czy przepis istnieje i należy do użytkownika
            const recipe = await Recipe.findById(recipeId)
            console.log(recipeId)

            if (!recipe) {
                return res.status(404).json({
                    success: false,
                    message: "Nie znaleziono przepisu",
                })
            }
            console.log(req.user.userId)
            if (recipe.authorId.toString() !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: "Dostęp zabroniony",
                })
            }

            if (recipe.image && recipe.image.gcsFileName) {
                try {
                    await deleteFromGCS(recipe.image.gcsFileName)
                    recipe.image = null
                } catch (error) {
                    console.error("Error deleting image from GCS:", error)
                }
            }
        }

        // Generowanie nazwy pliku: recipeId.extension
        const extension = path.extname(req.file.originalname).toLowerCase()
        // const gcsFileName = `${recipeId}${extension}`
        const gcsFileName = `IMG_${Date.now()}${extension}`

        // Upload nowego zdjęcia
        const uploadResult = await uploadToGCS(req.file.buffer, gcsFileName, req.file.mimetype)

        console.log("uploadResult", uploadResult)

        const imageData = {
            filename: gcsFileName,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            url: uploadResult.publicUrl,
            gcsFileName: uploadResult.gcsFileName,
        }

        res.status(200).json({
            success: true,
            message: "Przesłano zdjęcie pomyślnie",
            data: { image: imageData },
        })
    } catch (error) {
        console.error("Upload image error:", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

module.exports = {
    uploadRecipeImage,
    deleteRecipeImage,
    updateRecipeImage,
}
