import React, { useEffect } from "react";
import ProductCard from "../components/ProductCard";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const PeopleAlsoBought = () => {
  const [recommendations, setRecommendations] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        await axios.get("/products/recommendations").then((response) => {
          setRecommendations(response.data);
        });
      } catch (error) {
        toast.error(error.response.data.error || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
  }, []);

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People Also Bought
      </h3>

      <div className="mt-6 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {
          recommendations.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
