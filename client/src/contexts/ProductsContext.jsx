import { createContext, useContext, useEffect, useState } from "react";
import { getProducts } from "../services/productService.jsx";

const ProductsContext = createContext();
export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState({
    q: "",
    brand: "",
    colors: "",
    sizes: "",
    gender: "",
    fabric: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
    page: 1,
    limit: 20,
  });

  const fetchProducts = async () => {
    const res = await getProducts(filters);

    setProducts(res.data.products || []);

    setMeta({
      total: res.data.total ?? 0,
      page: res.data.page ?? 1,
      pages: res.data.pages ?? 1,
    });
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const goToPage = (p) => setFilters((prev) => ({ ...prev, page: p }));

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        meta,
        filters,
        updateFilter,
        goToPage,
        refreshProducts: fetchProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
