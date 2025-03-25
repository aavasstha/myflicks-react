import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const SignUp = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Signup failed.");
            }

            // Store token in localStorage
            localStorage.setItem("token", data.token);

            // Redirect user to home or dashboard
            navigate("/login");

        } catch (error) {
            setErrorMsg(error.message); // Display error message from backend
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex justify-center items-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <header className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">Create an Account</h1>
                </header>
                <section className="form-section">
                    {errorMsg && <p className="text-red-500 text-center mb-4">{errorMsg}</p>}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="input-field bg-gray-700 text-white px-4 py-3 rounded-md border border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="input-field bg-gray-700 text-white px-4 py-3 rounded-md border border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                        <input
                            type="password"
                            name="password"
                            minLength="8"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="input-field bg-gray-700 text-white px-4 py-3 rounded-md border border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                        <button
                            type="submit"
                            className="btn bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-3 rounded-md hover:opacity-80 transition"
                        >
                            {isLoading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </form>
                    <p className="text-gray-400 text-center mt-4">
                        Already have an account? <a href="/login" className="text-pink-500 hover:underline">Log In</a>
                    </p>
                </section>
                <a href="/" className="text-purple-500 hover:underline">Go home</a>
            </div>
        </main>
    );
};

export default SignUp;
