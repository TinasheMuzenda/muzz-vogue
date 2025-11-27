import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();
  const [tapCount, setTapCount] = useState(0);

  const handleHiddenTap = () => {
    setTapCount((prev) => {
      const next = prev + 1;
      if (next >= 7) navigate("/admin/login");
      return next;
    });
  };

  return (
    <div className="min-h-screen p-6 bg-(--bg) text-(--light) flex flex-col items-center">
      <div
        onClick={handleHiddenTap}
        className="text-4xl mb-6 text-(--accent) font-semibold cursor-pointer user-select-none"
      >
        The Origin Story
      </div>

      <div className="max-w-2xl bg-(--deep) border border-(--accent-dark) p-6 rounded-md leading-relaxed">
        <p className="mb-4">
          This clothing brand was created with one purpose: to bridge the gap
          between{" "}
          <span className="text-(--accent)">quality and price</span>. For
          too long, premium international clothing has been out of reach for
          many people — we are changing that.
        </p>

        <p className="mb-4">
          We focus on providing original international brands and producing our
          own high-quality garments made for everyday wear. Our mission is
          simple: offer exceptional clothing without the luxury-brand markup.
        </p>

        <p className="mb-4">
          Whether you are shopping for men's, women's, or unisex items, this
          platform is built to give you trust, transparency, and a seamless
          shopping experience.
        </p>

        <p className="opacity-70">
          To continue browsing, use the return button below.
        </p>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 bg-(--accent) text-(--deep) rounded"
      >
        Return to Shop
      </button>
    </div>
  );
}
