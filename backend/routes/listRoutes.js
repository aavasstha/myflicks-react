const express = require('express');
const router = express.Router();
const pool = require('../db');

//
// Create a new list for a user
//
router.post('/', async (req, res) => {

    try {
        const { user_id, name } = req.body;
        // Check if list already exists
        const listExists = await pool.query("SELECT * FROM user_lists WHERE name = $1", [name]);
        if (listExists.rows.length > 0) {
            return res.status(400).json({ message: "This list already exists " });
        }

        // Insert new list to database
        const result = await pool.query(
            'INSERT INTO user_lists (user_id, name) VALUES ($1, $2) RETURNING *;',
            [user_id, name]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to create list' });
    }
});

//
// Get all lists for a user
//
router.get('/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM user_lists WHERE user_id = $1;',
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch lists' });
    }
});

//
// Add movie to a specific list
//
router.post('/:list_id/movies', async (req, res) => {
    const { list_id } = req.params;
    const { movie_id, movie_title, movie_poster_url, movie_overview } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO list_movies 
            (list_id, movie_id, movie_title, movie_poster_url, movie_overview) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
            [list_id, movie_id, movie_title, movie_poster_url, movie_overview]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add movie to list' });
    }
});

//
// Remove movie from a list
//
router.delete('/:list_id/movies/:movie_id', async (req, res) => {
    const { list_id, movie_id } = req.params;

    try {
        await pool.query(
            'DELETE FROM list_movies WHERE list_id = $1 AND movie_id = $2;',
            [list_id, movie_id]
        );
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to remove movie from list' });
    }
});

//
// Get all movies from a list
//
router.get('/:list_id/movies', async (req, res) => {
    const { list_id } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM list_movies WHERE list_id = $1;',
            [list_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch movies from list' });
    }
});

module.exports = router;
