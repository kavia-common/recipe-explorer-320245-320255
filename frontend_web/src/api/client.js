const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

/** Token storage key */
const TOKEN_KEY = "recipe_explorer_token";

// PUBLIC_INTERFACE
export function getToken() {
  /** Get stored JWT token (or null). */
  return localStorage.getItem(TOKEN_KEY);
}

// PUBLIC_INTERFACE
export function setToken(token) {
  /** Store JWT token (string). */
  localStorage.setItem(TOKEN_KEY, token);
}

// PUBLIC_INTERFACE
export function clearToken() {
  /** Clear stored JWT token. */
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof data === "object" && data && data.detail ? data.detail : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

// PUBLIC_INTERFACE
export const api = {
  /** Fetch categories for sidebar. */
  listCategories: () => request("/categories"),

  /** Public browse/search recipes. */
  listRecipesPublic: ({ q, categoryId, limit = 24, offset = 0 } = {}) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categoryId) params.set("category_id", String(categoryId));
    params.set("limit", String(limit));
    params.set("offset", String(offset));
    return request(`/recipes/public?${params.toString()}`);
  },

  /** Public recipe details. */
  getRecipePublic: (id) => request(`/recipes/${id}`),

  /** Auth: register/login */
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),

  /** Favorites */
  listFavorites: () => request("/favorites", { auth: true }),
  addFavorite: (recipeId) => request(`/favorites/${recipeId}`, { method: "POST", auth: true }),
  removeFavorite: (recipeId) => request(`/favorites/${recipeId}`, { method: "DELETE", auth: true }),

  /** Ratings */
  upsertRating: (recipeId, payload) => request(`/ratings/${recipeId}`, { method: "PUT", body: payload, auth: true }),
};
