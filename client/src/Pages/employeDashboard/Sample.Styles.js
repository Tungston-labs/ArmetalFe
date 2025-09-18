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
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
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
  font-size: 1.2rem; /* default for medium screens */
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
    font-size: 1.3rem;
  }

  /* Extra-large / 4K screens */
  @media (min-width: 1601px) {
    font-size: 1.8rem;
  }
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
    font-size: 1.5rem;
  }
}

  }
`;


export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two cards per row */
  gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Stack on small screens */
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
  padding: 0.9rem;
  /border: 0px solid #000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;


  h3 {
  font-size: 18px; /* default */
  margin: 0;
  font-family: 'Satoshi', sans-serif;

  /* Small devices (mobile) */
  @media (max-width: 480px) {
    font-size: 16px;
  }

  /* Medium devices (tablets) */
  @media (min-width: 481px) and (max-width: 1024px) {
    font-size: 17px;
  }

  /* Large desktops */
  @media (min-width: 1025px) and (max-width: 1600px) {
    font-size: 19px;
  }

  /* Extra-large / 4K screens */
  @media (min-width: 1601px) {
    font-size: 30px;
  }
}

 p {
  margin: 5px 0 10px;
  font-size: 13px; /* default for small/medium screens */
  color: #555;
  display: flex;
  justify-content: space-between;
  font-family: 'Satoshi', sans-serif;

  /* Small devices (mobile) */
  @media (max-width: 480px) {
    font-size: 12px;
  }

  /* Medium devices (tablets) */
  @media (min-width: 481px) and (max-width: 1024px) {
    font-size: 13px;
  }

  /* Large desktops */
  @media (min-width: 1025px) and (max-width: 1600px) {
    font-size: 14px;
  }

  /* Extra-large / 4K screens */
  @media (min-width: 1601px) {
    font-size: 20px;
  }
}

button {
  background: white;
  border: none;
  border-radius: 6px;
  font-size: 12px; /* default */
  color: #3f51b5;
  cursor: pointer;
  font-family: 'Raleway', sans-serif;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: auto; /* stays at the bottom */

  /* Small devices (mobile) */
  @media (max-width: 480px) {
    font-size: 11px;
  }

  /* Medium devices (tablets) */
  @media (min-width: 481px) and (max-width: 1024px) {
    font-size: 12px;
  }

  /* Large desktops */
  @media (min-width: 1025px) and (max-width: 1600px) {
    font-size: 13px;
  }

  /* Extra-large / 4K screens */
  @media (min-width: 1601px) {
    font-size: 16px;
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

  h4 {
    color: #3352BA;
    margin-bottom: 10px;
    margin-top: -5px;
    font-size: 1.2rem;

    @media (max-width: 480px) {
      font-size: 1rem;
    }
    @media (min-width: 481px) and (max-width: 1024px) {
      font-size: 1.1rem;
    }
    @media (min-width: 1025px) and (max-width: 1600px) {
      font-size: 1.3rem;
    }
    @media (min-width: 1601px) {
      font-size: 2rem;
    }
  }

  p {
    margin: 15px 0;
    font-size: 0.9rem;

    @media (max-width: 480px) {
      font-size: 0.8rem;
    }
    @media (min-width: 481px) and (max-width: 1024px) {
      font-size: 0.85rem;
    }
    @media (min-width: 1025px) and (max-width: 1600px) {
      font-size: 0.95rem;
    }
    @media (min-width: 1601px) {
      font-size: 1.5rem;
    }
  }

  a {
    display: inline-block;
    margin-top: 10px;
    color: #3f51b5;
    font-weight: 600;
    font-size: 1rem;
    text-decoration: none;

    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
    @media (min-width: 481px) and (max-width: 1024px) {
      font-size: 0.95rem;
    }
    @media (min-width: 1025px) and (max-width: 1600px) {
      font-size: 1.05rem;
    }
    @media (min-width: 1601px) {
      font-size: 1.8rem;
    }
  }
`;

// export const TaskSection = styled.div`
//   background: #fff;
//   border-radius: 10px;
//   padding: 15px 20px;
//   margin-top:20px;
// `;

export const TaskTitle = styled.h4`
  // margin-bottom: 15px;
  margin-top:-20px;
  color: #3352BA;
  font-family: Raleway;
font-weight: 700;
font-style: Bold;
font-size: 20px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;

  font-size: 1.2rem;
 font-family: 'Raleway', sans-serif;
`;

export const TaskItem = styled.div`
  display: flex;
  gap: 15px;
  padding: 10px 0;
  background:white;
  border-bottom: 1px solid #eee;
  align-items: flex-start;
  &:last-child {
    border-bottom: none;
  }
  a {
    margin-left: auto;
    color: #3f51b5;
    text-decoration: none;
    font-size: 18px;
  }
`;

export const TaskMeta = styled.div`
  min-width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    font-size: 13px;
    color: #777;
  }

  strong {
    font-size: 16px;
    color: #111;
  }
`;


export const TaskText = styled.div`

  h5 {
    margin: 0;
    font-size: 12px;
    color: #444;
  }
  p {
    margin: 5px 0 0;
    font-size: 13px;
    color: #666;
  }
`;

export const Container = styled.div`
  // display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 20px;
  background: #F4F4F4;
  // height: 100vh;
  width:100%;
  box-sizing: border-box;
`;

export const TopSection = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: nowrap; /* prevent stacking unless on small screens */
  align-items: stretch; /* equal height columns */
margin-bottom:30px;
  @media (max-width: 1024px) {
    flex-direction: row;
  }
`;

export const LeftColumn = styled.div`
  flex: 1; /* take equal space with RightColumn */
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 9px;
  // border: 0.1px solid #000;
  background: #FFF;
`;
export const RightColumn = styled.div`
  flex: 1; /* take equal space with LeftColumn */
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// Keep all other styles same (ProfileCard, InfoGrid, etc.)

export const TaskSection = styled.div`
  display: flex;
    margin-top:20px;
  flex-direction: column;
  gap: 12px; /* space between tasks */
  overflow-y: auto;
  padding-right: 4px; /* so scrollbar doesn’t overlap content */

  /* Default (mobile first) – show all tasks */
  max-height: none;

  /* Tablet (≥768px) – show 4 tasks */
  @media (min-width: 768px) and (max-width: 1023px) {
    max-height: calc(4 * 90px); /* adjust if TaskItem height differs */
  }

  /* Laptop (≥1024px and ≤1439px) – show 5 tasks */
  @media (min-width: 1024px) and (max-width: 1439px) {
    max-height: calc(6 * 90px);
  }

  /* Large screens (≥1440px) – show 8 tasks */
  @media (min-width: 1440px) {
    max-height: calc(8 * 90px);
  }

  /* Smooth scroll */
  scroll-behavior: smooth;

  /* Custom scroll styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.2);
    border-radius: 4px;
  }
`;
