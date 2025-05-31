const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
    try {
        // Pobieranie tokenu z nagłówka
        const authHeader = req.header("Authorization")
        // console.log("Otrzymany nagłówek Authorization:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Dostęp zabroniony. Brak tokena.",
            })
        }

        const token = authHeader.substring(7) // Usunięcie "Bearer "
        // console.log("Token z nagłówka:", token);

        // Weryfikacja tokenu
        const decoded = jwt.verify(token, process.env.JWT_KEY)

        // Sprawdzenie czy użytkownik nadal istnieje
        const user = await User.findById(decoded._id)
        // console.log("Decoded user:", user);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Token wygasł",
            })
        }

        // Dodanie informacji o użytkowniku do request
        req.user = decoded
        next()
    } catch (error) {
        console.error("Auth middleware error:", error)

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Nieprawidłowy token",
            })
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token wygasł",
            })
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

module.exports = auth
