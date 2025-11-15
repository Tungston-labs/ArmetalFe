import styled from "styled-components";

const breakpoints = {
  mobile: "480px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "1440px",
  tv: "2560px", // 2K / QHD screens
  largeTv: "3840px", // 4K UHD screens
};

export const Container = styled.div`
  display: flex;
  /* flex-wrap: wrap; */
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
  margin: 0 auto;
  padding: 0.8rem;

  /* 📱 Mobile (stack) */
  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    gap: 1rem;
  }

  /* 🖥️ TV screens (center and max-width control) */
  @media (min-width: ${breakpoints.tv}) {
    max-width: 100%; /* prevent content from stretching edge-to-edge */
    gap: 3rem;
  }

  @media (min-width: ${breakpoints.largeTv}) {
    max-width: 100%; /* tighter for 4K */
    gap: 4rem;
  }
`;

export const LeftSection = styled.div`
  flex: 1 1 60%;
  min-width: 300px;
`;

export const RightSection = styled.div`
  flex: 1 1 27%;
  /* min-width: 350px; */
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* ✅ Default: stacked vertically on desktops */
  @media (max-width: 768px) {
    flex-direction: row; /* side by side on mobile */
    flex-wrap: wrap;
    gap: 0.8rem;
    min-width: 100%;
    align-items: stretch;
  }
`;

export const SectionTitle = styled.h2`
  font-size: clamp(1rem, 1.2vw, 2rem);
  margin: 1.5rem 0 1rem;
  font-weight: 700;
  border-bottom: 1px solid #3352ba;
  padding-bottom: 0.3rem;
  font-family: Satoshi;

  display: flex;
  align-items: center;
  justify-content: space-between;

  /* Scale up on very large displays */
  @media (min-width: ${breakpoints.tv}) {
    font-size: 2.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #3352ba;
  }
  @media (min-width: ${breakpoints.largeTv}) {
    font-size: 3.5rem;
    padding-bottom: 2rem;
    border-bottom: 2px solid #3352ba;
  }
`;

export const DepartmentWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 2rem;
  overflow-x: auto;
  padding-bottom: 1rem;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
  @media (min-width: ${breakpoints.tv}) {
    gap: 3rem;
    padding-block: 1rem;
    margin-bottom: 2rem;
  }
  @media (min-width: ${breakpoints.largeTv}) {
    gap: 4rem;
    padding-block: 2rem;
    margin-bottom: 4rem;
  }
`;

export const DepartmentCard = styled.div`
  flex: 0 0 auto;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  /* ---------- Mobile (0–768px) ---------- */
  @media (max-width: 768px) {
    min-width: 180px;
    min-height: 120px;
    padding: 0.8rem;
  }

  /* ---------- Tablet (769px–1024px) ---------- */
  @media (min-width: 769px) and (max-width: 1024px) {
    min-width: 220px;
    min-height: 140px;
    padding: 1rem;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    min-width: 220px;
    min-height: 140px;
    padding: 1rem;
  }
 @media (min-width: 1441px) and (max-width: 1920px) {
    min-width: 220px;
    min-height: 140px;
    padding: 1rem;
  }
  /* ---------- TV (1025px–1440px) ---------- */
  @media (min-width: ${breakpoints.tv}) and (max-width: ${breakpoints.largeTv}) {
    min-width: 400px;
    min-height: 200px;
    padding: 1rem;
  }

  /* ---------- Large TV (1441px+) ---------- */
  @media (min-width: ${breakpoints.largeTv}) {
    min-width: 700px;
    min-height: 220px;
    padding: 2rem;
  }
`;


export const InitialCircle = styled.div`
  font-weight: bold;
  color: #b5e2ff;
  margin-right: 1rem;
  font-family: Raleway;
  font-style: Bold;
  line-height: 100%;

  /* Default – Mobile */
  font-size: 2.5rem;

  /* Tablet / Small Laptop */
  @media (min-width: 768px) {
    font-size: 4rem;
  }

  /* Laptop / Desktop */
  @media (min-width: 1024px) {
    font-size: 6rem;
  }

  /* 1440px – Large Desktop */
  @media (min-width: 1440px) {
    font-size: 6rem;
  }

  /* 1920px – Full HD Monitor */
  @media (min-width: 1920px) {
    font-size: 10rem;
  }

  /* 2560px – 2K Monitor */
  @media (min-width: 2560px) {
    font-size: 12rem;
  }

  /* 3840px – 4K / Ultra-Wide */
  @media (min-width: 3840px) {
    font-size: 16rem;
  }
`;



export const DeptInfo = styled.div`
  flex: 1;
  // display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 2rem;

  h3 {
    font-family: "Raleway";
    font-weight: 700;
    font-style: Bold;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    font-size: clamp(1rem, 1.2vw, 2rem);
  }

  p {
    font-family: "Raleway";
    font-style: Regular;
    font-size: clamp(0.8rem, 1vw, 1.5rem);
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    margin-top:5px;
  }
  @media (min-width: ${breakpoints.tv}) {
    h3 {
      font-size: 2rem;
      text-transform: capitalize;
    }
    p {
      font-size: 1.8rem;
    }
  }
  @media (min-width: ${breakpoints.largeTv}) {
    h3 {
      font-size: 3rem;
      text-transform: capitalize;
    }
    p {
      font-size: 2rem;
    }
  }
`;
export const DeptHead = styled.p`
  // margin-top: 0.5rem;
  font-size: clamp(0.7rem, 1vw, 1rem);
  color: #666;
`;
export const DeptCount = styled.div`
  font-size: clamp(1rem, 1.5vw, 1.8rem);
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  align-self: flex-start;
  font-family: Satoshi;
  font-weight: 700;
  font-style: Bold;
  line-height: 100%;
  letter-spacing: 0%;
  @media (min-width: ${breakpoints.tv}) {
    font-size: 2rem;
  }
  @media (min-width: ${breakpoints.largeTv}) {
    font-size: 3rem;
  }
`;

export const ArrowIcon = styled.div`
  position: absolute;
  bottom: 0.5rem;
  right: 0.9rem;
  font-size: 1.2rem;
  color: #3352ba;
  cursor: pointer;
  @media (min-width: ${breakpoints.tv}) {
    svg {
      width: 40px;
      height: 40px;
    }
  }
`;
export const CardIcon = styled.div`
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 1.25rem; // adjust icon size
  color: #3352ba; // or any color you like
  cursor: pointer;

  &:hover {
    color: #1d3aa8; // optional hover effect
  }
`;

export const CalendarWrapper = styled.div`

  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  transition: 0.3s;

  @media (max-width: 768px) {
    width: 50%;
    padding: 0.8rem;
      flex: 1;
  }

  @media (min-width: 1920px) {
    padding: 1.5rem;
  }

  @media (min-width: 2560px) {
    padding: 2rem;
  }

  @media (min-width: 3840px) {
    padding: 2.5rem;
  }
`;

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h3 {
    font-size: clamp(1rem, 1.5vw, 2.5rem);
    font-weight: bold;
    color: #3352ba; /* ✅ same color for month + year */
  }

  span {
    margin-left: 0.3rem;
    color: inherit; /* ✅ inherits h3 color */
  }
  @media (min-width: ${breakpoints.tv}) {
    h3 {
      font-size: 2.5rem;
      margin: 0;
    }
    padding: 1rem;
  }
  @media (min-width: ${breakpoints.largeTv}) {
    h3 {
      font-size: 4rem;
      margin: 0;
    }
    padding: 2rem;
  }
`;

export const NavArrow = styled.button`
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  font-weight: bold;
  color: #3352ba;
  @media (min-width: ${breakpoints.tv}) {
    font-size: 3rem;
  }
  @media (min-width: ${breakpoints.largeTv}) {
    font-size: 4rem;
  }
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.3rem;

  @media (min-width: ${breakpoints.tv}) {
    gap: 1rem;
  }
  @media (min-width: ${breakpoints.largeTv}) {
    gap: 2rem;
  }
`;


// Employee presence donut + contract expiry
export const PresenceWrapper = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  // flex-wrap: wrap;
  /* flex-direction: row; */
  gap: 1rem;
  padding-block: 0.5rem;


@media (max-width: 768px) {
    gap: 0.5rem;
    padding-block: 1rem;
    flex-direction: row; 
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    gap: 0.5rem;
    padding-block: 1rem;
    flex-direction: row;
  }

   @media (min-width: 1025px) and (max-width: 1440px) {
    gap: 0.5rem;
    padding-block: 1rem;
    flex-direction: row;
  }
  /* 🟢 1440px and above: wider layouts */
  @media (min-width: 1440px) {
    gap: 1.5rem;
    padding-block: 1.5rem;
    flex-direction: row;
  }

  /* 🟢 1920px (TV screens) */
  @media (min-width: ${breakpoints.tv}) {
    gap: 2rem;
    padding-block: 1rem;
  }

  /* 🟢 2560px (Large TV) */
  @media (min-width: ${breakpoints.largeTv}) {
    gap: 4rem;
    padding-block: 2rem;
  }
`;


export const DonutChart = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  flex: 1;
  min-width: 200px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  text-align: center;

  .circle {
    width: clamp(80px, 10vw, 140px);
    height: clamp(80px, 10vw, 140px);
    margin: 0 auto;
    border-radius: 50%;
    background: conic-gradient(blue 0% 70%, red 70% 100%);
  }
`;

export const PresenceText = styled.div`
  margin-top: 1rem;
  h2 {
    margin: 0;
    font-size: clamp(1.2rem, 2vw, 2.5rem);
    font-weight: bold;
  }
  p {
    margin: 4px 0;
    font-size: clamp(0.8rem, 1vw, 1rem);
  }
`;

export const EmployeeExpiryWrapper = styled.div`
  flex: 2;
  background: #fff;
  border-radius: 7px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  // max-height: 300px;
  // overflow-y: auto;
  h3 {
    font-family: Satoshi;
    font-weight: 700;
    font-size: clamp(1rem, 1.3vw, 2rem);
    line-height: 120%;
  }
  @media (min-width: ${breakpoints.tv}) {
    padding: 1rem;
    h3 {
      font-size: 2rem;
    }
  }
  @media (min-width: ${breakpoints.largeTv}) {
    padding: 2rem;
    h3 {
      font-size: 3rem;
    }
  }

  @media (min-width: 1025px) {
    order: 2; 
  }
`;

export const EmployeeRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 1fr 1.5fr;
  gap: 0.5rem;
  align-items: center;
  padding: 6px 0;

  @media (max-width: ${breakpoints.tablet}) {
    /* grid-template-columns: 40px 1fr; */
    gap: 0.3rem;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const Avatar = styled.img`
  width: clamp(25px, 4vw, 40px);
  height: clamp(25px, 4vw, 40px);
  border-radius: 50%;
`;

export const EmpName = styled.div`
  font-size: clamp(0.8rem, 1vw, 1.8rem);
   color: #555;
  @media (min-width: ${breakpoints.tv}) {
    font-size: 1.5rem;
    padding-block: 0.7rem;
  }
  @media (min-width: ${breakpoints.largeTv}) {
    font-size: 2.5rem;
    padding-block: 1rem;
  }
`;

export const EmpId = styled.div`
  font-size: clamp(0.7rem, 0.9vw, 1.8rem);
  color: #666;
`;

export const EmpEmail = styled.div`
  font-size: clamp(0.7rem, 0.9vw, 1.8rem);
  color: #555;
`;

// Holiday list
export const HolidayList = styled.div`
  margin-top: 1rem;
`;

export const HolidayItem = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  padding: clamp(8px, 1vw, 12px);
  border-radius: 8px;
  margin-bottom: 10px;
`;

export const HolidayIcon = styled.div`
  border-radius: 12px;
  background: #3352ba;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;

  img {
    width: clamp(20px, 2vw, 8rem);
    height: clamp(20px, 2vw, 8rem);
  }
`;

export const HolidayInfo = styled.div`
  flex: 1;
  p {
    font-size: clamp(0.7rem, 1vw, 2rem);
    color: #666;
    margin: 0;
  }
`;

export const HolidayTitle = styled.div`
  font-weight: 600;
  font-size: clamp(0.8rem, 1vw, 2.5rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
  cursor: pointer;
`;

export const HolidayDate = styled.div`
  font-size: clamp(0.8rem, 1vw, 1.8rem);
  font-weight: 500;
  color: #333;
`;

export const ChartConatiner = styled.div`
  background: #fff;
  border-radius: 12px;
  margin: 0 auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease-in-out;

  /* 📱 Mobile */
  width: 50%;
  height: 260px;

  /* 📱 Tablets */
  @media (min-width: 768px) {
    width: 40%;
    // height: 320px;
  }
    @media (min-width: 769px) and (max-width: 1024px) {
    // height: 320px;
  }


  /* 💻 Desktops / 1080p */
  @media (min-width: 1025px)  and (max-width: 1439px) {
    //  width: 100%;
    height: 300px;
      order: 1;
  }
@media (min-width: 1440px) {
    width: 300px;
    height: 350px;
  }
  /* 🖥️ 2K Displays */
  @media (min-width: 1920px) {
    width: 500px;
    height: 450px;
  }

  /* 🖥️ QHD (2.5K) */
  @media (min-width: 2560px) {
    width: 600px;
    height: 520px;
  }

  /* 🖥️ 4K Ultra HD */
  @media (min-width: 3840px) {
    width: 800px;
    height: 700px;
  }
`;

// Calendar Day
export const CalendarDay = styled.div`
  text-align: center;
  padding: clamp(0.4rem, 0.8vw, 0.8rem);
  border-radius: 6px;
  font-size: clamp(0.7rem, 1vw, 1rem);
  min-height: clamp(35px, 4vw, 50px);

  background: ${({ isToday, isSelected, isHoliday }) =>
    isSelected
      ? "#3352BA"
      : isToday
      ? "#81a6f5ff"
      : isHoliday
      ? "#FFECEC" 
      : "transparent"};

  color: ${({ isToday, isSelected, isHoliday }) =>
    isSelected || isToday ? "#fff" : "#000"};

  border: ${({ isSelected, isHoliday, isToday }) =>
    isSelected
      ? "2px solid #1e3a8a"
      : isHoliday
      ? "1px solid #FFCCCC"
      : isToday
      ? "2px solid #1e3a8a"
      : "none"};

  font-weight: ${({ isToday, isSelected }) =>
    isToday || isSelected ? "bold" : "normal"};

  cursor: ${({ isHeader }) => (isHeader ? "default" : "pointer")};

  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: ${breakpoints.tv}) {
    font-size: 1.5rem;
  }
  @media (min-width: ${breakpoints.largeTv}) {
    font-size: 2rem;
  }
`;


export const UpcomingHolidaySection = styled.div`
  /* background: #fff; */
  /* border-radius: 12px; */
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); */
  padding: 1rem 1.2rem;
  // margin-top: 1.5rem;
  transition: 0.3s ease all;

  @media (max-width: 768px) {
    width: 50%;
    margin-top: 0;
    padding: 0.8rem;
  }

  @media (min-width: 1920px) {
    padding: 1.5rem;
  }

  @media (min-width: 2560px) {
    padding: 2rem;
  }

  @media (min-width: 3840px) {
    padding: 2.5rem;
  }
`;

