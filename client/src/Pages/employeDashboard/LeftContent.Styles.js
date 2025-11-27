import styled from "styled-components";

export const ProfileCard = styled.div`
  border-radius: 10px;
  overflow: hidden;

  .image-wrapper {
    position: relative;
    width: 100%;
    height: 200px; 

   @media (max-width: 480px) {
      height: 100px;
    }
    @media(min-width: 2068px) and (max-width: 6000px){
      /* background-color:#000; */
          height: 450px; 

      }
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 10px 10px 0 0;
    }
    
    .edit-icon {
      position: absolute;
      bottom: 12px;
      right: 10px;
      background: #fff;
      border-radius: 50%;
      padding: 6px;
      font-size: 2rem;
      color: #3352BA;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }
  }

  .details {
    padding: 10px;
p {
  margin-top: -10px;
  font-size: 1.2rem; 
  color: #333;
  font-family: 'Satoshi', sans-serif;

  /* Small devices (mobile) */
  @media (max-width: 480px) {
    font-size: 1rem;
  }

  /* Medium devices (tablets) */
  @media (min-width: 481px) and (max-width: 1024px) {
    font-size: 1.1rem;
  }

  /* Large desktops */
  @media (min-width: 1025px) and (max-width: 1600px) {
    font-size: 1rem;
  }

  /* Extra-large / 4K screens */
  @media (min-width: 1601px) {
    font-size: 1.5rem;
  }
  @media(min-width: 2068px) and (max-width: 6000px){
      font-size:2.5rem}
}


   strong {
  font-weight: 600;
  display: block;
  font-family: 'Satoshi', sans-serif;
  font-size: 1rem; /* default */

  /* Small devices (mobile) */
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }

  /* Medium devices (tablets) */
  @media (min-width: 481px) and (max-width: 1024px) {
    font-size: 1rem;
  }

  /* Large desktops */
  @media (min-width: 1025px) and (max-width: 1600px) {
    font-size: 1.1rem;
  }

  /* Extra-large / 4K screens */
  @media (min-width: 1601px) {
    font-size: 1rem;
  }
     @media(min-width: 2068px) and (max-width: 6000px){
      font-size:2rem}
}
}

  
`;
export const ProfileCardWrapper = styled.div`
  border-radius: 10px;
  overflow: hidden;
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  
background-color: #fcfcfcff;
  @media (max-width: 480px) {
    height: 100px;
  }

  @media (min-width: 2068px) and (max-width: 6000px) {
    height: 450px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 10px 10px 0 0;
  }

  .edit-icon {
    position: absolute;
    bottom: 12px;
    right: 10px;
    background: #fff;
    border-radius: 50%;
    padding: 6px;
    font-size: 2rem;
    color: #3352ba;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
`;

export const Details = styled.div`
  padding: 10px;

  p {
    font-size: 1.2rem;
    color: #333;
    font-family: "Satoshi", sans-serif;

    /* Small devices (mobile) */
    @media (max-width: 480px) {
      font-size: 0.7rem;
    }

    /* Medium devices (tablets) */
    @media (min-width: 768px) and (max-width: 1024px) {
      font-size: 0.8rem;
    }

    /* Large desktops */
    @media (min-width: 1025px) and (max-width: 1439px) {
      font-size: 1rem;
    }
@media (min-width: 1440px) and (max-width: 1600px) {
      font-size: 1.1rem;
    }

    /* Extra-large / 4K screens */
    @media (min-width: 1601px) and (max-width:1920px) {
      font-size: 1.2rem;
    }
 @media (min-width: 1921px) and (max-width:2560px) {
      font-size: 1.5rem;
    }
    @media (min-width: 2561px) and (max-width: 3840px) {
      font-size: 1.7rem;
    }
  }

  strong {
    font-weight: 600;
    display: block;
    font-family: "Satoshi", sans-serif;
    font-size: 1rem;

    @media (max-width: 480px) {
      font-size: 0.7rem;
    }

    @media (min-width: 481px) and (max-width: 1024px) {
      font-size: 0.6rem;
    }

    @media (min-width: 1025px) and (max-width: 1600px) {
      font-size: 0.9rem;
    }

   @media (min-width: 1601px) and (max-width:1920px) {
      font-size: 1.2rem;
    }
 @media (min-width: 1921px) and (max-width:2560px) {
      font-size: 1.5rem;
    }
    @media (min-width: 2561px) and (max-width: 3840px) {
      font-size: 1.6rem;
    }
  }
`;
export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
 
        @media(min-width: 2068px) and (max-width: 6000px){
        grid-template-columns: repeat(2, 1fr);
          gap: 10px;

        }
`;

export const SvgImage = styled.img`
  width: 14px;
  height: 14px;
  margin-right: 6px;
  display: inline-block;
`;

export const InfoCard = styled.div`
  background: #fff;
  border-radius: 9px;
  padding: 0.6rem 10px 20px 10px;
  border: 0px solid #000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

@media (min-width: 1440px) and (max-width: 1620px) {
    padding: 8px;
  }
  @media (min-width: 1621px) and (max-width: 1920px) {
    padding: 0.6rem 10px 10px 10px;
  }
    @media (min-width: 1921px) and (max-width:2000px) {
    padding: 20px;
  }
  @media (min-width: 2001px) and (max-width: 2840px) {
     padding:35px;
  }

 @media (min-width: 2841px) and (max-width:3839px){
     padding: 30px;
  }
   @media (min-width: 3840px) {
     padding: 30px;
  }
  h3 {
    font-size: 18px; 
    margin: 0;
    font-family: "Satoshi", sans-serif;

    /* Small devices (mobile) */
    @media (max-width: 480px) {
      font-size: 0.6rem;
    }
    @media (min-width: 2068px) and (max-width: 6000px) {
      font-size: 2rem;
    }
 @media (min-width: 1920px) and (max-width:2067px) {
      font-size: 1rem;
    }
    /* Medium devices (tablets) */
    @media (min-width: 481px) and (max-width: 1024px) {
      font-size: 0.8rem;
    }
 @media (min-width: 1025px) and (max-width: 1600px) {
      font-size: 1rem;
    }
    /* Large desktops */
    @media (min-width: 1025px) and (max-width: 1600px) {
      font-size: 1rem;
    }
   
    /* Extra-large / 4K screens */
    @media (min-width: 1601px) {
      font-size: 1.2rem;
    }
     
    @media (min-width: 3068px) and (max-width: 6000px) {
      font-size: 2.3rem;
    }
  }

  p {
    margin: 5px 0 10px;
    font-size: 13px; /* default for small/medium screens */
    color: #555;
    display: flex;
    justify-content: space-between;
    font-family: "Satoshi", sans-serif;

    /* Small devices (mobile) */
    @media (max-width: 480px) {
      font-size: 0.3;
    }

    /* Medium devices (tablets) */
    @media (min-width: 768px) and (max-width: 1024px) {
      font-size: 0.7rem;
    }

    /* Large desktops */
    @media (min-width: 1025px) and (max-width: 1440px) {
      font-size: 0.7rem;
    }
 @media (min-width: 1441px) and (max-width: 1600px) {
      font-size: 0.8rem;
    }
    /* Extra-large / 4K screens */
    @media (min-width: 1601px) and (max-width:1920px) {
      font-size: 1rem;
    }
       @media (min-width: 1921px) and (max-width:2560px) {
      font-size: 1.5rem;
    }
      
    @media (min-width: 2561px) and (max-width: 3840px) {
      font-size: 1.8rem;
    }
  }

  button {
    background: white;
    border: none;
    border-radius: 6px;
    font-size: 12px; /* default */
    color: #3f51b5;
    cursor: pointer;
    font-family: "Raleway", sans-serif;
    display: inline-flex;
    align-items: center;
    /* gap: 6px; */
    margin-top: auto; 
    text-align: left;
    /* Small devices (mobile) */
    @media (max-width: 480px) {
      font-size: 0.3rem;
    }

    /* Medium devices (tablets) */
    @media (min-width: 768px) and (max-width: 1024px) {
      font-size: 0.6rem;
    }

    /* Large desktops */
    @media (min-width: 1025px) and (max-width: 1600px) {
      font-size: 0.8rem;
    }

    /* Extra-large / 4K screens */
    @media (min-width: 1601px) and (max-width:1920px) {
      font-size: 1rem;
    }

     @media (min-width: 1921px) and (max-width:2559px) {
      font-size: 1.3rem;
    }
    @media (min-width: 2560px) and (max-width: 3840px) {
      font-size: 1.5rem;
    }
  }
`;

export const TimeTrackingCard = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 14px;
  color: #333;
  min-height: 200px;
  font-family: "Satoshi", sans-serif;

  hr {
    border: none;
    border-top: 1px solid #eee;
    margin: 10px 0;
  }
`;

export const TitleRow = styled.h4`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #3352ba;
  margin-bottom: 10px;
  margin-top: -5px;

  img {
    width: 18px;
    height: 20px;
  }

 
  @media (min-width: 768px) and (max-width: 1024px) {
    font-size: 0.9rem;
  }

  @media (min-width: 1025px) and (max-width: 1600px) {
    font-size: 1.3rem;
  }

  @media (min-width: 1601px) and (max-width:1920px){
    font-size: 1.5rem;
  }
@media (min-width: 1921px) and (max-width:2559px){
    font-size: 1.5rem;
  }
  @media (min-width: 2560px) and (max-width: 3860px) {
    font-size: 2.2rem;

  }
  @media (min-width:3861px)  {
    font-size: 2.2rem;
    padding: 20px 20px;
  }
`;

export const Row = styled.p`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
  font-size: 0.9rem;

  span {
    font-weight: 400;
  }

  strong {
    font-weight: 600;
  }

    @media (min-width: 768px) and (max-width: 1024px) {
    font-size: 0.9rem;
  }

  @media (min-width: 1025px) and (max-width: 1600px) {
    font-size: 1rem;
  }

  @media (min-width: 1601px) and (max-width:1920px){
    font-size: 1.2rem;
  }
@media (min-width: 1921px) and (max-width:2559px){
    font-size: 1.5rem;
     padding: 20px 0px;
  }
  @media (min-width: 2560px) and (max-width: 3860px) {
    font-size: 1.8rem;
    padding: 15px 0px;
  }
  @media (min-width:3861px)  {
    font-size: 2.2rem;
    padding: 20px 20px;
  }
`;





export const Container = styled.div`
  flex-direction: column;
  padding: 10px;
  gap: 20px;
  background: #f4f8ff;
  width: 100%;
  box-sizing: border-box;

  @media  (min-width: 2068px) and (max-width: 6000px) {
    padding: 20px;

  }
`;

export const TopSection = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: nowrap;
  align-items: stretch; 
  margin-bottom: 30px;


  @media (min-width: 768px) and (max-width:1019px) {
     gap: 0.7rem;
  }
  @media (max-width: 1024px) {
    flex-direction: row;
  }
`;

export const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 9px;
  background: #fff;
`;
export const RightColumn = styled.div`
  flex: 1; 
  display: flex;
  flex-direction: column;
  gap: 20px;
`;


export const TaskSection = styled.div`
  display: flex;
  margin-top: 20px;
  flex-direction: column;
  gap: 12px; 
  overflow-y: auto;
  padding-right: 4px; 

  
  max-height: none;

  
  @media (min-width: 768px) and (max-width: 1023px) {
    max-height: calc(4 * 90px); 
  }


  @media (min-width: 1024px) and (max-width: 1439px) {
    max-height: calc(6 * 90px);
  }

  @media (min-width: 1440px) {
    max-height: calc(8 * 90px);
  }

 
  scroll-behavior: smooth;


  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
`;
