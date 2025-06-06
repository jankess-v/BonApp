const User = require("../models/User")
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });

const register = async (req, res) => {
    try {
        const {username, email, password, firstName, lastName} = req.body;

        //Sprawdzanie czy użytkownik istnieje
        const existingUser = await User.findOne({$or: [{email}, {username}]});
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Użytkownik o podanym mailu lub loginie już istnieje'});
        }

        const user = new User({
            username,
            email,
            password,
            firstName,
            lastName,
        })
        //Hashowanie hasła -> Zapisanie do bazy danych
        await user.save()

        const token = user.generateAuthToken()
        user.password = undefined

        res.status(201).json({
            success: true,
            message: "Użytkownik zarejestrowany pomyślnie",
            data: {
                user,
                token,
            },
        })
    } catch (error) {
        console.error("Błąd rejestracji:", error)

        // Obsługa błędów walidacji Mongoose
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

const login = async (req, res) => {
    try {
        const {username, password} = req.body;

        // Walidacja danych wejściowych
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Login i hasło są wymagane",
            })
        }

        const user = await User.findOne({username});
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "Nieprawidłowy login lub hasło"
            })
        }

        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Nieprawidłowy login lub hasło"
            })
        }

        const token = user.generateAuthToken();
        user.password = undefined;
        res.status(200).json({
            success: true,
            message: "Zalogowano",
            data: {
                user,
                token,
            },
        })
    } catch (error) {
        console.error("Login error:", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

const verifyToken = async (req, res) => {
    try {
        const authHeader = req.header("Authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Dostęp zabroniony. Brak tokena.",
            })
        }

        const token = authHeader.substring("Bearer ")

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findById(decoded._id)

        if(!user) {
            res.status(401).json({
                success: false,
                message: "Token wygasł"
            })
        }

        res.status(200).json({
            success: true,
            data: user,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

module.exports = {register, login, verifyToken};