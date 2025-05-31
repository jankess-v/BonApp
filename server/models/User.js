const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: [true, 'Login jest wymagany'],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 25,
    },
    email: {
        type: String,
        required: [true, 'Email jest wymagany'],
        unique: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Wprowadź poprawny adres email"],
    },
    password: {
        type: String,
        required: [true, 'Hasło jest wymagane'],
        minlength: [6, 'Hasło musi mieć conajmniej 6 znaków'],
    },
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    recipes: {
        type: Array,
        default: []
    },
    favorites: {
        type: Array,
        default: []
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {timestamps: true});

// Szyfrowanie hasła przed zapisem
userSchema.pre("save", async function (next) {
    // Tylko jeśli hasło zostało zmodyfikowane
    if (!this.isModified("password")) return next()

    try {
        // Generowanie salt i hashowanie hasła
        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }
})

// Metoda do porównywania haseł
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

// Metoda do generowania tokenu JWT
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id}, process.env.JWT_KEY,
        {expiresIn: "7d"})
    return token
}

module.exports = mongoose.model("User", userSchema);