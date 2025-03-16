import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ApiHandler } from "../utils/ApiHandler";

const Dashboard = () => {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const [user,setUser]=useState(null);
  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      ApiHandler("users/current-user", "POST").then((data) => {
        setUser(data.data);
        console.log(data.data);
        // navigate("/dashboard");
      }).catch((error) => {
        navigate("/login");
      });
    }
    else{
      navigate("/login")
    }
  }, []);


  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-300 to-pink-400">
      {/* Heading Section */}
      <div className="flex justify-center items-center py-6 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white bg-gradient-to-r from-purple-700 to-pink-500 px-6 py-3 rounded-2xl shadow-lg animate-pulse text-center">
          Welcome to SafeRent 🏡
        </h1>
      </div>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gradient-to-b from-purple-600 to-pink-500 text-white p-6 flex flex-col shadow-lg rounded-lg">
          <div className="flex flex-col items-center space-y-6">
            <button
              className="w-full p-3 bg-gradient-to-r from-purple-700 to-pink-600 rounded-lg text-lg font-semibold hover:from-purple-800 hover:to-pink-700 transition duration-300 focus:ring-2 focus:ring-pink-400"
              onClick={toggleProfile}
            >
              Profile
            </button>

            {showProfile && (
              <div className="mt-6 p-4 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-300 w-full">
                <h2 className="text-xl font-bold text-purple-800">Personal Information</h2>
                <p><strong>Name:</strong> {user?.fullName}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Phone:</strong> {user?.phone}</p>
              </div>
            )}

            {/* Assets Button */}
            <button
              className="w-full p-3 mt-6 bg-gradient-to-r from-blue-500 to-green-400 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-green-500 transition duration-300 focus:ring-2 focus:ring-green-400"
              onClick={() => navigate("/landlord")}
            >
              Assets
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col md:flex-row items-center justify-between p-6 md:p-10 gap-6">
          {/* Question Section */}
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full md:w-1/2 border border-gray-300 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Do you want to rent or lease rent?
            </h2>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <button 
                className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-pink-400 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-500 transition duration-300 focus:ring-2 focus:ring-pink-400"
                onClick={() => navigate("/tenant")}
              >
                Rent
              </button>
              <button 
                className="w-full md:w-auto bg-gradient-to-r from-pink-500 to-red-400 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-red-500 transition duration-300 focus:ring-2 focus:ring-pink-400"
                onClick={() => navigate("/landlord")}
              >
                List
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="https://freepngimg.com/thumb/rent/35359-3-rent-transparent.png"
              alt="Dashboard Visual"
              className="w-full max-w-xs md:max-w-md h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
