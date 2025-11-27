import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Catalog from "./pages/Catalog";
import CartPage from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

const App = () => {
  return (
    <div className="min-h-screen bg-(--bg) text-(--light)">
      <Routes>
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:id" element={<OrderConfirmation />} />
      </Routes>
    </div>
  );
};

export default App;
