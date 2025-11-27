import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Catalog from "./pages/Catalog";
import CartPage from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import UserDashboard from "./pages/UserDashboard";
import ProfileSection from "./pages/dashboard/ProfileSection";
import OrdersSection from "./pages/dashboard/OrdersSection";
import WishlistSection from "./pages/dashboard/WishlistSection";

const App = () => {
  return (
    <div className="min-h-screen bg-(--bg) text-(--light)">
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:id" element={<OrderConfirmation />} />

        <Route path="/dashboard" element={<UserDashboard />}>
          <Route path="profile" element={<ProfileSection />} />
          <Route path="orders" element={<OrdersSection />} />
          <Route path="wishlist" element={<WishlistSection />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
