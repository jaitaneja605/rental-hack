import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import html2canvas from "html2canvas";

const Contract = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rental = location.state?.rental;
  const sigPad = useRef(null);
  const [signed, setSigned] = useState(false);
  const [date, setDate] = useState("");
  const [agreed, setAgreed] = useState(false);

  if (!rental) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-2xl font-bold text-red-500">No Rental Data Found</h2>
        <button 
          onClick={() => navigate("/tenant")} 
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  const clearSignature = () => {
    sigPad.current.clear();
    setSigned(false);
  };

  const saveAsJpg = () => {
    html2canvas(document.getElementById("contract")).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/jpeg");
      link.download = "rental_contract.jpg";
      link.click();
    });
  };

  const proceedToPayment = () => {
    navigate("/payment", { state: { rental } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div id="contract" className="bg-white shadow-xl rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Rental Agreement Contract</h1>

        <div className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Property Details</h2>
          <p className="text-gray-600"><strong>Type:</strong> {rental.type}</p>
          <p className="text-gray-600"><strong>Address:</strong> {rental.address}</p>
          <p className="text-gray-600"><strong>Price:</strong> ₹{rental.price}</p>
        </div>

        <div className="mb-4">
          <label className="text-lg font-semibold block mb-2 text-gray-700">Agreement Date:</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="mt-6">
          <p className="text-lg font-semibold text-gray-700 mb-2">Tenant Signature:</p>
          <SignatureCanvas
            ref={sigPad}
            canvasProps={{ className: "w-full h-32 border border-gray-400 rounded-md" }}
            onEnd={() => setSigned(true)}
          />
          <button 
            onClick={clearSignature} 
            className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 transition text-white rounded-lg"
          >
            Clear Signature
          </button>
        </div>

        <div className="mt-4 flex items-center">
          <input 
            type="checkbox" 
            id="agree" 
            checked={agreed} 
            onChange={() => setAgreed(!agreed)} 
            className="mr-2"
          />
          <label htmlFor="agree" className="text-gray-700">I agree to the terms and conditions.</label>
        </div>

        <div className="flex justify-between mt-6">
          <div className="flex-shrink-0">
            <button 
              onClick={() => navigate("/tenant")} 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg"
            >
              Back to Listings
            </button>
          </div>
          <div className="flex flex-col space-y-2">
            {signed && agreed && (
              <>
                <button 
                  onClick={proceedToPayment} 
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 transition text-white rounded-lg"
                >
                  Proceed to Pay
                </button>
                <button 
                  onClick={saveAsJpg} 
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 transition text-white rounded-lg"
                >
                  Download
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contract;
