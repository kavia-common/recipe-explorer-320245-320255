import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../contexts/AuthContext";

// PUBLIC_INTERFACE
export default function RecipeDetailsPage() {
  /** Recipe details page (public details + auth-only actions). */
  const { id } = useParams();
  const recipeId = Number(id);

  const { isAuthenticated } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const [favStatus, setFavStatus] = useState("idle");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [rateStatus, setRateStatus] = useState("idle");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let mounted = true;
    setStatus("loading");
    setError("");
    api
      .getRecipePublic(recipeId)
      .then((res) => mounted && (setRecipe(res), setStatus("success")))
      .catch((e) => mounted && (setError(e.message), setStatus("error")));
    return () => {
      mounted = false;
    };
  }, [recipeId]);

  async function onFavorite() {
    if (!isAuthenticated) return;
    setActionError("");
    setFavStatus("loading");
    try {
      await api.addFavorite(recipeId);
      setFavStatus("success");
    } catch (e) {
      setActionError(e.message);
      setFavStatus("error");
    }
  }

  async function onRate(e) {
    e.preventDefault();
    if (!isAuthenticated) return;
    setActionError("");
    setRateStatus("loading");
    try {
      await api.upsertRating(recipeId, { rating: Number(rating), comment });
      setRateStatus("success");
    } catch (e2) {
      setActionError(e2.message);
      setRateStatus("error");
    }
  }

  if (status === "loading") return <div className="page"><div className="muted">Loading…</div></div>;
  if (status === "error") return <div className="page"><div className="error">{error}</div></div>;
  if (!recipe) return null;

  return (
    <div className="page">
      <div className="details">
        <div className="details__media">
          {recipe.image_url ? <img className="details__img" src={recipe.image_url} alt="" /> : <div className="details__img details__img--placeholder" />}
        </div>

        <div className="details__content">
          <div className="details__top">
            <h1 className="h1">{recipe.title}</h1>
            {recipe.category?.name ? <span className="badge">{recipe.category.name}</span> : null}
          </div>

          <div className="details__meta">
            <span className="rating">
              {recipe.avg_rating ? recipe.avg_rating.toFixed(1) : "0.0"} <span className="muted">({recipe.ratings_count})</span>
            </span>
          </div>

          <p className="details__desc">{recipe.description}</p>

          <div className="details__cols">
            <div>
              <h2 className="h2">Ingredients</h2>
              <ul className="list">
                {recipe.ingredients.map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="h2">Instructions</h2>
              <ol className="list">
                {recipe.instructions.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="details__actions">
            <button className="btn" disabled={!isAuthenticated || favStatus === "loading"} onClick={onFavorite}>
              {isAuthenticated ? (favStatus === "success" ? "Saved to favorites" : "Save to favorites") : "Sign in to favorite"}
            </button>
          </div>

          <div className="panel">
            <h2 className="h2">Your rating</h2>
            <form className="form form--inline" onSubmit={onRate}>
              <label className="label">
                Stars
                <select className="input" value={rating} onChange={(e) => setRating(e.target.value)} disabled={!isAuthenticated}>
                  {[5, 4, 3, 2, 1].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label className="label" style={{ flex: 1 }}>
                Comment
                <input className="input" value={comment} onChange={(e) => setComment(e.target.value)} disabled={!isAuthenticated} />
              </label>
              <button className="btn btn--primary" type="submit" disabled={!isAuthenticated || rateStatus === "loading"}>
                {isAuthenticated ? (rateStatus === "loading" ? "Saving…" : "Save rating") : "Sign in to rate"}
              </button>
            </form>
            {actionError ? <div className="error">{actionError}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
