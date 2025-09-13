import styled from "styled-components";
import { FiSearch } from 'react-icons/fi';

export const Container = styled.div`
  padding: 2rem;
 font-family: Satoshi;
  background:white;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  .title {
    display: flex;
    align-items: center;
    gap: 1rem;

    h2 {
      margin: 0;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
      color: #555;
    }

    img {
      height: 40px;
    }
  }

  .right {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }
`;

export const RightSection = styled.div`
  // display: flex;
  align-items: center;
  justify-content: flex-end; /* aligns items to the right */
  gap: 1rem;
  flex-wrap: wrap; /* allows wrapping on small screens */
`;

// export const AddButton = styled.button`
//   background: #1e3a8a;
//   color: white;
//   border: none;
//   padding: 0.6rem 1.2rem;
//   border-radius: 8px;
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   font-size: 0.95rem;
//   cursor: pointer;

//   &:hover {
//     background: #2744a3;
//   }
// `;
// export const SearchWrapper = styled.div`
//   position: relative;
//   display: inline-block;
//   max-width: 400px;
//   margin-top: 30px;
//   margin-bottom: 20px;
// `;

// export const SearchInput = styled.input`
//   padding: 1.2rem 1rem 1.2rem 2.5rem; /* extra left padding for icon */
//   border: 1px solid #ccc;
//   border-radius: 6px;
//   width: 30%;
//   font-family: satoshi;
//   height: 40px;
//   font-size: 0.95rem;
//       margin-top:20px;
// `;

// export const SearchIcon = styled(FiSearch)`
//   position: absolute;
//   left: 1rem;   /* move icon to the start (left) */
//   top: 50%;
//   transform: translateY(-50%);
//   color: #888;
//   font-size: 1.2rem;
//   pointer-events: none; /* ensures input is clickable */
// `;

export const Tabs = styled.div`
  display: flex;
  gap: 2rem;
  font-family: Raleway;
font-weight: 700;
font-style: Bold;
font-size: 1rem;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;
text-align: center;

  margin: 1.5rem 0;
  // border-bottom: 2px solid #ddd;
  
`;

export const Tab = styled.div`
  padding:8px  25px;
  cursor: pointer;
  background:#304EB0;
  font-family: Raleway;
font-weight: 500;
font-style: Bold;
font-size: 1rem;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;
text-align: center;
  background: ${({ active }) => (active ? "3px solid #1e3a8a" : "none")};
  color: ${({ active }) => (active ? "white" : "#555")};
`;



export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px; 
  margin-top: 1rem;
 text-align: left;
  td {
    text-align: left;
    padding: 0.4rem;
    white-space: nowrap;
    background-color: white;
    border: none;
  }

  th {
    background-color: #304EB0;
    color: white;
    font-family: raleway;
    padding: 0.5rem;
  }

  tbody tr {
    box-shadow: 0px 0px 2.7px 0px rgba(0, 0, 0, 0.28);
    font-family: 'satoshi';
  }

  /* ✅ Background color for even rows */
  tbody tr:nth-child(even) td {
    background-color: #E6ECFF;
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
`;


// export const Row = styled.tr``;

// export const Cell = styled.td`
//   display: flex;
//   align-items: center;
//   gap: 0.6rem;

//   svg {
//     cursor: pointer;
//   }
// `;

export const ProfileImg = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
`;

export const ActionIcons = styled.div`
  display: flex;
  gap: 1rem;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: flex-start; /* changed from flex-end to flex-start */
  gap: 0.3rem;
  margin-top: 1.5rem;
  padding: 0.6rem;

  span {
    padding: 0.2rem 0.4rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    cursor: pointer;
    font-size: 0.7rem;
  }

  .active {
    background: #1e3a8a;
    color: white;
    border-color: #1e3a8a;
  }
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const HRManager = styled.div`
  display: flex;
  height:30px;
 
  align-items: center;
  padding: 0.3rem ;
  // border: 1px solid #ccc;
  // border-radius: 8px;
  background-color: #fff;
  font-size: 1rem;
  color: #333;
  // box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

  span {
    font-weight: 500;
  }

  img {
    width: 40px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

// export const HeaderSection = styled.div`
//   // display: flex;
//   justify-content: space-between;
//   align-items: center;
//   flex-wrap: wrap;
//   gap: 1rem;
//   // background:yellow;
// `;

// export const TitleSection = styled.div`
//   display: flex;
  
//   align-items: center;
//   // background:red;
//   // margin-top:3%;
// `;

export const Icon = styled.div`
  font-size: 2rem;
  color: #2a2a86;
`;

export const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 1rem;
  // background:black;
  margin-top:-8%;
`;
// export const Title = styled.h2`
//   font-size: 1.4rem;
//   margin: 0;
// //  font-family:satoshi;
//  margin-top:10px;
//  color:#3250B5;
//  font-family: "Satoshi";
// font-weight: 700;
// // font-style: Bold;
// // font-size: 22px;
// leading-trim: NONE;
// line-height: 100%;
// letter-spacing: 0%;

// `;

// export const Subtitle = styled.p`
//   font-size: 1rem;
//    color:#3250B5;
//    margin-top:5px;
//   font-size:raleway;
//   font-family: Raleway;
// font-style: Light;
// leading-trim: NONE;
// line-height: 100%;
// letter-spacing: 0%;

// `;

// export const DepartmentSelect = styled.select`
//   padding: 8px 12px;
//   font-size: 14px;
//   border-radius: 5px;
//   border: 1px solid #ccc;
//   background: white;
//   margin-top:20px;
// `;
export const DropdownWrapper = styled.div`
  position: relative;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  overflow: hidden;
  z-index: 100;

  div {
    padding: 10px 15px;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      background-color: #f0f0f0;
    }
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column; /* stack top & bottom */
  gap: 1rem;
  width: 100%;
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  // gap: 10px;
`;

export const Title = styled.h2`
  font-size: 1.4rem;
  margin: 0;
  margin-top: 10px;
  color: #3250b5;
  font-family: "Satoshi";
  font-weight: 700;
  line-height: 100%;
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: #3250b5;
  margin-top: 5px;
  font-family: Raleway;
  font-weight: 300;
  line-height: 100%;
`;

export const AddButton = styled.button`
  background: #1e3a8a;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  cursor: pointer;

  &:hover {
    background: #2744a3;
  }
`;

export const SearchWrapper = styled.div`
  position: relative;
  display: inline-block;
  width:100%;
  // max-width: 400px;
`;

export const SearchInput = styled.input`
  padding: 1.2rem 1rem 1.2rem 2.5rem; /* left padding for icon */
  border: 1px solid #172554;
  border-radius: 6px;
  width: 27%;
  font-family: satoshi;
  height: 40px;
  font-size: 0.95rem;
`;

export const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 1.2rem;
  pointer-events: none;
`;

export const DepartmentSelect = styled.select`
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background: white;
  height: 40px;
  min-width: 200px;
`;
