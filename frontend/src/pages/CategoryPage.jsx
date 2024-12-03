import { useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore.js";
import { useEffect } from "react";
import { motion } from "framer-motion";

import ProductCard from "../components/ProductCard.jsx";

const CategoryPage = () => {
  const { fetchProductByCategory, products } = useProductStore();
  const { category } = useParams();

  useEffect(() => {
    fetchProductByCategory(category);
  }, [fetchProductByCategory, category]);

  console.log("products:", products);

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1
          className="text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.h1>

        <motion.div
          className="grid grid-cols sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {products?.length === 0 && (
            <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
              No Products found
            </h2>
          )}

          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryPage;