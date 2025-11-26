import SearchBar from "../components/SearchBar.jsx";
import SortBar from "../components/SortBar.jsx";
import FilterSidebar from "../components/FilterSidebar.jsx";
import ProductGrid from "../components/ProductGrid.jsx";

const Catalog = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      <div className="lg:w-64">
        <FilterSidebar />
      </div>

      <div className="flex-1">
        <SearchBar />
        <SortBar />
        <ProductGrid />
      </div>
    </div>
  );
};

export default Catalog;
