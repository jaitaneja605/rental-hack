import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { SimpleApiHandler } from "../utils/ApiHandler";
import config from "../config";
import store from "../store.js";
import axios from 'axios';


const UserProfileForm = () => {
  const [load,setLoad]=useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    aadhaar: null,
    pan: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, [e.target.name]: file });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("aadhaar", formData.aadhaar);
    formDataToSend.append("pan", formData.pan);
    await fetch(config.apiUrl + "users/register", {
      method: "POST",
      body: formDataToSend,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          navigate("/login");
          store.addMessage({ type: "Success", content: data.message });
        } else {
          throw new Error(data.message);
        }
      })
      .catch((err) => {
        store.addMessage({ type: "Danger", content: err.message });
      })
      .finally(() => {
        setLoad(false);
      });
    // navigate("/dashboard"); // Redirects to the Dashboard
  };

  return (
    <>
    {load && <Loading />}
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 to-purple-400 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Register</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email ID" className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone No" className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>
          
          {/* Aadhar Card Upload */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Upload Aadhar Card:</label>
            <input type="file" name="aadhaar" accept="image/jpeg, image/png" onChange={handleFileChange} className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            {formData.aadhaar && (
              <div className="mt-2">
                <img src={URL.createObjectURL(formData.aadhaar)} alt="Aadhar Card" className="w-32 h-32 object-cover rounded-lg border" />
              </div>
            )}
          </div>

          {/* PAN Card Upload */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Upload PAN Card:</label>
            <input type="file" name="pan" accept="image/jpeg, image/png" onChange={handleFileChange} className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            {formData.pan && (
              <div className="mt-2">
                <img src={URL.createObjectURL(formData.pan)} alt="PAN Card" className="w-32 h-32 object-cover rounded-lg border" />
              </div>
            )}
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition duration-200">
            Register
          </button>
        </form>
      </div>
    </div>
    </>
  );

};

export default UserProfileForm;
