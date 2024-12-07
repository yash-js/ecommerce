import React from "react";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useCartStore } from "../store/useCartStore";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role == "admin";
  const { cart } = useCartStore();

  return (
    <header className={isAdmin ? 'hidden' :"fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-[#febe03]"}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-[#febe03] items-center space-x-2 flex"
          >
            YellowWallDog
          </Link>
          <nav className="flex flex-wrap items-center gap-4">
            <Link
              className="text-gray-700 hover:text-[#febe03] transition duration-300 ease-in-out"
              to={"/"}
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to={"/cart"}
                  className="relative group text-gray-700 hover:text-[#febe03] transition duration-300 ease-in-out"
                >
                  <ShoppingCart
                    className="inline-block mr-1 group-hover:text-[#febe03]"
                    size={20}
                  />
                  <span className="hidden sm:inline">Cart</span>

                  {cart?.length > 0 && (
                    <span
                      className="absolute -top-2 -left-2 bg-[#febe03] text-white rounded-full px-2 py-0.5 
                      text-xs group-hover:bg-[#fabe42] transition duration-300 ease-in-out"
                    >
                      {cart?.length}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/dashboard"
                className="bg-[#febe03] hover:bg-[#fabe42] text-white px-3 py-1 rounded-md duration-300 font-medium ease-in-out flex items-center"
              >
                <Lock size={18} className="inline-block mr-1" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <button
                onClick={logout}
                className="bg-[#febe03] hover:bg-[#fabe42] text-white py-2 px-4 
    rounded-md flex items-center transition duration-300 ease-in-out"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="bg-[#febe03] hover:bg-[#fabe42] text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link
                  to={"/login"}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
