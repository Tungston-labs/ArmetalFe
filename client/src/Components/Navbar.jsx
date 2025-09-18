import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";
import { FiEye, FiEyeOff } from "react-icons/fi";
import API from "../services/api";
import { useLogout } from "../services/logout"; // adjust path
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../Redux/authSlice";
import Swal from "sweetalert2";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null); // 👈 reference for outside click

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

const dispatch = useDispatch();
const logout = useLogout();

const handleLogoutClick = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to logout?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    // Show the success message first
    await Swal.fire({
      title: 'Logged out!',
      text: 'You have been successfully logged out.',
      icon: 'success',
      confirmButtonColor: '#3085d6',
    });

    // Then call logout & clear Redux state
    await logout();
    dispatch(logoutAction());

    setMenuOpen(false);
  }
};



  const handlePasswordChange = async () => {
    setLoading(true);
    try {
      await API.post("http://178.248.112.16:8001/api/change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
      });

      setMessage("Password changed successfully ✅");
      setTimeout(() => {
        setShowChangeModal(false);
        setOldPassword("");
        setNewPassword("");
        setMessage("");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Password change failed ❌");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TopBar>
        <div />
        <DropdownWrapper ref={dropdownRef}>
          <HRManager onClick={() => setMenuOpen(!menuOpen)}>
            <img src="/images/user.jpg" alt="HR Manager" />
            <IoIosArrowDown
              size={18}
              style={{ marginLeft: "5px", cursor: "pointer" }}
            />
          </HRManager>

          {menuOpen && (
            <DropdownMenu>
              <div
                onClick={() => {
                  setShowChangeModal(true);
                  setMenuOpen(false); // close after click
                }}
              >
                Change Password
              </div>
              <div onClick={handleLogoutClick}>Logout</div>
              </DropdownMenu>
          )}
        </DropdownWrapper>
      </TopBar>

      {/* Password Change Modal */}
      {showChangeModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "10px",
              width: "400px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowChangeModal(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                border: "none",
                background: "transparent",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>

            <h2>Change Password</h2>

            {/* Old Password */}
            <div style={{ position: "relative", marginTop: "15px" }}>
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  paddingRight: "40px",
                }}
              />
              <span
                onClick={() => setShowOldPassword(!showOldPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                {showOldPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </span>
            </div>

            {/* New Password */}
            <div style={{ position: "relative", marginTop: "15px" }}>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  paddingRight: "40px",
                }}
              />
              <span
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                {showNewPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </span>
            </div>

            {/* Submit Button with Spinner */}
            <button
              onClick={handlePasswordChange}
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "10px",
                backgroundColor: loading ? "gray" : "blue",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    className="spinner"
                    style={{
                      width: "18px",
                      height: "18px",
                      border: "2px solid #fff",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  Changing...
                </div>
              ) : (
                "Change Password"
              )}
            </button>

            {message && (
              <p
                style={{
                  marginTop: "10px",
                  color: message.toLowerCase().includes("success")
                    ? "green"
                    : "red",
                  fontWeight: "bold",
                }}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;

// Spinner animation
const style = document.createElement("style");
style.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(style);

// Styled Components
export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  @media (min-width: 3840px) {
   height: 100px;
  }
`;

export const HRManager = styled.div`
  display: flex;
  height: 30px;
  align-items: center;
  padding: 0.3rem;
  background-color: #fff;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  margin-top: 10px;

  img {
    width: 40px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
  @media (min-width:3840px) {
    img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }
  }
`;

export const DropdownWrapper = styled.div`
  position: relative;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: 40px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 100;

  div {
    padding: 10px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background: #f5f5f5;
    }
  }
`;
