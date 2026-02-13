import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import CategorySidebar from "./components/CategorySidebar";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import FavoritesPage from "./pages/FavoritesPage";
import LoginPage from "./pages/LoginPage";
import RecipeDetailsPage from "./pages/RecipeDetailsPage";

// PUBLIC_INTERFACE
function App() {
  /** Main application entry with routing and global layout. */
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="appShell">
          <Navbar />
          <div className="appBody">
            <CategorySidebar />
            <main className="main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
