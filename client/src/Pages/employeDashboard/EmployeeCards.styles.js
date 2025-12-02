import styled from "styled-components";

export const CardsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin: 20px 0;

  @media (min-width: 2540px) {
  height: 10vh;
}

`;

export const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.16);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.2);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;

         @media (min-width: 2540px) {
  margin-bottom: 30px;
  }
       
`;

export const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.bg || "#eee"};
`;

export const CardTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #555;

         @media (min-width: 2540px) {
  font-size: 1.5rem;
  }
`;

export const CardValue = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  color: #414040ff;

         @media (min-width: 2540px) {
  font-size: 1.5rem;
  }
`;
