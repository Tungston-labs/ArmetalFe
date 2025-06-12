import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
 font-family: Satoshi;
  background:#FBFEF3;
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

export const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  min-width: 250px;
  margin-top:10px;
  height:20px;
  font-family:satoshi;
`;
export const Tabs = styled.div`
  display: flex;
  gap: 2rem;
  margin: 1.5rem 0;
  font-family:raleway;
  border-bottom: 2px solid #ddd;
`;

export const Tab = styled.div`
  padding-bottom: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  border-bottom: ${({ active }) => (active ? "3px solid #1e3a8a" : "none")};
  color: ${({ active }) => (active ? "#1e3a8a" : "#555")};
`;

export const Table = styled.table`
width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px; 
  margin-top: 1rem;
 

  th, td {
    text-align: left;
    padding: 0.5rem;
    white-space: nowrap;
  
    background-color: white;
    border: none; /* remove cell borders */
  }

  th {
    background-color: #5F53A53B;
    color: #333;
      font-family:raleway;
     padding: 0.75rem;

  }

  /* ✅ Apply box-shadow only to tbody rows */
  tbody tr {
box-shadow: 0px 0px 2.7px 0px rgba(0, 0, 0, 0.28);
font-family:satoshi;

  }

  /* Optional: radius for only first and last td of each row */
  tbody tr td:first-child {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  tbody tr td:last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
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
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 0.5rem;

  span {
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    cursor: pointer;
    font-size: 0.9rem;
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
  gap: 0.75rem;
  padding: 0.3rem ;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  font-size: 0.95rem;
  color: #333;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

  span {
    font-weight: 500;
  }

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
`;

export const Icon = styled.div`
  font-size: 2rem;
  color: #2a2a86;
`;

export const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 1rem;
`;
export const Title = styled.h2`
  font-size: 22px;
  margin: 0;
  margin-left:10px;
 font-family:satoshi;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #555;
  margin-left:10px;
  margin-top:-1px;
  font-size:raleway;
`;