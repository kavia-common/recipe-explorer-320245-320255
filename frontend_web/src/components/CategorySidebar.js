import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/client";

// PUBLIC_INTERFACE
export default function CategorySidebar() {
  /** Category sidebar used for browsing/filtering. */
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  const currentCategoryId = searchParams.get("category_id");

  useEffect(() => {
    let mounted = true;
    api
      .listCategories()
      .then((data) => mounted && setItems(data))
      .catch((e) => mounted && setError(e.message));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar__title">Categories</div>
      {error ? <div className="muted">{error}</div> : null}

      <ul className="sidebar__list">
        <li>
          <Link className={!currentCategoryId ? "sidebar__link sidebar__link--active" : "sidebar__link"} to="/">
            All recipes
          </Link>
        </li>
        {items.map((c) => (
          <li key={c.id}>
            <Link
              className={String(c.id) === String(currentCategoryId) ? "sidebar__link sidebar__link--active" : "sidebar__link"}
              to={`/?category_id=${c.id}`}
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
