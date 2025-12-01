import styled from "styled-components";

export const DetailsWrapper = styled.div`
  display: flex;
  gap: 30px;
  padding: 28px;
  width: 100%;
  align-items: flex-start;
  background: #fbfcffff;
  border-radius: 16px;
  box-shadow: 0px 4px 16px rgba(0,0,0,0.09);

  @media (max-width: 1439px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  @media (min-width: 2540px) {
  height: 30vh;
}

  @media (min-width: 3840px) {
  height: 35vh;
}
`;

export const LeftSection = styled.div`
  width: 30%;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(120deg, #ffffff, #d9e5f7ff);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.11);

    @media (min-width: 2540px) {
    width: 100%;
    height: 26vh;
  }
   @media (min-width: 3840px) {
    width: 80%;
    height: 26vh;
  }
`;

export const ProfileImage = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 10%;
  object-fit: cover;
  border: 2px solid #3352BA;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.12);

   @media (min-width: 2540px) {
    height: 20vh;
    width: 100%;
  }
    @media (min-width: 3840px) {
    height: 20vh;
    width: 80%;
  }
`;

export const RightSection = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    align-items: center;
    gap: 18px;
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
 grid-template-columns: repeat(2, minmax(150px, 1fr)); 
  }

            @media (min-width: 2540px) {
  margin-bottom: 10px;
  }
           @media (min-width: 3840px) {
  margin-bottom: 30px;
  }

`;



export const DetailCard = styled.div`
width: 100%;
  background: #fff;
  padding: 14px 16px;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 6px;
     text-align: left;

       @media (min-width: 2540px) {
height: 8vh;
gap:10px;
  }
         @media (min-width: 3840px) {
height: 8vh;
gap:20px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const CardLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
   @media (min-width: 2540px) {
font-size: 1.3rem;
  }

     @media (min-width: 3840px) {
font-size: 1.8rem;
  }
`;

export const CardValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%; 
  margin-top: 10px;

  @media (min-width: 2540px) {
font-size: 1.1rem;
  }
    @media (min-width: 3840px) {
font-size: 1.5rem;
  }
`;


export const MailRow = styled.div`
  display: flex;
  justify-content:flex-end;
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
  
`;

export const MailButton = styled.button`
  padding: 8px 20px;
  background: #3352BA;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
  transition: 0.3s;

  &:hover {
    background: #1f3a8b;
    transform: translateY(-2px);
  }

   @media (min-width: 2560px) {
    font-size: 1.5rem;
  }
`;

export const IconWrapper = styled.div`
  background: #e0e7ff;
  border-radius: 6px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
`;
