import { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext.jsx";

const NotificationsContext = createContext();
export const useNotifications = () => useContext(NotificationsContext);

export function NotificationsProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
      transports: ["websocket"],
    });

    if (user) {
      socket.emit("join_user", user._id);

      socket.on("notify", (n) => {
        setNotifications((p) => [n, ...p]);
      });
    }

    return () => socket.disconnect();
  }, [user]);

  const remove = (i) =>
    setNotifications((p) => p.filter((_, idx) => idx !== i));

  return (
    <NotificationsContext.Provider value={{ notifications, remove }}>
      {children}
    </NotificationsContext.Provider>
  );
}
