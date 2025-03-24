const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock the database pool module
jest.mock('../db');
const pool = require('../db');

// Stub the authenticateUser middleware to simply set req.user for tests
jest.mock('../middleware/authenticateUser', () => (req, res, next) => {
    req.user = { id: 1 }; // assume user with id 1 is authenticated
    next();
});

const router = require('../routes/userRoutes'); // adjust the path if necessary

const app = express();
app.use(express.json());
app.use('/auth', router);

describe('Auth Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        // Ensure the pool is properly closed after tests (if applicable)
        if (pool.end) {
            await pool.end();
        }
    });

    describe('POST /auth/signup', () => {
        test('should register a new user if email does not exist', async () => {
            const newUser = { id: 1, username: 'testuser', email: 'test@example.com', password: 'hashedpass' };
            // First, simulate no existing user found
            pool.query.mockResolvedValueOnce({ rows: [] });
            // Then, simulate the insertion of the new user
            pool.query.mockResolvedValueOnce({ rows: [newUser] });

            // Spy on bcrypt functions to control their outputs
            jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('somesalt');
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpass');

            const res = await request(app)
                .post('/auth/signup')
                .send({ username: 'testuser', email: 'test@example.com', password: 'plaintextpassword' });

            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual({
                message: "User registered successfully",
                user: newUser
            });
        });

        test('should return error if email already exists', async () => {
            // Simulate an existing user is found
            pool.query.mockResolvedValueOnce({ rows: [{ id: 1, username: 'existing', email: 'existing@example.com' }] });

            const res = await request(app)
                .post('/auth/signup')
                .send({ username: 'newuser', email: 'existing@example.com', password: 'password' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ message: "Email already in use" });
        });
    });

    describe('POST /auth/login', () => {
        test('should return error if user not found', async () => {
            // Simulate no user found
            pool.query.mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'nonexistent@example.com', password: 'password' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ message: "Invalid email or password" });
        });

        test('should return error if password is incorrect', async () => {
            const userFromDb = { id: 1, email: 'test@example.com', password: 'hashedpass' };
            // Simulate a found user with a password hash
            pool.query.mockResolvedValueOnce({ rows: [userFromDb] });
            // Simulate bcrypt.compare returning false for an incorrect password
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'wrongpassword' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ message: "Invalid email or password" });
        });

        test('should login successfully with valid credentials', async () => {
            const userFromDb = { id: 1, email: 'test@example.com', password: 'hashedpass', username: 'testuser' };
            // Simulate a found user from the database
            pool.query.mockResolvedValueOnce({ rows: [userFromDb] });
            // Simulate a correct password check
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            // Stub jwt.sign to return a dummy token
            const dummyToken = 'dummy.jwt.token';
            jest.spyOn(jwt, 'sign').mockReturnValue(dummyToken);

            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'correctpassword' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                message: "Login successful",
                token: dummyToken,
                user: userFromDb
            });
        });
    });

    describe('GET /auth/profile', () => {
        test('should return user profile if user is authenticated', async () => {
            const userProfile = { id: 1, username: 'testuser', email: 'test@example.com' };
            // Simulate the profile query returning the user's details
            pool.query.mockResolvedValueOnce({ rows: [userProfile] });

            const res = await request(app).get('/auth/profile');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(userProfile);
        });

        test('should return error if user profile is not found', async () => {
            // Simulate no user found for the authenticated user id
            pool.query.mockResolvedValueOnce({ rows: [] });

            const res = await request(app).get('/auth/profile');

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: "User not found" });
        });
    });
});
