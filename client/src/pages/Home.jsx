import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-6">
      <h1 className="text-5xl lg:text-6xl font-bold text-(--accent) drop-shadow mb-6">
        Quality Meets Affordability
      </h1>

      <p className="max-w-2xl text-lg opacity-90 mb-10">
        Original international brands and premium in-house clothing — crafted to
        bridge the gap between luxury and accessibility.
      </p>

      <div className="flex gap-4">
        <Link
          to="/catalog"
          className="
            px-8 py-3 rounded bg-(--accent)
            text-(--deep) font-semibold text-lg
          "
        >
          Shop Now
        </Link>

        <Link
          to="/about"
          className="
            px-8 py-3 rounded border border-(--accent)
            text-(--accent) text-lg
          "
        >
          About Us
        </Link>
      </div>

      <div className="absolute bottom-6 opacity-20 text-sm">
        Inspired. Designed. Delivered.
      </div>
    </div>
  );
}
