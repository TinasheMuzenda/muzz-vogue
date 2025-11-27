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
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import About from "./pages/About.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import NotificationToast from "./components/NotificationToast.jsx";
import Notifications from "./pages/Notifications.jsx";

const App = () => {
  return (
    <div className="min-h-screen bg-(--bg) text-(--light)">
      <NotificationToast />
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/about" element={<About />} />;
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:id" element={<OrderConfirmation />} />
        <Route path="/dashboard" element={<UserDashboard />}>
          <Route path="profile" element={<ProfileSection />} />
          <Route path="orders" element={<OrdersSection />} />
          <Route path="wishlist" element={<WishlistSection />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="/product/:id" element={<ProductDetails />} />;
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </div>
  );
};

export default App;
