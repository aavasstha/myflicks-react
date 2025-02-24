const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.SUPABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,

});

pool.connect()
    .then(() => console.log("✅ Connected to Database"))
    .catch(err => console.error("❌ Database connection error:", err));

module.exports = pool;
