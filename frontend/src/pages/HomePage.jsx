import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../store/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import { ProductSlider } from "../components/Product/ProductSlider";

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading, categories } =
    useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <>
      <ProductSlider />
      <div className="relative min-h-screen bg-[#fef4d7] text-[#4d3900] overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {!isLoading && products.length > 0 && (
            <FeaturedProducts featuredProducts={products} />
          )}
          <h1 className="text-center text-5xl sm:text-6xl font-bold text-[#febe03] mb-4">
            Explore Our Categories
          </h1>
          <p className="text-center text-xl text-[#804e01] mb-12">
            Discover the latest trends in eco-friendly fashion
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <CategoryItem category={category} key={category.name} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
