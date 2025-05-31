const mongoose = require('mongoose')
require('dotenv').config({ path: '../.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error("MongoDB connection error: ", error.message);
    }
}

module.exports = connectDB;