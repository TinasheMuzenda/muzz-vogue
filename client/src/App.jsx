import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Catalog from "./pages/Catalog";
import CartPage from "./pages/Cart";

const App = () => {
  return (
    <div className="min-h-screen bg-(--bg) text-(--light)">
      <Routes>
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </div>
  );
};

export default App;
