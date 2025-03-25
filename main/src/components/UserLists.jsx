import React, { useEffect, useState } from 'react'
import { getUserLists, createList } from '../assets/apiHelpers';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";


const UserLists = () => {
    const [lists, setLists] = useState([]);

    const [listName, setListName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();



    const loadLists = async () => {
        const { id } = jwtDecode(localStorage.getItem("token"));
        if (!id) {
            setErrorMsg("Please login");
            navigate("/login");
            return;
        }
        setIsLoading(true);
        try {
            const data = await getUserLists(id);
            if (!data) {
                throw new Error("No data returned from the server.");
            }
            setLists(data);
        } catch (error) {
            console.error("Error loading lists:", error);
            setErrorMsg(error.message || "Error loading lists. Please try again.");
            // Optionally clear the error message after 5 seconds
            setTimeout(() => setErrorMsg(""), 3000);
        } finally {
            setListName("")
            setIsLoading(false);
        }

    };

    const handleCreateList = async (e) => {
        setErrorMsg(""); // Clear any previous error

        // Ensure the list name isn't empty
        if (!listName.trim()) {
            setErrorMsg("List name cannot be empty.");
            return;
        }

        setIsLoading(true);
        const { id } = jwtDecode(localStorage.getItem("token"));
        try {
            // Call the API to create the list
            const response = await createList(id, listName);

            if (!response.ok) {
                // If there's an error, display the error message
                setErrorMsg(response.message);
                setTimeout(() => setErrorMsg(""), 5000);
            }
                // If creation was successful, clear the input and reload the lists
                setListName('');
                await loadLists();
            
        } catch (error) {
            console.error("Error creating list:", error);
            setErrorMsg("Error creating your list.");
        } finally {
            setIsLoading(false);
            // Optionally clear the error message after a few seconds
            setTimeout(() => setErrorMsg(""), 5000);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login"); // Redirect if no token found
            return;
        }
        loadLists();
    }, [])

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white p-6">
            <div className="max-w-md bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                {isLoading && <p className="text-white-500 text-center mb-4">Loading...</p>}
                <h1 className="text-3xl font-bold">Your Lists</h1>
                <ul className="mb-4">
                    {errorMsg && <p className="text-red-500 text-center mb-4">{errorMsg}</p>}
                    {lists.length === 0 ? <p className="text-white-500 text-center mb-4">You don't have any lists.</p> : ""}
                    {lists.map(list => (
                        <li
                            key={list.id}
                            className="bg-gray-700 text-white py-2 px-4 rounded mb-2 shadow-sm hover:bg-indigo-600 transition-colors"
                        >
                            📁 {list.name}
                        </li>
                    ))}
                </ul>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Create new list (e.g., Watched)"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-700 rounded text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleCreateList}
                        className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition-colors"
                    >
                        {isLoading ? 'Creating...' : 'Create'}
                    </button>

                </div>
                <a href="/" className="text-purple-500 hover:underline">Go home</a>



            </div>
        </div>
    )
}

export default UserLists
