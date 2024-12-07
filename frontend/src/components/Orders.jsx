import { motion } from "framer-motion";
import { Star, Trash } from "lucide-react";
import React, { useState } from "react";
import { useProductStore } from "../store/useProductStore"; // Assuming it's still required
import Modal from "./Modal";

const orderItems = [
  {
    id: 1,
    name: "Product 1",
    price: "$10",
    customer: "John Doe",
    email: "john@example.com",
    status: "Pending",
  },
  {
    id: 2,
    name: "Product 2",
    price: "$20",
    customer: "Evan Doe",
    email: "evan@example.com",
    status: "Delivered",
  },
  {
    id: 3,
    name: "Product 3",
    price: "$30",
    customer: "Adam Doe",
    email: "adam@example.com",
    status: "Shipped",
  },
];

const Orders = () => {
  const { deleteProduct, loading } = useProductStore(); // Assuming these are used for some actions
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <motion.div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      <div className="flex justify-between items-center p-4 border-b mb-2">
        <h1 className="text-xl font-bold text-[#4d3900]">Orders</h1>
      </div>
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#4d3900] uppercase tracking-wider"
            >
              Product
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#4d3900] uppercase tracking-wider"
            >
              Price
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#4d3900] uppercase tracking-wider"
            >
              Customer
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#4d3900] uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#4d3900] uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-[#fffefb] divide-y divide-gray-200">
          {orderItems.map((order) => (
            <tr key={order.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-[#4d3900]">{order.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-[#4d3900]">{order.price}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-[#4d3900]">{order.customer}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-[#4d3900]">{order.status}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  disabled={loading}
                  onClick={() => alert("Deleting order")}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <div>Order Details Form</div>
        </Modal>
      )}
    </motion.div>
  );
};

export default Orders;
