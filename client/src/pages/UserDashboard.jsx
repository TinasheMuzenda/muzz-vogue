import { NavLink, Outlet } from "react-router-dom";

export default function UserDashboard() {
  const linkBase = "px-4 py-2 rounded-md border border-[var(--accent-dark)]";
  const active = "bg-[var(--accent)] text-[var(--deep)]";
  const inactive = "bg-[var(--deep)] text-[var(--light)]";

  return (
    <div className="p-6 max-w-5xl mx-auto text-(--light)">
      <h1 className="text-3xl mb-6 text-(--accent)">Your Dashboard</h1>

      <div className="flex gap-3 mb-8">
        <NavLink
          to="profile"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          Profile
        </NavLink>

        <NavLink
          to="orders"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          Orders
        </NavLink>

        <NavLink
          to="wishlist"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          Wishlist
        </NavLink>
      </div>

      <Outlet />
    </div>
  );
}
