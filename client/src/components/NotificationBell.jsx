import { useNotifications } from "../contexts/NotificationsContext.jsx";
import { Link } from "react-router-dom";

export default function NotificationBell() {
  const { notifications } = useNotifications();

  return (
    <Link to="/notifications" className="relative">
      <span className="text-2xl">🔔</span>
      {notifications.length > 0 && (
        <span
          className="
            absolute -top-1 -right-1 bg-red-500 text-white
            text-xs rounded-full px-1
          "
        >
          {notifications.length}
        </span>
      )}
    </Link>
  );
}
