import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage/Login";
import Register from "./pages/RegisterPage/Register"
import CustomToastContainer from "./components/ToastContainer";
import ForgotPassword from "./pages/ForgotPasswordPage/ForgotPassword";
import Authentication from "./pages/AuthenticationPage/Authentication";
import ResetPassword from "./pages/ResetPasswordPage/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import Profile from "./pages/ProfilePage/Profile";
import EditProfile from "./pages/EditProfilePage/EditProfile";
import SellProduct from "./pages/SellProductPage/SellProduct";
import Home from "./pages/HomePage/Home";
import ConsultDoctor from "./pages/ConsultDoctorPage/ConsultDoctor";
import UpdateProduct from "./pages/UpdateProductPage/UpdateProdut";
import Details from "./pages/DetailsPage/Details";
import Cart from "./pages/CartPage/Cart";

const RouterConfig = () => {
  return (
    <Router>
      <CustomToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/authentication" element={<Authentication />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/verifyEmail" element={<VerifyEmail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route path="/sellProduct" element={<SellProduct />} />
        <Route path="/updateProduct" element={<UpdateProduct />} />
        <Route path="/consultDoctor" element={<ConsultDoctor />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
};

export default RouterConfig;
