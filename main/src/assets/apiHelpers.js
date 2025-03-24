const API_BASE = 'http://localhost:4000/api';

export async function createList(userId, name) {
  const res = await fetch(`${API_BASE}/lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, name }),
  });
  
  return res.json();
}

export async function getUserLists(userId) {
  const res = await fetch(`${API_BASE}/lists/${userId}`);
  return res.json();
}

export async function addMovieToList(listId, movie) {
  const res = await fetch(`${API_BASE}/lists/${listId}/movies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
  });
  return res.json();
}

export async function getMoviesFromList(listId) {
  const res = await fetch(`${API_BASE}/lists/${listId}/movies`);
  return res.json();
}

export async function removeMovieFromList(listId, movieId) {
  await fetch(`${API_BASE}/lists/${listId}/movies/${movieId}`, {
    method: 'DELETE',
  });
}
