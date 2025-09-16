import styled from "styled-components";

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0px;
  background: #fff;
  // border-bottom: 1px solid #eee;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  // gap: 15px;
`;

export const BackButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: #2d4ed8; /* blue */
  display: flex;
  align-items: center;
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Icon = styled.img`
  width: 52px;
  height: 52px;
`;

export const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #3352BA;
  text-transform: capitalize;
  font-family: Satoshi;
font-weight: 700;
font-style: Bold;
font-size: 22px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;
margin-bottom:4px;
`;

export const Subtitle = styled.p`
  font-size: 12px;
  margin: 0;
  color: #3352BA; /* gray */
  font-family: Raleway;
font-weight: 300;
font-style: Light;
font-size: 0.9rem;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;

`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #c7c7f7;
  border-radius: 8px;
  padding: 6px 10px;
  color: #6b6be3;
  background: #fff;
`;

export const SearchInput = styled.input`
  border: none;
  outline: none;
  margin-left: 6px;
  font-size: 14px;
  color: #333;

  &::placeholder {
    color: #a0a0d0;
  }
`;
