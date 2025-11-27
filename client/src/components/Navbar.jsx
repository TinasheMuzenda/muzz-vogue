import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import NotificationBell from "../components/NotificationBell.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { cart } = useCart();
  const { user, logout } = useAuth();

  const linkBase =
    "px-3 py-1 rounded hover:bg-[var(--accent)] hover:text-[var(--deep)] transition";
  const linkActive = "bg-[var(--accent)] text-[var(--deep)]";
  const linkInactive = "text-[var(--light)]";

  return (
    <nav className="bg-(--deep) border-b border-(--accent-dark) sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl text-r(--accent) font-semibold tracking-wide"
        >
          MUZZ
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Shop
          </NavLink>

          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Wishlist
          </NavLink>

          <NotificationBell />

          <Link to="/cart" className="relative">
            <span className="text-xl">🛒</span>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {cart.length}
              </span>
            )}
          </Link>

          {user ? (
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-500 rounded text-white"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/auth"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Login
            </NavLink>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-(--light) text-2xl"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-(--deep) border-t border-(--accent-dark) p-4 space-y-3">
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className={linkInactive}
          >
            Home
          </NavLink>

          <NavLink
            to="/catalog"
            onClick={() => setOpen(false)}
            className={linkInactive}
          >
            Shop
          </NavLink>

          <NavLink
            to="/wishlist"
            onClick={() => setOpen(false)}
            className={linkInactive}
          >
            Wishlist
          </NavLink>

          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="text-(--light)"
          >
            Cart ({cart.length})
          </Link>

          {user ? (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="mt-2 px-3 py-1 bg-red-500 rounded text-white"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/auth"
              onClick={() => setOpen(false)}
              className={linkInactive}
            >
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}
