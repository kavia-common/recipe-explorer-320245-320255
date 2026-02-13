import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import RecipeCard from "../components/RecipeCard";

// PUBLIC_INTERFACE
export default function FavoritesPage() {
  /** Shows user's favorite recipes (requires authentication). */
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState({ items: [], total: 0 });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    if (!isAuthenticated) return () => {};

    setStatus("loading");
    setError("");
    api
      .listFavorites()
      .then((res) => mounted && (setData(res), setStatus("success")))
      .catch((e) => mounted && (setError(e.message), setStatus("error")));

    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="page">
        <h1 className="h1">Favorites</h1>
        <p className="subtle">Sign in to save and view your favorite recipes.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="h1">Favorites</h1>
        <p className="subtle">Your saved recipes.</p>
      </div>

      {status === "loading" ? <div className="muted">Loading…</div> : null}
      {status === "error" ? <div className="error">{error}</div> : null}

      <section className="grid" aria-label="Favorite recipes">
        {data.items.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </section>

      {status === "success" && data.total === 0 ? <div className="muted">No favorites yet.</div> : null}
    </div>
  );
}
