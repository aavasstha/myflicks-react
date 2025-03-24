const request = require('supertest');
const express = require('express');
const router = require('../routes/listRoutes'); // adjust path if needed
const pool = require('../db');

// Mock the pool module to simulate database responses
jest.mock('../db');

const app = express();
app.use(express.json());
app.use('/lists', router);

describe('User Lists API', () => {
    beforeEach(() => {
        // Clear any previous mock data
        pool.query.mockClear();
    });

    test('POST /lists - create a new list when it does not exist', async () => {
        // First call: check for existing list returns empty; second call: insert returns new list
        pool.query
            .mockResolvedValueOnce({ rows: [] })
            .mockResolvedValueOnce({ rows: [{ id: 1, user_id: 1, name: 'Favorites' }] });

        const res = await request(app)
            .post('/lists')
            .send({ user_id: 1, name: 'Favorites' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ id: 1, user_id: 1, name: 'Favorites' });
    });

    test('POST /lists - return error if list already exists', async () => {
        // Simulate that a list with the given name already exists
        pool.query.mockResolvedValueOnce({ rows: [{ id: 1, user_id: 1, name: 'Favorites' }] });

        const res = await request(app)
            .post('/lists')
            .send({ user_id: 1, name: 'Favorites' });

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ message: "This list already exists " });
    });

    test('GET /lists/:user_id - get all lists for a user', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id: 1, user_id: 1, name: 'Favorites' }] });

        const res = await request(app).get('/lists/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{ id: 1, user_id: 1, name: 'Favorites' }]);
    });

    test('POST /lists/:list_id/movies - add a movie to a list', async () => {
        const movie = {
            movie_id: 123,
            movie_title: 'Inception',
            movie_poster_url: 'poster.jpg',
            movie_overview: 'A mind bending thriller',
        };

        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, list_id: 1, ...movie }],
        });

        const res = await request(app)
            .post('/lists/1/movies')
            .send(movie);

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ id: 1, list_id: 1, ...movie });
    });

    test('DELETE /lists/:list_id/movies/:movie_id - remove a movie from a list', async () => {
        pool.query.mockResolvedValueOnce({});

        const res = await request(app).delete('/lists/1/movies/123');
        expect(res.statusCode).toBe(204);
    });

    test('GET /lists/:list_id/movies - get all movies from a list', async () => {
        const movies = [
            {
                id: 1,
                list_id: 1,
                movie_id: 123,
                movie_title: 'Inception',
                movie_poster_url: 'poster.jpg',
                movie_overview: 'A mind bending thriller',
            },
        ];

        pool.query.mockResolvedValueOnce({ rows: movies });

        const res = await request(app).get('/lists/1/movies');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(movies);
    });

    afterAll(async () => {
        await pool.end();
    });
});
