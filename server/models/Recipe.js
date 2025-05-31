const mongoose = require("mongoose")

const recipeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Tytuł jest wymagany"],
            trim: true,
            maxlength: [100, "Tytuł nie może przekraczać 100 znaków"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Opis nie może przekraczać 500 znaków"],
        },
        ingredients: [
            {
                name: {
                    type: String,
                    required: [true, "Nazwa produktu jest wymagana"],
                    trim: true,
                },
                quantity: {
                    type: Number,
                    required: [true, "Ilość jest wymagana"],
                    min: [0, "Ilość musi być dodatnia"],
                },
                unit: {
                    type: String,
                    default: "szt",
                    enum: ["g", "kg", "ml", "l", "szt", "łyżka", "łyżeczka", "szklanka"],
                },
            },
        ],
        instructions: [
            {
                type: String,
                required: [true, "Kroki nie mogą być puste"],
                trim: true,
            },
        ],
        category: {
            type: String,
            required: [true, "Kategoria jest wymagana"],
            enum: [
                "Śniadanie",
                "Zupy",
                "Dania główne - mięsne",
                "Dania główne - rybne",
                "Dania główne - wegetariańskie",
                "Sałatki",
                "Desery",
                "Napoje",
                "Przekąski",
                "Sosy i dodatki",
            ],
        },
        cookingTime: {
            type: Number,
            min: [0, "Czas gotowania musi być dodatni"],
            max: [1440, "Czas gotowania nie może przekraczać 24h"],
        },
        difficultyLevel: {
            type: String,
            required: [true, "Trudność jest wymagana"],
            enum: ["łatwy", "średni", "zaawansowany"],
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        image: {
            filename: {
                type: String,
            },
            originalName: {
                type: String,
            },
            mimetype: {
                type: String,
            },
            size: {
                type: Number,
            },
            url: {
                type: String,
            },
            gcsFileName: {
                type: String, // Nazwa pliku w GCS (recipeId.extension)
            },
        },
        isPublic: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
)

// Indeksy dla lepszej wydajności
recipeSchema.index({ authorId: 1 })
recipeSchema.index({ category: 1 })
recipeSchema.index({ title: "text", description: "text" })

// Middleware do aktualizacji updatedAt
recipeSchema.pre("save", function (next) {
    if (this.isModified() && !this.isNew) {
        this.updatedAt = Date.now()
    }
    next()
})

module.exports = mongoose.model("Recipe", recipeSchema)
