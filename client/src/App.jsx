import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <div style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
        <h1 className="text-3xl font-bold underline">TINASHE</h1>
        <p className="text-brand font-bold">
          FULLSTACK MUZZ TINASHE OWNER VOGUE SITE
        </p>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
}
