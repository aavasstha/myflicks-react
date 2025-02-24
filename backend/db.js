
const { Pool } = require('pg');
require('dotenv').config(); // Load .env file

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
    console.error("❌ ERROR: DATABASE_URL is missing!");
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Supabase
});

// Test database connection
pool.connect()
    .then(() => console.log("✅ Connected to Supabase PostgreSQL"))
    .catch(err => console.error("❌ Database connection error:", err));

module.exports = pool;
