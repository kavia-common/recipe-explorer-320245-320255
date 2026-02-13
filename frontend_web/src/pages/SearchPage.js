import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import RecipeCard from "../components/RecipeCard";

// PUBLIC_INTERFACE
export default function SearchPage() {
  /** Search recipes by ingredient or title (public). */
  const [q, setQ] = useState("");
  const [data, setData] = useState({ items: [], total: 0 });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    if (!q.trim()) {
      setData({ items: [], total: 0 });
      setStatus("idle");
      return () => {};
    }

    const t = setTimeout(() => {
      setStatus("loading");
      setError("");
      api
        .listRecipesPublic({ q })
        .then((res) => mounted && (setData(res), setStatus("success")))
        .catch((e) => mounted && (setError(e.message), setStatus("error")));
    }, 300);

    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [q]);

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="h1">Search</h1>
        <p className="subtle">Try searching for “garlic”, “chickpeas”, or “blueberries”.</p>

        <div className="searchbar">
          <input
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title or ingredient…"
            aria-label="Search recipes"
          />
        </div>
      </div>

      {status === "loading" ? <div className="muted">Searching…</div> : null}
      {status === "error" ? <div className="error">{error}</div> : null}

      <section className="grid" aria-label="Search results">
        {data.items.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </section>

      {status === "success" && data.total === 0 ? <div className="muted">No recipes found.</div> : null}
    </div>
  );
}
