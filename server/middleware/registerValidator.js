// validators/registerValidator.js

const validator = require('validator');

const registerValidator = (req, res, next) => {
    const { username, email, password, firstName, lastName } = req.body;
    const errors = [];

    // Walidacja username
    if (!username || typeof username !== 'string') {
        errors.push('Login jest wymagany');
    } else {
        const trimmed = username.trim();
        if (trimmed.length < 3 || trimmed.length > 25) {
            errors.push('Login musi mieć od 3 do 25 znaków');
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
            errors.push('Login może zawierać tylko litery, cyfry, myślniki (-) i podkreślenia (_)');
        }
    }

    // Walidacja email
    if (!email || typeof email !== 'string') {
        errors.push('Email jest wymagany');
    } else if (!validator.isEmail(email.trim())) {
        errors.push('Wprowadź poprawny adres email');
    }

    // Walidacja hasła
    if (!password || typeof password !== 'string') {
        errors.push('Hasło jest wymagane');
    } else {
        if (password.length < 6) {
            errors.push('Hasło musi mieć conajmniej 6 znaków');
        }
    }

    // Walidacja firstName
    if (!firstName || typeof firstName !== 'string') {
        errors.push('Imię jest wymagane');
    } else {
        const trimmed = firstName.trim();
        if (trimmed.length === 0) {
            errors.push('Imię nie może być puste');
        }
        if (trimmed.length > 50) {
            errors.push('Imię nie może przekraczać 50 znaków');
        }
        if (!validator.isAlpha(trimmed, 'pl-PL', { ignore: ' ' })) {
            errors.push('Imię może zawierać tylko litery');
        }
        if (trimmed[0] !== trimmed[0].toUpperCase()) {
            errors.push('Imię musi zaczynać się wielką literą');
        }
    }

    // Walidacja lastName
    if (!lastName || typeof lastName !== 'string') {
        errors.push('Nazwisko jest wymagane');
    } else {
        const trimmed = lastName.trim();
        if (trimmed.length === 0) {
            errors.push('Nazwisko nie może być puste');
        }
        if (trimmed.length > 50) {
            errors.push('Nazwisko nie może przekraczać 50 znaków');
        }
        if (!validator.isAlpha(trimmed, 'pl-PL', { ignore: ' ' })) {
            errors.push('Nazwisko może zawierać tylko litery');
        }
        if (trimmed[0] !== trimmed[0].toUpperCase()) {
            errors.push('Nazwisko musi zaczynać się wielką literą');
        }
    }

    // Sprawdzenie błędów
    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }

    next();
};

module.exports = registerValidator;