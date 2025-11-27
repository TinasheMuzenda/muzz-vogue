import { useNotifications } from "../contexts/NotificationsContext.jsx";

export default function Notifications() {
  const { notifications, remove } = useNotifications();

  return (
    <div className="p-6 max-w-xl mx-auto text-(--light)">
      <h1 className="text-3xl text-(--accent) mb-4">Notifications</h1>

      <div className="space-y-3">
        {notifications.map((n, i) => (
          <div
            key={i}
            className="p-4 bg-(--deep) border border-(--accent-dark) rounded"
          >
            <p className="text-(--accent) font-semibold">{n.title}</p>
            <p className="mt-1">{n.message}</p>

            <button
              onClick={() => remove(i)}
              className="mt-2 px-3 py-1 bg-red-500 rounded"
            >
              Dismiss
            </button>
          </div>
        ))}

        {notifications.length === 0 && <p>No notifications.</p>}
      </div>
    </div>
  );
}
