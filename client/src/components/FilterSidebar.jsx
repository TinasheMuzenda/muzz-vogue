import { useProducts } from "../contexts/ProductsContext.jsx";

const FilterSidebar = () => {
  const { updateFilter, filters } = useProducts();

  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-lg mb-2 text-[var(--accent)]">{title}</h3>
      {children}
    </div>
  );

  return (
    <aside
      className="
        w-full lg:w-64 p-4 rounded-md
        bg-[var(--deep)] text-[var(--light)]
        border border-[var(--accent-dark)]
        h-max
      "
    >
      <Section title="Brand">
        <input
          value={filters.brand}
          onChange={(e) => updateFilter("brand", e.target.value)}
          placeholder="e.g. Nike"
          className="w-full px-3 py-2 rounded bg-[var(--bg)] border border-[var(--accent-dark)]"
        />
      </Section>

      <Section title="Gender">
        <select
          value={filters.gender}
          onChange={(e) => updateFilter("gender", e.target.value)}
          className="w-full px-3 py-2 rounded bg-[var(--bg)] border border-[var(--accent-dark)]"
        >
          <option value="">All</option>
          <option value="male">Men</option>
          <option value="female">Women</option>
          <option value="unisex">Unisex</option>
        </select>
      </Section>

      <Section title="Color">
        <input
          onChange={(e) => updateFilter("colors", e.target.value)}
          placeholder="red, blue"
          className="w-full px-3 py-2 rounded bg-[var(--bg)] border border-[var(--accent-dark)]"
        />
      </Section>

      <Section title="Size">
        <input
          onChange={(e) => updateFilter("sizes", e.target.value)}
          placeholder="S,M,L"
          className="w-full px-3 py-2 rounded bg-[var(--bg)] border border-[var(--accent-dark)]"
        />
      </Section>

      <Section title="Price Range">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            onChange={(e) => updateFilter("minPrice", e.target.value)}
            className="w-full px-3 py-2 rounded bg-[var(--bg)] border border-[var(--accent-dark)]"
          />
          <input
            type="number"
            placeholder="Max"
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            className="w-full px-3 py-2 rounded bg-[var(--bg)] border border-[var(--accent-dark)]"
          />
        </div>
      </Section>
    </aside>
  );
};

export default FilterSidebar;
