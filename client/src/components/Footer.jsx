import { Link } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const [dark, setDark] = useState(true);

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("light");
  };

  return (
    <footer className="mt-20 py-5 bg-[var(--deep)] border-t border-[var(--accent-dark)]">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-[var(--light)]">
        <div>
          <h3 className="text-[var(--accent)] text-xl mb-3">MUZZ.VOGUE</h3>
          <p className="opacity-80 mb-4">
            Quality crafted clothing made for everyone.
          </p>
          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded border border-[var(--accent)] text-[var(--accent)]"
          >
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <div>
          <h4 className="text-lg text-[var(--accent)] mb-3">Quick Links</h4>
          <ul className="space-y-1">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/catalog" className="hover:underline">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/categories" className="hover:underline">
                Categories
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline">
                About
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg text-[var(--accent)] mb-3">Follow Us</h4>
          <div className="flex flex-col gap-1">
            <a href="#" className="hover:text-[var(--accent)]">
              Instagram
            </a>
            <a href="#" className="hover:text-[var(--accent)]">
              Pinterest
            </a>
            <a href="#" className="hover:text-[var(--accent)]">
              Facebook
            </a>
            <a href="#" className="hover:text-[var(--accent)]">
              X
            </a>
          </div>
        </div>
      </div>

      <p className="mt-5 text-center opacity-60">
        © {new Date().getFullYear()} DyTech. All rights reserved.
      </p>
    </footer>
  );
}
