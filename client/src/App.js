import React from 'react';
import './App.css';
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import { Routes, Route } from "react-router-dom";

// Components
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import MakeReservation from './components/MakeReservation/MakeReservation';
import Registration from './components/Registration/Registration';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';
import Oops from './components/Oops/Oops';
import BuoyService from './components/BuoyService/BuoyService';
import WelcomePage from './components/WelcomePage/WelcomePage';
import PlaceOrder from './components/PlaceOrder/PlaceOrder';
import { useAuth } from './services/authContext';

// Stripe needed this high
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
const stripePromise = loadStripe('pk_test_51PSz2oAvUlxCogr1KbdD2rtKr4pTqWbDyqiAIWcrakoBbP6QUck8Pe4NdDeKVPFa5JUdxWNLzlzXQgA1pa4fz3tq005YgHSYTg');

function App() {

  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path="/reservation" element={<MakeReservation />} />  {/* for common user logged in only */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />  {/* for admin only */}
        <Route path="/profile" element={<Profile />} />  {/* for common user logged in only */}
        <Route path="/oops" element={<Oops />} />
        <Route path="/buoyservice" element={
          <Elements stripe={stripePromise}>
            <BuoyService />     
          </Elements>
        } />  {/* berth reservatio */}
        <Route path="/order" element={<PlaceOrder />} />  {/* for common user logged in only */}
        <Route path="*" element={<Oops />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
