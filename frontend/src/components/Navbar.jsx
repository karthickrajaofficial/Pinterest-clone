import React from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiUser } from "react-icons/fi"; // Import the icons

const Navbar = ({ user }) => {
  return (
    <div className="bg-white shadow-md">
      <div className="mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Pinterest-logo.png/600px-Pinterest-logo.png"
            alt="Pinterest logo"
            className="h-8 md:h-10 lg:h-12" 
          />
          <span className="hidden md:block text-red-600 text-2xl md:text-3xl lg:text-4xl font-bold">Pinterest</span> 
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="border border-black py-2 px-4 bg-black rounded-3xl font-semibold text-white hover:text-red-600 transition-colors duration-300 text-sm md:text-base lg:text-lg"
          >
            Home
          </Link>

          <Link
            to="/create"
            className="flex items-center font-bold text-gray-700 hover:text-red-600 transition-colors duration-300 text-sm md:text-base lg:text-lg"
          >
            <FiPlus className="mr-1" />
            Create
          </Link>

          <div className="flex items-center space-x-2">
            <Link
              to="/account"
              className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-gray-300 flex items-center justify-center text-xl md:text-2xl lg:text-3xl font-semibold text-gray-700 hover:bg-gray-400 transition-colors duration-300"
            >
              <FiUser className="text-gray-700" />
              <span className="sr-only">Account</span>
            </Link>
            <span className="text-gray-700 font-semibold text-sm md:text-base lg:text-lg">{user.name}</span> {/* Adjust username size */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
