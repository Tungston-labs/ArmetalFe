// src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import {
  Container,
  LeftPanel,
  RightPanel,
  FormBox,
  Label,
  Input,
  Button,
  LeftHeader,
  Logo,
} from '../login/Login.styles';

import { HiArrowLeft } from "react-icons/hi"; // for the back arrow
import { FaChevronLeft } from "react-icons/fa6";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PunchLoader from '../../Components/Loader'; // ✅ adjust path if needed
import "@fontsource/anek-malayalam/400.css"; // Regular
import "@fontsource/anek-malayalam/700.css"; // Bold



const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState({ email: '' });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false); // ⏳ loader state

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ email: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true); // show loader

    try {
      await axios.post("http://178.248.112.16:8001/api/forgot-password/send-otp/", {
        email: formData.email,
      });

      setMessage("OTP sent to your email successfully.");
      
      // Navigate to verification page with email
      setTimeout(() => {
        navigate('/verification', { state: { email: formData.email } });
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false); // hide loader
    }
  };

  return (
    <>
      {loading && <PunchLoader text="Sending OTP..." />} {/* ✅ loader on top */}

      <Container>
        <LeftPanel>
          <LeftHeader>
          <Logo src="/images/logos.png" alt="ARMETAL Logo" />
            <h2 style={{ fontSize: 42 }}>Welcome Back</h2>
            <p>
              Manage your employees with ease.<br />
              Reset your password to access your HR dashboard.
            </p>
          </LeftHeader>
        </LeftPanel>

        <RightPanel>

<FormBox>
  {/* Title with back arrow */}
 <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px",marginLeft:"-40px" }}>
    <FaChevronLeft 
      size={30} 
      style={{ cursor: "pointer" }} 
      onClick={() => navigate(-1)} 
    />
    <h2 
      style={{ 
        fontSize: 40, 
        fontFamily: 'Satoshi', 
        margin: 0,
        textAlign: "left"   // ✅ left align heading
      }}
    >
      Forgot Password?
    </h2>
  </div>


  {/* Subtext */}
   <p
    style={{
      fontSize: 20,
      fontFamily: 'Raleway',
      color: "#686868",
      marginBottom: "20px",
      textAlign: "left",   // ✅ left align subtext
    }}
  >
    No worries, we’ll send you reset instructions.
  </p>

  <form onSubmit={handleSubmit}>
    <Label>Enter Email ID</Label>
    <Input
      type="email"
      name="email"
      placeholder="Email"
      value={formData.email}
      onChange={handleChange}
      required
    />
    <Button type="submit" style={{ marginTop: 20 }}>
      Send Reset Link
    </Button>

    {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
    {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}

    {/* Powered by in one line */}
    <p style={{ 
      marginTop: 200, 
      textAlign: "center", 
      fontFamily: "Satoshi, Anek Malayalam", 
      fontWeight: 400, 
      color: "#3250B5" 
    }}>
      <span style={{ fontFamily: "Satoshi", fontWeight: 400 }}>Powered by </span>
      <span style={{ fontFamily: "Anek Malayalam", fontWeight: 700 }}>REKORY</span>
    </p>
  </form>
</FormBox>

        </RightPanel>
      </Container>
    </>
  );
};

export default ForgotPasswordPage;
