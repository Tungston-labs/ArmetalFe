import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

export const ModalContainer = styled.div`
  background: #fff;
  width: 80%;
  /* max-width: 1000px; */
  /* border-radius: 8px; */
  padding: 1.5rem 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  font-family: "Satoshi", sans-serif;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #304EB0;
  font-size: 1rem;
  font-family: Satoshi;
font-weight: 700;
font-style: Bold;
font-size: 22px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;

`;

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .input-wrapper {
    position: relative;
    flex: 1;
  }

  input {
    /* width: 100%; */
    padding: 6px 10px 6px 30px;
    border: 1px solid #5f53a5;
    border-radius: 6px;
    outline: none;
  }

  .search-icon {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: #5f53a5;
    pointer-events: none;
  }

  button {
    border: none;
    background: none;
    color: #3352BA;
    cursor: pointer;
  }
`;


export const TableWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 400px; /* adjust as needed */
  margin-top: 0.5rem;
  /* border: 1px solid #eee; */
  /* border-radius: 6px; */
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;

  /* For WebKit browsers */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: 10px;
  }
`;


export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  margin-top: 1rem;
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

export const Checkbox = styled.input`
  cursor: pointer;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

export const Button = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;

  &.cancel {
    background: #ff4d4f;
    color: white;
  }

  &.add {
    background: #3352BA;
    color: white;
  }
`;
