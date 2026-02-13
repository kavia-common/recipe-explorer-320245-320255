import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function RecipeCard({ recipe }) {
  /** Displays a recipe summary card in the grid. */
  return (
    <article className="card">
      <Link to={`/recipes/${recipe.id}`} className="card__media" aria-label={`Open ${recipe.title}`}>
        {recipe.image_url ? (
          <img className="card__img" src={recipe.image_url} alt="" loading="lazy" />
        ) : (
          <div className="card__img card__img--placeholder" />
        )}
      </Link>

      <div className="card__body">
        <div className="card__titleRow">
          <h3 className="card__title">
            <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
          </h3>
          {recipe.category?.name ? <span className="badge">{recipe.category.name}</span> : null}
        </div>

        <p className="card__desc">{recipe.description}</p>

        <div className="card__meta">
          <span className="rating">
            {recipe.avg_rating ? recipe.avg_rating.toFixed(1) : "0.0"} <span className="muted">({recipe.ratings_count})</span>
          </span>
        </div>
      </div>
    </article>
  );
}
