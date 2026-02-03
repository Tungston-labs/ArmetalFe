import styled from 'styled-components';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
export const Container = styled.div`
  padding: 20px;
  background: white;

`;

export const HeaderSection = styled.div`
  margin-bottom: 2rem;
`;

export const IconTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    font-size: 1.4rem;
  }
`;
export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    height: 51px;
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-family:satoshi;
  color: #3250B5;
font-size: 1.5rem;
font-style: normal;
font-weight: 700;
line-height: normal;
`;
export const Subtitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0;
  margin-left: 2px;
  font-family:raleway;
  color: #3250B5;
font-family: Raleway;
// font-size: 16px;
font-style: normal;
font-weight: 300;
line-height: normal;
`;

export const FormSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem 2rem; /* vertical and horizontal spacing */
  margin-bottom: 2rem;
`;

export const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 1rem;
`;
export const InputGroup = styled.div`
  width: calc(50% - 1rem);
  display: flex;
  flex-direction: column;
`;
export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top:-5%;
  width:90px;
  font-family:satoshi;
background: linear-gradient(181deg,rgba(23, 37, 84, 1) 50%, rgba(51, 82, 186, 1) 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  font-size:15px;
  cursor: pointer;
`;
export const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 0.9rem;
  width: 220px;
`;

export const FilterInput = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 0.9rem;
  width: 150px;
  color:white;
background: linear-gradient(181deg,rgba(23, 37, 84, 1) 50%, rgba(51, 82, 186, 1) 100%);

`;
export const Label = styled.label`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color:gray;
`;

export const Input = styled.input`
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
    background: white;
    border-radius: 4px;
border: 1px solid #052DB4;

`;

export const TableWrapper = styled.div`
  width: 100%;
  background-color: white;
  padding: 6px;
  border-radius: 8px;
  overflow-x: auto; /* horizontal scroll for small screens */
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px; 
  margin-top: 1rem;
`;


export const Th = styled.th`
  background-color: #304EB0;
  color: white;
  padding: 0.75rem;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 2;
`;


export const Td = styled.td`
  text-align: center;
  padding: 0.5rem;
  white-space: nowrap;
  background-color: white;
  border: none;
`;


export const Tr = styled.tr`
  box-shadow: 0px 0px 2.7px rgba(0, 0, 0, 0.28);


  &:hover ${Td} {
    background-color: #f5f5f5;
  }
  &:nth-child(even) ${Td} {
    background-color: #E6ECFF;
  }
`;

export const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 0.5rem;
  vertical-align: middle;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  color: ${({ danger }) => (danger ? '#f44336' : '#333')};
  font-size: 1.1rem;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;
// export const TopBar = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1.5rem;
// `;

export const HRManager = styled.div`
  display: flex;
  height:30px;
 
  align-items: center;

  padding: 0.3rem ;
  // border: 1px solid #ccc;
  // border-radius: 8px;
  background-color: #fff;
  font-size: 0.95rem;
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
// export const StyledIcon = styled(HiOutlinePencilSquare)`
//   width: 20px;
//   height: 20px;
//   margin-right: 0.5rem;
//   color: white;
//   vertical-align: middle;
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

export const FilterButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #3352BA;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-size: 0.95rem;
  font-family: Satoshi;
  cursor: pointer;
  height: 40px;

  &:hover {
    background-color: #243d8f;
  }
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between; 
  align-items: center;
  /* gap: 10px; */
  position: relative; 
`;