// Employeedashboard.Styles.js
import styled from 'styled-components';

export const MainWrapper = styled.div`

  width: 100%;
  box-sizing: border-box;
  flex-direction: column; /* Mobile-first: stack everything */

  @media (min-width: 1024px) {
    flex-direction: row; /* Side-by-side on large screens */
  }
`;

export const Container = styled.div`
  padding: 10px;
    display: flex;
  background-color: #f4f4f4;
  width: 100%;
  box-sizing: border-box;
`;

/* Responsive card grid */
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* default: 2 per row for small screens */
  gap: 10px;
  margin-bottom: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr); /* 4 per row for tablets and up */
  }
`;


export const InfoCard = styled.div`
  background: white;
  padding: 12px;
  border-radius: 9px;
  // border: 0.2px solid gray;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 75px;
`;

export const CardTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
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
    font-size: 15px;
  }

  /* Extra-large / 4K screens */
  @media (min-width: 1601px) {
    font-size: 30px;
  }
}
`;

export const CardSubtitle = styled.div`
  font-size: 13px;
  color: #666;
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
margin-top: -10px;

  }

  /* Extra-large / 4K screens */
  @media (min-width: 1601px) {
    font-size: 20px;
  }
}
`;

export const CardLink = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #2f49d1;
  font-weight: 500;
  font-size: 14px;
  font-family: 'Raleway', sans-serif;

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

/* Department section responsive */
export const DepartmentBox = styled.div`
  background: #F4F4F4;
  // border-radius: 9px;
  // border: 0.2px solid gray;
  margin-bottom: 24px;
  position: relative;
  margin-top:-2px;
  min-height:300px;
`;

export const DepartmentTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  background: white;
`;

export const DepartmentTitle = styled.div`
  font-size: 20px; /* default */
  font-weight: 700;
  background: white;

  /* Small devices (mobile) */
  @media (max-width: 480px) {
    font-size: 16px;
  }

  /* Medium devices (tablets) */
  @media (min-width: 481px) and (max-width: 1024px) {
    font-size: 18px;
  }

  /* Large desktops */
  @media (min-width: 1025px) and (max-width: 1600px) {
    font-size: 20px;
  }

  /* Extra-large / 4K screens */
  @media (min-width: 1601px) {
    font-size: 28px;
  }
`;


export const DepartmentCount = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

export const SubLabel = styled.div`
  font-size: 13px; /* default */
  color: #777;
  margin-top: 12px;
  background: white;

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
    font-size: 18px;
  }
`;

export const DepartmentHead = styled.div`
  font-size: 16px; /* default */
  font-weight: 500;
  margin-top: 4px;
  background: white;

  /* Small devices (mobile) */
  @media (max-width: 480px) {
    font-size: 14px;
  }

  /* Medium devices (tablets) */
  @media (min-width: 481px) and (max-width: 1024px) {
    font-size: 15px;
  }

  /* Large desktops */
  @media (min-width: 1025px) and (max-width: 1600px) {
    font-size: 16px;
  }

  /* Extra-large / 4K screens */
  @media (min-width: 1601px) {
    font-size: 22px;
  }
`;


export const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  margin-top: 12px;

  /* Small screens - show all members */
  @media (max-width: 1023px) {
    max-height: none;
  }

  /* Laptop - show 3 employees */
  @media (min-width: 1024px) and (max-width: 1439px) {
    max-height: calc(3 * 60px); /* adjust 60px to match member row height */
  }

  /* Laptop L and larger - show 5 employees */
  @media (min-width: 1440px) {
    max-height: calc(3 * 60px); /* adjust 60px to match member row height */
  }
  /* Laptop L and larger - show 5 employees */
  @media (min-width: 1940px) {
    max-height: calc(5 * 60px); /* adjust 60px to match member row height */
  }
  /* Optional custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.2);
    border-radius: 4px;
  }
`;

export const Member = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  background: white;
`;

export const Avatar = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  object-fit: cover;
  margin-right: 10px;
`;

export const MemberName = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

export const ArrowIcon = styled.div`
  position: absolute;
  right: 16px;
  background: #2f49d1;
  color: white;
  padding: 7px;
  border-radius: 50%;
  cursor: pointer;
  margin-top:-10px;
`;

/* Time log responsive */
export const TimeLogContainer = styled.div`
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  // border-radius: 8px;
  padding: 12px;
  margin-top:10px;

  /* Mobile padding fix */
  @media (max-width: 480px) {
    padding: 8px;
  }
`;

export const ScrollableTableWrapper = styled.div`
  overflow-y: auto;
  overflow-x: auto; /* make sure wide tables scroll horizontally */
  padding-right: 4px;

  /* Mobile (default) - show all rows */
  max-height: none;

  /* Tablet (≥768px and ≤1023px) - show up to 4 rows */
  @media (min-width: 768px) and (max-width: 1023px) {
    max-height: calc(3 * 70px);
  }

  /* Laptop (≥1024px and ≤1439px) - show up to 5 rows */
  @media (min-width: 1024px) and (max-width: 1439px) {
    max-height: calc(5 * 70px);
  }

  /* Large laptop / desktop (≥1440px and ≤1919px) - show up to 8 rows */
  @media (min-width: 1440px) and (max-width: 1919px) {
    max-height: calc(8 * 70px);
  }

  /* Ultra-wide screens (≥1920px) - show up to 10 rows */
  @media (min-width: 1920px) {
    max-height: calc(10 * 70px);
  }

  /* Smooth scrolling */
  scroll-behavior: smooth;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.2);
    border-radius: 4px;
  }
`;



export const DateHeading = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #2f49d1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  margin-top: -15px;
  font-family: 'Satoshi', sans-serif;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const ArrowButton = styled.button`
  background: #2f49d1;
  color: #fff;
  border: none;
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableRow = styled.tr`
  border-bottom: 15px solid #eee;
`;

export const TableHeader = styled.th`
  padding: 10px;
  font-weight: bold;
  font-size: 14px;
  font-family: 'Raleway', sans-serif;
  color: ${(props) => (props.green ? 'green' : props.red ? 'red' : '#333')};

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

export const TableCell = styled.td`
  padding: 10px;
  font-size: 14px;
  color: #333;
  font-family: 'Satoshi', sans-serif;
  text-align: ${(props) =>
    props.align === 'right' ? 'right' :
    props.align === 'center' ? 'center' :
    'left'};

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

export const Icon = styled.span`
  color: #999;
  font-size: 16px;
`;

export const SvgIcon = styled.img`
  width: 14px;
  height: 14px;
`;

export const Department = styled.div`
  background: white;
  padding: 18px;
  border-radius: 9px;
  font-family: 'Satoshi', sans-serif;
`;
export const NoLogsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* Allow scrolling if content exceeds screen height */
  max-height: 70vh;
  overflow-y: auto;

  padding: 20px;
  text-align: center;

  img {
    max-width: 100%;
    max-height: 60vh; /* Prevents image from overflowing */
    height: auto;
    object-fit: contain;
  }

  p {
    margin-top: 10px;
    color: #666;
  }

  /* Small devices */
  @media (max-height: 600px) {
    img {
      max-height: 40vh;
    }
  }
`;
