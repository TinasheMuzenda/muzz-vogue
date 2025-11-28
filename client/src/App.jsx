import { Route, Routes, useLocation } from "react-router-dom";
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
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Categories from "./pages/Categories.jsx";
import Footer from "./components/Footer.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import AuthModal from "./components/AuthModal.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

const App = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-(--bg) text-(--light)">
      {location.pathname !== "/about" && <Navbar />}
      <NotificationToast />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthModal />} />
        <Route path="/catalog" element={<Catalog />} />
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
        <Route path="/categories" element={<Categories />} />;
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;