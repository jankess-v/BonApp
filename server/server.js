const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
const imageRoutes = require("./routes/images");
const {initializeBucket} = require("./config/gcs");
require('dotenv').config({ path: '../.env' });


const app = express();
const port = process.env.PORT || 3000;

connectDB();

initializeBucket();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/images", imageRoutes);

app.listen(port, () => console.log(`Listening on port http://localhost:${port}`));