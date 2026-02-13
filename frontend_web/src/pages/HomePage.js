import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import RecipeCard from "../components/RecipeCard";

// PUBLIC_INTERFACE
export default function HomePage() {
  /** Home page: browse recipes (public) with optional category filter. */
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category_id");

  const [data, setData] = useState({ items: [], total: 0 });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const params = useMemo(() => {
    return { categoryId: categoryId ? Number(categoryId) : undefined };
  }, [categoryId]);

  useEffect(() => {
    let mounted = true;
    setStatus("loading");
    setError("");

    api
      .listRecipesPublic(params)
      .then((res) => mounted && (setData(res), setStatus("success")))
      .catch((e) => mounted && (setError(e.message), setStatus("error")));

    return () => {
      mounted = false;
    };
  }, [params]);

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="h1">Browse recipes</h1>
        <p className="subtle">Discover tasty ideas. Filter by category from the left.</p>
      </div>

      {status === "loading" ? <div className="muted">Loading…</div> : null}
      {status === "error" ? <div className="error">{error}</div> : null}

      <section className="grid" aria-label="Recipe grid">
        {data.items.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </section>
    </div>
  );
}
