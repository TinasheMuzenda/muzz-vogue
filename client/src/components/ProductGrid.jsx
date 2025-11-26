import ProductCard from "./ProductCard";
import { useProducts } from "../contexts/ProductsContext.jsx";

const ProductGrid = () => {
  const { products } = useProducts();

  return (
    <div
      className="
        grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
        gap-4 w-full
      "
    >
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
};

export default ProductGrid;
