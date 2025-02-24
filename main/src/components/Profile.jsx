import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const API_URL = import.meta.env.VITE_API_BASE_URL
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login"); // Redirect if no token found
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(`${API_URL}/api/users/profile`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    setUser(data);
                } else {
                    setError(data.message);
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            } catch (error) {
                setError("Failed to load profile.");
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        fetchProfile();
    }, [navigate]);

    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!user) return <p className="text-center text-white">Loading...</p>;

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white p-6">
            <div className="max-w-md bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold">Profile</h1>
                <p className="text-gray-400">Username: <span className="text-white">{user.username}</span></p>
                <p className="text-gray-400">Email: <span className="text-white">{user.email}</span></p>
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login");
                    }}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:opacity-80 transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;
