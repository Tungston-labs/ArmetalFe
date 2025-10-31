// src/Components/Sidebar.styles.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const SidebarContainer = styled.div`
  width: 350px;
  min-width: 60px;
  // height: 100vh;
  background: linear-gradient(181deg, rgba(23, 37, 84, 1) 20%, rgba(51, 82, 186, 1) 100%);
  color: white;
  // display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  top: 0;
  left: 0;
  z-index: 100;
  overflow-y: auto;

  &.collapsed {
    width: 60px;
  }

  @media (max-width: 1024px) {
    width: 200px;

    &.collapsed {
      width: 60px;
    }
  }

  @media (max-width: 768px) {
    width: 60px;
  }
    @media (min-width: 2560px) {
    width: 20%;
  }
`;


export const TopSection = styled.div`
  padding: 20px;
  text-align: center;
`;

export const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0;
  width: 100%;

  img {
    width: 180px;
    max-height: 110px;
    object-fit: contain;
    transition: width 0.3s ease;
  }

  img.default-logo {
    width: 300px;
    max-height: 110px;
  }

  /* Adjust logo for smaller screens */
  @media (max-width: 1024px) {
    img {
      width: 120px;
    }
    img.default-logo {
      width: 150px;
    }
  }

  /* Hide logo on very small screens */
  @media (max-width: 768px) {
    display: none;
  }

  &.hidden {
    display: none;
  }
   @media (min-width: 2560px) {
    img{
    min-height: 150px;
    margin-block: 2rem;
    }
   }
   @media (min-width: 3840px) {
    img{
    min-height: 250px;
    margin-block: 5rem;
    }
   }
`;





export const Nav = styled.ul`
  list-style: none;
  margin: 0;
  padding: 10px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  
   @media (min-width: 2560px) {
    gap: 1.5rem;
  }
   @media (min-width: 3840px) {
    gap:2.5rem;
  }
`;

export const BottomSection = styled.div`
  position: absolute;
  bottom: 5px;
  left:0px;
  // width: 100%;
  // padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Logout icon/button
export const LogoutButton = styled.button`
  font-size: 28px;
  color: red;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

// Change Password link
export const ChangePasswordLink = styled(Link)`
  font-size: 14px;
  color: white;
  text-decoration: none;
  cursor: pointer;
margin-left:30px;
  &:hover {
    color:blue;
    
  }


  

  
`;

export const ToggleButton = styled.button`
  display: none;
  background: none;
  color: white;
  border: none;
  font-size: 20px;
  margin-bottom: 10px;
  cursor: pointer;

  @media (max-width: 1024px) {
    display: block;
  }
`;

export const CustomLink = styled(Link)`
  width: 80%;
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  font-size: clamp(1rem, 1vw, 1.5rem);
  color: white;
  font-weight: 600;
  text-decoration: none;
  font-family: Satoshi, sans-serif;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  svg,
  img {
    margin-right: 12px;
    transition: filter 0.3s ease, margin 0.3s ease, color 0.3s ease;
  }

  span {
    white-space: nowrap;
    transition: opacity 0.3s ease, width 0.3s ease, color 0.3s ease;
  }

  &:hover {
    background: white;
    color: #172554;

    svg {
      color: #172554;
    }

    img {
      /* ✅ Blue tint for hover */
      filter: brightness(0) saturate(100%) invert(9%) sepia(40%) saturate(4410%) hue-rotate(217deg) brightness(95%) contrast(105%);
    }
  }

  &.active {
    background: white;
    color: #172554;

    svg {
      color: #172554;
    }

    img {
      /* ✅ Same blue tint for active state */
      filter: brightness(0) saturate(100%) invert(9%) sepia(40%) saturate(4410%) hue-rotate(217deg) brightness(95%) contrast(105%);
    }

    &::after {
      content: "";
      position: absolute;
      bottom: 4px;
      left: 10%;
      width: 80%;
      height: 3px;
      background: rgb(255, 255, 255);
      border-radius: 2px;
    }
  }

  &.collapsed {
    justify-content: center;

    span {
      display: none;
    }

    svg,
    img {
      margin-right: 0;
    }
  }

  @media (max-width: 768px) {
    justify-content: center;

    span {
      display: none;
    }

    svg,
    img {
      margin-right: 0;
    }
  }

  @media (min-width: 2560px) {
    font-size: 2rem;
    padding-block: 1rem;
    padding-inline: 1.5rem;
    border-radius: 1rem;
  }

  @media (min-width: 3840px) {
    font-size: 3rem;
    padding-block: 1.5rem;
    padding-inline: 2rem;
    border-radius: 2rem;
  }
`;
export const LinkIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
  vertical-align: middle;
  transition: filter 0.3s ease;

  /* default: white color */
  filter: brightness(0) invert(1);
`;


