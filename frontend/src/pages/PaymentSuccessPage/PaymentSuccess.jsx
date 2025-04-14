import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./PaymentSuccess.css";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PaymentSuccess = () => {
  useEffect(() => {
    const completePurchase = async () => {
      const productId = sessionStorage.getItem("purchasedProductId");
      const quantity = sessionStorage.getItem("purchasedQuantity");
      const totalCost = sessionStorage.getItem("purchasedTotalCost");
      const token = localStorage.getItem("token");
  
      if (productId && totalCost && quantity && token) {
        try {
          const response = await axios.post(
            `${BACKEND_URL}/api/payment/completeOrder`,
            { productId, quantity, totalCost },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            }
          );
  
          if (response.data.success) {
            sessionStorage.removeItem("purchasedProductId");
            sessionStorage.removeItem("purchasedQuantity");
            sessionStorage.removeItem("purchasedTotalCost");
          }
        } catch (error) {
          console.error("Order completion failed:", error.response?.data);
        }
      }
    };
    completePurchase();
  }, []);

  return (
    <div className="success-container">
      <div className="success-card">
        <h1 className="success-title">🎉 Payment Successful! 🎉</h1>
        <p className="success-message">
          Thank you for your purchase. Your payment has been processed
          successfully. 💸
        </p>

        <div className="button-container">
          <Link to="/" className="go-home-btn">
            🏠 Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
