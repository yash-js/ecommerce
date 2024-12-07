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
    fetchRecommendations()
  }, []);

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold  text-[#febe03]">
        People Also Bought
      </h3>

      <div                   className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2"
      >
        {
          recommendations.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
