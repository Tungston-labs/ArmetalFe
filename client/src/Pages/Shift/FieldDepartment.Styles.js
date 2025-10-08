import styled from "styled-components";

export const PageWrapper = styled.div`
  font-family: "Satoshi", sans-serif;
  background-color: #ffffff;
  padding: 2rem ;
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
`;

export const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem; /* small gap between inputs */
  margin-bottom: 1.2rem;

  div {
    flex: 1 1 48%; /* each input takes ~48% of row width */
    min-width: 220px; /* prevent too small on mobile */
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

  @media (max-width: 768px) {
    div {
      flex: 1 1 100%; /* stack vertically on small screens */
      min-width: 100%;
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
  line-height: 100%;
  color: #333;

  &:focus {
    border-color: #3f64d7;
    outline: none;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
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
  transition: background 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.color === "edit" ? "#2f4db5" : props.color === "delete" ? "#b52b27" : "#999"};
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
export const TableHeader = styled.th`
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

export const AddButton = styled.button`
  background: #3352BA;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: 0.3s;

  &:hover {
    background: #2e4cb5;
  }
`;

