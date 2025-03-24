require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const listsRoutes = require("./routes/listRoutes");
// const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// user routes
app.use("/api/users", userRoutes);

//lists routes
app.use("/api/lists", listsRoutes);


// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
