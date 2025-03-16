import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import { ApiHandler } from "../utils/ApiHandler";

const Tenant = () => {
  const navigate = useNavigate(); // Initialize navigation
  const rentalListings = [
    { type: "House", landlord: "John Doe", address: "123 Ocean Drive, Mumbai, Maharashtra", phone: "+1234567890", price: "$500/month", isAvailable: true },
    { type: "Vehicle", landlord: "Alice Smith", address: "456 Auto Lane, Bengaluru, Karnataka", phone: "+1987654321", price: "$1200/month", isAvailable: false },
    { type: "House", landlord: "Robert Brown", address: "789 Oak St, Chennai, Tamil Nadu", phone: "+1122334455", price: "$900/month", isAvailable: true },
    { type: "Vehicle", landlord: "Emily Davis", address: "101 Pine St, Delhi, Delhi", phone: "+1567890345", price: "$800/month", isAvailable: false },
    { type: "House", landlord: "Michael Lee", address: "303 Cedar St, Kolkata, West Bengal", phone: "+1654321098", price: "$1500/month", isAvailable: true },
    { type: "Vehicle", landlord: "Sophia Wilson", address: "505 Maple St, Hyderabad, Telangana", phone: "+1987456321", price: "$1000/month", isAvailable: true },
  ];

const fetchUserAssets = async (userId) => {
    try {
      const response = await fetch(`${config.apiUrl}assets/all/${userId}`, {
        method: "GET",  
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("User Assets:", data);

        const newAssets = Array.isArray(data.data.assets) ? data.data.assets : [data.data.assets];

        // Append the new assets to the existing ones
        setProperties([...properties, ...newAssets]);
        return data;
      } else {
        console.error("Failed to fetch assets:", data.message);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };
  


  useEffect(() => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        ApiHandler("users/current-user", "POST").then((data) => {
          console.log("User Data:", data);
          // navigate("/dashboard");
          fetchUserAssets(data.data._id); 
        }).catch((error) => {
          navigate("/login");
        });
      }
      else {
        navigate("/login")
      }
      
    }, []);

  const [selectedRental, setSelectedRental] = useState(null);
  const [filters, setFilters] = useState({
    landlord: "",
    location: "",
    type: "",
  });

  const filteredListings = rentalListings.filter(
    (item) =>
      item.landlord.toLowerCase().includes(filters.landlord.toLowerCase()) &&
      item.address.toLowerCase().includes(filters.location.toLowerCase()) &&
      item.type.toLowerCase().includes(filters.type.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-blue-100 p-4 sm:p-6 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 text-center mb-6">
        Rent with No Trust Issues
      </h1>

      {/* Filters Section */}
      <div className="w-full max-w-4xl mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Filter by Landlord"
          value={filters.landlord}
          onChange={(e) => setFilters({ ...filters, landlord: e.target.value })}
          className="p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Filter by Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="p-2 border border-gray-300 rounded-md"
        />
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">Filter by Type</option>
          <option value="house">House</option>
          <option value="vehicle">Vehicle</option>
        </select>
      </div>

      {/* Listings Table */}
      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Landlord</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-left">Phone</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.length > 0 ? (
              filteredListings.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-blue-50 cursor-pointer"
                  onClick={() => setSelectedRental(item)}
                >
                  <td className="py-3 px-4">{item.type}</td>
                  <td className="py-3 px-4">{item.landlord}</td>
                  <td className="py-3 px-4">{item.address}</td>
                  <td className="py-3 px-4">{item.phone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No listings match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Rental Details Modal */}
      {selectedRental && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Rental Details</h2>
            <p><strong>Type:</strong> {selectedRental.type}</p>
            <p><strong>Landlord:</strong> {selectedRental.landlord}</p>
            <p><strong>Address:</strong> {selectedRental.address}</p>
            <p><strong>Phone:</strong> {selectedRental.phone}</p>
            <p><strong>Price:</strong> {selectedRental.price}</p>
            {/* Only the "Proceed to Rent" button is shown now */}
            <button
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg w-full hover:bg-green-700"
              onClick={() => navigate("/contract", { state: { rental: selectedRental } })}
            >
              Proceed to Rent
            </button>
            <button
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg w-full"
              onClick={() => setSelectedRental(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tenant;
