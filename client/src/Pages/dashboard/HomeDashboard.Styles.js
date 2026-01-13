import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background: #f4f8ff;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

export const ContentWrapper = styled.div`
  flex: 1;
  transition: all 0.3s ease;

  &.shrink {
    margin-right: 300px;
    transform: scale(0.97);

    @media (min-width: 1600px) {
      margin-right: 300px;
      transform: scale(0.98);
    }

    @media (max-width: 1200px) {
      margin-right: 180px;
      transform: scale(0.99);
    }

   
    @media (max-width: 1024px) {
      margin-right: 0;
      transform: scale(1);
    }

   
    @media (min-width: 1920px) {
      margin-right: 320px;
      transform: scale(0.96);
    }

   
    @media (min-width: 2560px) {
      margin-right: 400px;
      transform: scale(0.95);
    }

    @media (min-width: 3840px) {
      margin-right: 420px;
      transform: scale(0.94);
    }
  }

  /* Center content on large screens */
  @media (min-width: 1920px) {

    margin: 0 auto;
  }

  @media (min-width: 2560px) {

    margin: 0 auto;
  }

  @media (min-width: 3840px) {

    margin: 0 auto;
  }
`;

export const TopCard = styled.div`

   @media (min-width: 2560px) {
   min-height:10vh;
  }

  @media (min-width: 3800px) {
  min-height:10vh;

  }
`

export const TwoColumn = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 0;
  align-items: stretch; 

  @media (max-width: 992px) {
    flex-direction: column;
  }
    @media (min-width: 2560px) {
   /* min-height:38vh; */
     gap: 35px;
  }

  @media (min-width: 3800px) {
  /* min-height:38vh; */
   margin-bottom:3rem;
   margin-top:3rem;
   gap:40px;
  }
`;

export const LeftBox = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  /* height: 420px;  
  
  @media (min-width: 2560px) {
    height: 550px; 
  }

  @media (min-width: 3840px) {
    height: 700px;
  } */
`;
export const RightBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  /* height: 420px;   */

  /* @media (min-width: 2560px) {
    height: 550px;  
  }

  @media (min-width: 3840px) {
    height: 700px;
  } */
`;


export const ThreeColumnRow = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
  }
   @media (min-width: 1024px) and (max-width: 1440px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

 @media (min-width: 2560px) {
  min-height:35vh;
  }
   @media (min-width: 3840px) {
  min-height:35vh;
  }
`;

export const ThreeBox = styled.div`
  flex: 1;
  min-width: 280px;
  background: white;
  padding: 16px;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
  }
    @media (min-width: 1024px) and (max-width: 1440px) {
    width: 100%;
  }

  
`;
