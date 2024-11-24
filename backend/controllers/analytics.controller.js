import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getAnalytics = async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailySalesData = await getDailySalesData(startDate, endDate);
    res.json({
      analyticsData,
      dailySalesData,
    });
  } catch (error) {
    res.status(500).json({  error: error.message });
  }
};

const getAnalyticsData = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

const getDailySalesData = async (startDate, endDate) => {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    // This will return sales data for the last 7 days

    const dateArray = getDatesInRange(startDate, endDate); // get range of dates

    return dateArray.map((date) => {
      const salesData = dailySalesData.find((d) => d._id === date);
      return {
        date,
        sales: salesData ? salesData.sales : 0,
        revenue: salesData ? salesData.revenue : 0,
      };
    });
  } catch (error) {
    throw error;
  }
};

const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};
