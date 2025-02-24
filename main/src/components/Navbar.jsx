import { Link, useNavigate } from "react-router-dom";



const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/login");
    };
    return (
        <nav className="bg-transparent text-white py-4 px-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
            </h1>

            <div className="flex gap-4">
                {isLoggedIn ? (
                    <>
                        <button
                            onClick={() => navigate("/profile")}
                            className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition"
                        >
                            Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-600 transition"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate("/signup")}
                            className="bg-yellow-500 px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                        >
                            Sign Up
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
