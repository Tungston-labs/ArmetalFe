import styled from "styled-components";

export const PageWrapper = styled.div`
  font-family: "Satoshi", sans-serif;
  background-color: #ffffff;
  padding: 20px ;
  color: #1e1e1e;
  min-height: 100vh;
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  /* gap: 1rem; */
  flex-wrap: wrap;
  background-color: #ffffff;
  margin-bottom: 1.5rem;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #3352ba;
  font-size: 1.6rem;
  cursor: pointer;
  transition: transform 0.2s ease;
margin-top: 10px;
  &:hover {
    transform: translateX(-3px);
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

export const HeaderTitle = styled.h1`
  font-size: 1.6rem;
  color: #3f64d7;
  margin: 0;
`;



export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  gap: 1.5rem;

  /* 🖥 3840px - Ultra 4K Displays */
  @media (min-width: 3840px) {
    margin-top: 4rem;
    gap: 2.5rem;
  }

  /* 💻 2560px - QHD Screens */
  @media (max-width: 2560px) {
    margin-top: 3rem;
    gap: 2rem;
  }
 @media (max-width: 1940px) {
    margin-top: 3rem;
    gap: 2rem;
  }
  /* 🖥 1440px - Common Desktops */
  @media (max-width: 1440px) {
    margin-top: 2.2rem;
    gap: 1.8rem;
  }

  /* 💻 1024px - Tablet Landscape */
  @media (max-width: 1024px) {
    margin-top: 1.8rem;
    gap: 1.5rem;
  }

  /* 📱 Tablets & Mobiles */
  @media (max-width: 768px) {
    margin-top: 1.3rem;
    gap: 1.2rem;
  }

  /* 📱 Small Phones */
  @media (max-width: 480px) {
    margin-top: 1rem;
    gap: 1rem;
  }
`;

export const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.2rem;

  div {
    flex: 1 1 48%;
    min-width: 220px;
    display: flex;
    flex-direction: column;
  }

  label {
    display: block;
    font-size: 17px;
    color: black;
    margin-bottom: 0.4rem;
    font-family: "Satoshi", sans-serif;
    font-weight: 400;
    line-height: 100%;
  }

  /* 🖥 3840px - Ultra 4K */
  @media (min-width: 3840px) {
    label {
      font-size: 2rem;
    }
    div {
      flex: 1 1 49%;
    }
  }

  /* 💻 2560px - QHD */
  @media (max-width: 2560px) {
    label {
      font-size: 20px;
    }
    gap: 1.2rem;
  }
  @media (max-width: 1940px) {
    label {
      font-size: 1rem;
    }
    div {
      flex: 1 1 47%;
    }
  }
  /* 🖥 1440px - Standard Desktop */
  @media (max-width: 1440px) {
    label {
      font-size: 1rem;
    }
    div {
      flex: 1 1 47%;
    }
  }

  /* 💻 1024px - Tablet Landscape */
  @media (max-width: 1024px) {
    div {
      flex: 1 1 100%;
      min-width: 100%;
    }
    label {
      font-size: 16px;
    }
  }

  /* 📱 Tablet Portrait */
  @media (max-width: 768px) {
    div {
      min-width: 100%;
    }
    label {
      font-size: 15px;
    }
  }

  /* 📱 Small Phones */
  @media (max-width: 480px) {
    gap: 0.8rem;
    margin-bottom: 1rem;
    label {
      font-size: 14px;
    }
  }
`;

export const InputField = styled.input`
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 17px;
  font-family: "Satoshi", sans-serif;
  font-weight: 400;
  color: #333;
  background-color: #fff;
  transition: all 0.2s ease;

  &:focus {
    border-color: #3f64d7;
    outline: none;
    box-shadow: 0 0 0 2px rgba(63, 100, 215, 0.2);
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }


  @media (min-width: 3840px) {
    font-size: 2rem;
    padding: 1.2rem;
    border-radius: 10px;
  }

  /* 💻 2560px - QHD */
  @media (max-width: 2560px) {
    font-size: 20px;
    padding: 1rem;
  }
 @media (max-width: 1940px) {
    font-size: 1rem;
    padding: 1rem;
  }
  /* 🖥 1440px - Desktop */
  @media (max-width: 1440px) {
    font-size: 0.9rem;
    padding: 0.8rem;
  }

  /* 💻 1024px - Tablet Landscape */
  @media (max-width: 1024px) {
    font-size: 16px;
    padding: 0.75rem;
  }

  /* 📱 Tablet Portrait */
  @media (max-width: 768px) {
    font-size: 15px;
    padding: 0.6rem;
  }

  /* 📱 Small Phones */
  @media (max-width: 480px) {
    font-size: 14px;
    padding: 0.55rem;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
  min-width: 120px;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: flex-end;

  /* 4K Screens - Large spacing */
  @media (min-width: 2560px) {
    gap: 2rem;
    margin-top: 3rem;
  }

  /* QHD Screens (1440px - 2559px) */
  @media (max-width: 2559px) and (min-width: 1440px) {
    gap: 1.5rem;
  }

  /* Standard Laptops and Tablets */
  @media (max-width: 1024px) {
    justify-content: center;
    gap: 1rem;
  }

  /* Tablets & Below */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    min-width: 100%;
    gap: 0.8rem;
  }

  /* Small Phones */
  @media (max-width: 480px) {
    gap: 0.7rem;
    margin-top: 1.5rem;
  }
`;

export const ActionButton = styled.button`
  background-color: ${(props) =>
    props.color === "edit" ? "#3f64d7" : props.color === "delete" ? "#d9534f" : "#ccc"};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-size: 16px;
  font-family: "Satoshi", sans-serif;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background-color: ${(props) =>
      props.color === "edit" ? "#2f4db5" : props.color === "delete" ? "#b52b27" : "#999"};
  }
  @media (min-width: 3840px) {
    font-size: 2rem;
    padding: 1rem 2rem;
    border-radius: 10px;
  }
  @media (max-width: 2561px) {
    font-size: 1.2rem;
    padding: 1rem 2rem;
    border-radius: 10px;
  }
 @media (max-width: 2560px) {
    font-size: 1.2rem;
    padding: 1rem 2rem;
    border-radius: 10px;
  }
  /* QHD Screens (1440px - 2560px) */
  @media (max-width: 1940px) and (min-width: 1440px) {
    font-size: 15px;
    padding: 0.8rem 1.6rem;
  }

  /* Standard Laptop / Tablet */
  @media (max-width: 1024px) {
    font-size: 16px;
    padding: 0.7rem 1.3rem;
  }

  /* Tablets & Smaller Screens */
  @media (max-width: 768px) {
    width: 80%;
    font-size: 15px;
    padding: 0.8rem;
  }

  /* Small Phones */
  @media (max-width: 480px) {
    width: 100%;
    font-size: 14px;
    padding: 0.7rem;
  }
`;


export const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 8px;
`;
export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  /* margin-top: 1rem; */
  text-align: left;
  font-family: "Satoshi";

  /* Scroll on small screens */
  // display: block;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  td {
    text-align: left;
    padding: clamp(4px, 0.5vw, 12px); /* responsive padding */
    white-space: nowrap;
    background-color: white;
    border: none;
    font-size: clamp(0.8rem, 1vw, 1.5rem); /* responsive font */
  }

  th {
    text-align: left;
    background-color: #304eb0;
    color: white;
    font-family: Raleway;
    padding: clamp(6px, 0.5vw, 16px); /* responsive padding */
    font-size: clamp(0.9rem, 1vw, 1.8rem); /* responsive font */
  }

  tbody tr {
    box-shadow: 0px 0px 2.7px 0px rgba(0, 0, 0, 0.28);
  }

  /* Background color for even rows */
  tbody tr:nth-child(even) td {
    background-color: #e6ecff;
  }

  tbody tr td:first-child {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }

  tbody tr td:last-child {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  tbody tr:hover td {
    background-color: #f5f5f5;
  }

  @media (min-width: 2560px) {
    td,
    th {
      font-size: clamp(1.2rem, 1.5vw, 1.8rem); /* large screens like 2K/4K */
      padding: clamp(8px, 1vw, 24px);
    }
  }

  @media (min-width: 3840px) {
    td,
    th {
      font-size: clamp(1.5rem, 2vw, 2rem); /* ultra-large screens like 8K */
      padding: clamp(10px, 2vw, 32px);
    }
  }
`;
export const HeadCellTableHeader = styled.th`
  background-color: #3f64d7;
  color: white;
  padding: 0.8rem;
`;

export const TableRow = styled.tr`
  &.even {
    background-color: #f6f8ff;
  }
  &:hover {
    background-color: #eef2ff;
  }
`;

export const TableCell = styled.td`
  padding: 0.8rem;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
`;

export const EmployeesSection = styled.div`
  margin-top: 2rem;

  .employee-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h2 {
    font-size: 1.2rem;
    margin: 0;
  }
`;

export const EmployeeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

  h2 {
    font-size: 1.8rem;
    font-family: "Satoshi", sans-serif;
    font-weight: 600;
    color: #222;
    margin: 0;
  }

  /* Ultra 4K Screens */
  @media (min-width: 3840px) {
    h2 {
      font-size: 2.4rem;
    }
  }

  /* QHD Screens (2560px) */
  @media (max-width: 3839px) and (min-width: 2560px) {
    h2 {
      font-size: 2.2rem;
    }
  }

  /* Large Desktop (1940px) */
  @media (max-width: 2559px) and (min-width: 1940px) {
    h2 {
      font-size: 2rem;
    }
  }

  /* Standard Desktop (1440px) */
  @media (max-width: 1939px) and (min-width: 1440px) {
    h2 {
      font-size: 1.5rem;
    }
  }

  /* Laptops/Tablets (1024px) */
  @media (max-width: 1439px) and (min-width: 1024px) {
    h2 {
      font-size: 1.2rem;
    }
  }


  @media (max-width: 1023px) {
    /* flex-direction: column; */
    align-items: center;
    h2 {
      font-size: 1.4rem;
      text-align: center;
    }
  }

  /* Small Phones (480px) */
  @media (max-width: 480px) {
    gap: 0.6rem;
    h2 {
      font-size: 1.2rem;
    }
  }
`;

export const AddButton = styled.button`
  background: #3352ba;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: "Satoshi", sans-serif;
  font-weight: 500;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #2e4cb5;
    transform: translateY(-2px);
  }

  padding: 0.7rem 1.5rem;
  font-size: 0.95rem;

  @media (min-width: 3840px) {
    font-size: 1.4rem;
    padding: 1.2rem 2.5rem;
  }


  @media (max-width: 3839px) and (min-width: 2560px) {
    font-size: 1.3rem;
    padding: 1.1rem 2.2rem;
  }

  @media (max-width: 2559px) and (min-width: 1940px) {
    font-size: 1.3rem;
    padding: 1rem 2rem;
  }


  @media (max-width: 1939px) and (min-width: 1440px) {
    font-size: 1.1rem;
    padding: 0.5rem 1.5rem;
  }

  @media (max-width: 1439px) and (min-width: 1024px) {
    font-size: 1rem;
    padding: 0.8rem 1.5rem;
  }

  @media (max-width: 1023px) {
    width: 20%;
    font-size: 0.95rem;
    padding: 0.7rem 1.4rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    font-size: 0.85rem;
    padding: 0.6rem 1rem;
  }
`;

export const StatusRow = styled.div`
  display: flex;
  justify-content:flex-start;
  align-items: center;
  margin-top: 1rem;
`;

export const StatusWrapper = styled.div`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 4px;
    font-weight: 500;
  }
`;

export const StatusSelect = styled.select`
  padding: 6px 10px;
  border-radius: 6px;
  font-family: "Poppins";
  border: 1px solid #ccc;
  width: 200px;
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};
  color: ${(props) => (props.selected ? "#fff" : "#000")};
  background-color: ${(props) =>
    props.selected ? props.bgcolor : "#fff"};

  option {
    background: white !important; // always white
    color: black !important;       // always black
  }
`;

