require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => { 
    res.send(<a href="https://myflicksv2.netlify.app/"><h1>Click here to go to the main app</h1></a>)
})

// Routes
app.use("/api/users", userRoutes);

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
