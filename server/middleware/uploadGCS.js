const multer = require("multer")
const path = require("path")
const { uploadToGCS, deleteFromGCS } = require("../config/gcs")

// Konfiguracja multer do przechowywania w pamięci
const storage = multer.memoryStorage()

// Filtr plików - tylko obrazy
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Nieprawidłowy typ. Tylko JPEG, PNG i WebP są dozwolone."), false)
    }
}

// Konfiguracja multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1, // Tylko jedno zdjęcie
    },
    fileFilter: fileFilter,
})

// Middleware do obsługi błędów multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "File too large. Maximum size is 5MB.",
            })
        }
        if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                success: false,
                message: "Only one image per recipe is allowed.",
            })
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                success: false,
                message: "Unexpected field name for file upload.",
            })
        }
    }

    if (err.message.includes("Invalid file type")) {
        return res.status(400).json({
            success: false,
            message: err.message,
        })
    }

    next(err)
}

// Middleware do upload do GCS
const uploadImageToGCS = async (req, res, next) => {
    try {
        if (!req.file) {
            return next() // Brak pliku, kontynuuj
        }

        // Sprawdzenie czy recipeId jest dostępne (dla update)
        const recipeId = req.params.id || req.body.recipeId

        if (!recipeId) {
            return res.status(400).json({
                success: false,
                message: "Recipe ID is required for image upload",
            })
        }

        // Generowanie nazwy pliku: recipeId.extension
        const extension = path.extname(req.file.originalname).toLowerCase()
        const gcsFileName = `${recipeId}${extension}`

        // Upload do GCS
        const uploadResult = await uploadToGCS(req.file.buffer, gcsFileName, req.file.mimetype)

        // Dodanie informacji o pliku do request
        req.uploadedImage = {
            filename: gcsFileName,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            url: uploadResult.publicUrl,
            gcsFileName: uploadResult.gcsFileName,
        }

        next()
    } catch (error) {
        console.error("Error uploading image to GCS:", error)
        res.status(500).json({
            success: false,
            message: "Error uploading image",
        })
    }
}

// Middleware do usuwania starego zdjęcia przy update
const deleteOldImageFromGCS = async (oldGcsFileName) => {
    try {
        if (oldGcsFileName) {
            await deleteFromGCS(oldGcsFileName)
        }
    } catch (error) {
        console.error("Error deleting old image:", error)
        // Nie przerywamy procesu jeśli usuwanie się nie powiedzie
    }
}

module.exports = {
    upload,
    handleMulterError,
    uploadImageToGCS,
    deleteOldImageFromGCS,
}
