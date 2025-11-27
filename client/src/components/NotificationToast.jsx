import { useEffect } from "react";
import { useNotifications } from "../contexts/NotificationsContext.jsx";

export default function NotificationToast() {
  const { notifications, remove } = useNotifications();

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => remove(0), 4000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (notifications.length === 0) return null;

  const n = notifications[0];

  return (
    <div
      className="
        fixed bottom-6 right-6 bg-(--deep)
        border border-(--accent-dark)
        text-(--light) px-4 py-3 rounded shadow-lg
      "
    >
      <p className="text-(--accent) font-semibold mb-1">{n.title}</p>
      <p>{n.message}</p>
    </div>
  );
}
