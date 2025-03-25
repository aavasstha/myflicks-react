const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://myflicks-react-backend.onrender.com';


export async function getUserLists(userId) {
  const res = await fetch(`${VITE_API_BASE_URL}/api/lists/${userId}`);
  return res.json();
}

export async function createList(userId, name) {
  const res = await fetch(`${VITE_API_BASE_URL}/api/lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, name }),
  });
  
  return res.json();
}


export async function addMovieToList(listId, movie) {
  const res = await fetch(`${VITE_API_BASE_URL}/api/lists/${listId}/movies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
  });
  return res.json();
}

export async function getMoviesFromList(listId) {
  const res = await fetch(`${VITE_API_BASE_URL}/api/lists/${listId}/movies`);
  return res.json();
}

export async function removeMovieFromList(listId, movieId) {
  await fetch(`${VITE_API_BASE_URL}/lists/${listId}/api/movies/${movieId}`, {
    method: 'DELETE',
  });
}
