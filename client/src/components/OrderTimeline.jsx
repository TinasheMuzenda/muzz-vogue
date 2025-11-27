const steps = [
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "dispatched", label: "Dispatched" },
  { key: "delivering", label: "Out For Delivery" },
  { key: "delivered", label: "Delivered" },
];

export default function OrderTimeline({ status }) {
  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="w-full mt-6">
      <div className="flex justify-between relative">
        {steps.map((s, i) => {
          const active = i <= currentIndex;

          return (
            <div key={s.key} className="flex flex-col items-center flex-1">
              {i !== 0 && (
                <div
                  className={`
                    h-1 w-full -mb-3
                    transition-all duration-500 ease-in-out
                    ${active ? "bg-(--accent)" : "bg-(--accent-dark)"}
                  `}
                />
              )}

              <div
                className={`
                  w-6 h-6 rounded-full border-2 
                  flex items-center justify-center
                  transition-all duration-500 ease-in-out
                  transform ${active ? "scale-110" : "scale-100"}
                  ${
                    active
                      ? "bg-(--accent) border-(--accent) text-(--deep)"
                      : "bg-(--bg) border-(--accent-dark) text-(--accent-dark)"
                  }
                `}
              >
                {i + 1}
              </div>

              <span
                className={`
                  mt-2 text-sm
                  transition-colors duration-500
                  ${active ? "text-(--accent)" : "text-(--accent-dark)"}
                `}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
