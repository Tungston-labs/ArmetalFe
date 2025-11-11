import styled from "styled-components";

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 20px;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  min-width: 300px;
`;

export const Thead = styled.thead`
  background: #304EB0;
  color: white;

  
`;

export const Th = styled.th`
  text-align: left;
  padding: 10px 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ddd;
  min-width: 80px;
@media (min-width: 3840px) {
    font-size: 1.8rem;
  }

 @media (min-width: 2561px) and (max-width: 3839px){
    font-size: 1.3rem;
  }
  @media (min-width: 1920px) and (max-width: 2560px){
    font-size: 1.2rem;
  }

  @media (min-width: 1280px) and (max-width: 1919px) {
    font-size: 1.1rem;
  }


  @media (min-width: 769px) and (max-width: 1279px) {
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }

`;

export const Tbody = styled.tbody`
 
`;

export const Tr = styled.tr`
  box-shadow: 0px 0px 2.7px 0px #00000047;
  border-radius: 4px;

  &:nth-child(even) {
    background: #E6ECFF;
  }
`;

export const Td = styled.td`
  padding: 10px 12px;
  border-bottom: 1px solid #eee;
  font-size: 1rem;

@media (min-width: 3840px) {
    font-size: 1.6rem;
  }

 @media (min-width: 2561px) and (max-width: 3839px){
    font-size: 1.2rem;
  }
  @media (min-width: 1920px) and (max-width: 2560px){
    font-size: 1.2rem;
  }

  @media (min-width: 1280px) and (max-width: 1919px) {
    font-size: 1rem;
  }


  @media (min-width: 768px) and (max-width: 1279px) {
    font-size: 1rem;
  }

  @media (max-width: 767px) {
    font-size: 0.9rem;
  }
`;

