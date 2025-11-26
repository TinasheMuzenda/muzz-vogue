import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Catalog from "./pages/Catalog";

const App = () => {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--light)]">
      <Routes>
        <Route path="/catalog" element={<Catalog />} />
        {/* <Route path="/cart" element={<CartPage />} /> */}
      </Routes>
    </div>
  );
};

export default App;
