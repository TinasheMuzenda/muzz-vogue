import { useProducts } from "../contexts/ProductsContext.jsx";

const SearchBar = () => {
  const { updateFilter, filters } = useProducts();

  return (
    <div className="w-full mb-4">
      <input
        value={filters.q}
        onChange={(e) => updateFilter("q", e.target.value)}
        placeholder="Search products..."
        className="
          w-full px-4 py-2 rounded-md 
          bg-(--deep) text-(--light)
          placeholder-(--accent-dark)
          border border-(--accent-dark)
          focus:outline-none focus:ring-2 focus:ring-(--accent)
        "
      />
    </div>
  );
};

export default SearchBar;
