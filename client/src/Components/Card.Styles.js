import styled from "styled-components";
const breakpoints = {
  mobile: "480px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "1440px",
  tv: "2560px",     // 2K / QHD screens
  largeTv: "3840px" // 4K UHD screens
};
export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* default for desktops */
  gap: 1rem;
  margin: 0.5rem;
  background: #f4f4f4;

  /* 📱 Mobile */
  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }

  /* 📱 Tablets */
  @media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.laptop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* 💻 Standard desktops */
  @media (min-width: ${breakpoints.laptop}) and (max-width: ${breakpoints.desktop}) {
    grid-template-columns: repeat(3, 1fr);
  }

  /* 🖥️ 2K / QHD screens */
  @media (min-width: ${breakpoints.tv}) and (max-width: ${breakpoints.largeTv}) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    max-width: 90%;
    margin: 0 auto;
  }

  /* 🖥️ 4K screens */
  @media (min-width: ${breakpoints.largeTv}) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    max-width: 80%;
    margin: 0 auto;
  }
`;



export const Card = styled.div`
  position: relative;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  padding: 1rem;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.12);
  }

  /* 📱 Tablets */
  @media (max-width: ${breakpoints.laptop}) {
    padding: 0.8rem;
  }

  /* 📱 Mobile */
  @media (max-width: ${breakpoints.mobile}) {
    padding: 0.6rem;
    border-radius: 8px;
    font-size: 0.9rem;
  }

  /* 🖥️ 2K and above */
  @media (min-width: ${breakpoints.tv}) {
    padding: 1.5rem;
  }

  /* 🖥️ 4K */
  @media (min-width: ${breakpoints.largeTv}) {
    padding: 2rem;
    border-radius: 16px;
  }
`;


export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const IconSection = styled.div`
  display: flex;
  min-width: 35px;
  margin-left: 10px;
  margin-top: 10px;
  color: #304EB0;

  @media (max-width: ${breakpoints.mobile}) {
    margin-left: 5px;
    margin-top: 5px;
    min-width: 25px;
  }
`;

export const Divider = styled.div`
  position: absolute;             
  top: 0;
  bottom: 0;
  left: 60px;                    
  width: 3px;
  background: #3352ba;
  border-radius: 4px;

  /* ❌ Hide divider up to 1654px */
  @media (max-width: 1654px) {
    display: none;
  }

  /* ✅ Show and style again from 1655px+ */
  @media (min-width: 1655px) and (max-width: ${breakpoints.largeTv}) {
    display: block;

    width: 4px;
    left: 70px;
  }

  /* 🖥️ 4K screens */
  @media (min-width: ${breakpoints.largeTv}) {
    display: block;
    margin-left: 10px;
    width: 5px;
    left: 80px;
  }
`;


export const CardContent = styled.div`
  flex: 1;
  padding: 1rem;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 0.5rem;
  }
`;

export const CardTitle = styled.h3`
  font-size: clamp(1rem, 1.2vw, 2.5rem);
  font-weight: 700;
  font-family: Satoshi, sans-serif;
  margin-left: 10px;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1rem;
  }

  @media (min-width: ${breakpoints.large}) {
    font-size: 2.8rem;
  }
`;

export const CardCount = styled.span`
  font-size: clamp(1rem, 1.5vw, 2.5rem);
  font-weight: bold;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.2rem;
  }

  @media (min-width: ${breakpoints.large}) {
    font-size: 3rem;
  }
`;

export const CardList = styled.div`
  margin-top: 0.8rem;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const CardListItem = styled.div`
  display: grid;
  grid-template-columns: 20px 0.5fr 1fr 1fr;
  align-items: center;
  font-size: 0.7rem;
  padding: 0.2rem 15px;
  gap: 0.5rem;

  @media (max-width: ${breakpoints.laptop}) {
    grid-template-columns: 40px 1fr 1fr;
  }

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 40px 1fr;
    font-size: 0.8rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 30px 1fr;
    font-size: 0.75rem;
    gap: 0.3rem;

    img {
      width: 25px !important;
      height: 25px !important;
      margin-right: 5px !important;
    }
  }
`;

export const EmployeeAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ccc;

  @media (max-width: ${breakpoints.mobile}) {
    width: 24px;
    height: 24px;
  }
`;

export const EmployeeName = styled.span`
  font-weight: 500;
  font-size: clamp(0.75rem, 0.5vw, 1.8rem);

  @media (min-width: ${breakpoints.large}) {
    font-size: 1.5rem;
  }
`;

export const EmployeeId = styled.div`
  font-size: clamp(0.75rem, 0.5vw, 1.8rem);
  color: #666;

  .from-date,
  .to-date {
    display: inline;
  }
  .continue-sign {
    display: none;
  }

  @media (min-width: ${breakpoints.laptop}) and (max-width: ${breakpoints.desktop}) {
    .to-date {
      display: none;
    }
    .continue-sign {
      display: inline;
    }
  }
`;

export const EmployeeDept = styled.span`
  color: #777;
  font-size: clamp(0.75rem, 0.5vw, 1.8rem);
`;

export const IconWrapper = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  color: #3352BA;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.3);
    color: #3352BA;
  }

  /* 📱 Mobile */
  @media (max-width: ${breakpoints.mobile}) {
    bottom: 5px;
    right: 5px;
    font-size: 0.8rem; /* shrink icon */
  }

  /* 📱 Tablet */
  @media (max-width: ${breakpoints.tablet}) {
    bottom: 8px;
    right: 8px;
    font-size: 1rem;
  }

  /* 🖥️ 2K */
  @media (min-width: ${breakpoints.tv}) {
    right: 15px;
    bottom: 15px;
    font-size: 1.5rem; /* bigger icon */
  }

  /* 🖥️ 4K */
  @media (min-width: ${breakpoints.largeTv}) {
    right: 20px;
    bottom: 20px;
    font-size: 2rem;
  }
`;
