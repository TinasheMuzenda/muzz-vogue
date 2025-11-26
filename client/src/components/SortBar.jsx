import { useProducts } from "../contexts/ProductsContext.jsx";

const SortBar = () => {
  const { updateFilter, filters } = useProducts();

  return (
    <div className="flex justify-end mb-4">
      <select
        value={filters.sort}
        onChange={(e) => updateFilter("sort", e.target.value)}
        className="
          px-4 py-2 rounded-md bg-[var(--deep)] text-[var(--light)]
          border border-[var(--accent-dark)]
        "
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low → High</option>
        <option value="price_desc">Price: High → Low</option>
      </select>
    </div>
  );
};

export default SortBar;
