// src/Components/Sidebar.styles.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const SidebarContainer = styled.div`
  width: 250px;
  min-width: 60px;
  height: 100vh;
  background: linear-gradient(181deg, rgba(23, 37, 84, 1) 20%, rgba(51, 82, 186, 1) 100%);
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  // position: fixed;
  top: 0;
  left: 0;
  z-index: 100;

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
`;

export const TopSection = styled.div`
  padding: 20px;
  text-align: center;
`;

export const Logo = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 50px 0 0 0;
  color: white;
  white-space: nowrap;

  &.hidden {
    display: none;
  }

  @media (max-width: 768px) {
    font-size: 18px;
    margin: 20px 0 0 0;
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
`;

export const BottomSection = styled.div`
  padding: 20px;
  text-align: center;
  margin-top: auto;
`;

export const LogoutButton = styled.button`
  background: #FF230426;
  font-size: 16px;
  font-weight: 700;
  color: white;
  border: 1px solid #a5b4fc;
  padding: 10px 16px;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    margin-right: 8px;
  }

  &:hover {
    background: rgba(255, 35, 4, 0.3);
  }

  @media (max-width: 768px) {
    font-size: 0;
    padding: 10px;

    svg {
      margin: 0;
    }
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
  font-size: 18px;
  color: white;
  font-weight: 600;
  text-decoration: none;
  font-family: Satoshi, sans-serif;
  transition: all 0.3s ease;
  cursor: pointer;

  svg {
    margin-right: 12px;
    transition: margin 0.3s ease;
  }

  span {
    white-space: nowrap;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: white;
    color: #172554;

    svg {
      color: #172554;
    }
  }

  &.collapsed {
    justify-content: center;

    span {
      display: none;
    }

    svg {
      margin-right: 0;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 0;

    svg {
      font-size: 20px;
    }
  }
`;
