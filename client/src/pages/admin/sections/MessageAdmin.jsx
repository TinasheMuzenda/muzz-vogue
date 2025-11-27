import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
  transports: ["websocket"],
});

export default function MessagesAdmin() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("contact:message", (msg) => {
      setMessages((prev) => [msg, ...prev]);
    });

    return () => socket.off("contact:message");
  }, []);

  return (
    <div>
      <h2 className="text-2xl text-(--accent) mb-4">Messages</h2>

      <div className="space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className="p-3 bg-(--deep) border border-(--accent-dark) rounded"
          >
            <p className="text-(--accent)">
              {m.name} ({m.email})
            </p>
            <p className="mt-2">{m.message}</p>
          </div>
        ))}

        {messages.length === 0 && <p>No messages yet.</p>}
      </div>
    </div>
  );
}
