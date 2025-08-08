// Employeedashboard.Styles.js
import styled from 'styled-components';

export const MainWrapper = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  flex-direction: column; /* Mobile-first: stack everything */

  @media (min-width: 1024px) {
    flex-direction: row; /* Side-by-side on large screens */
  }
`;

export const Container = styled.div`
  padding: 10px;
  background-color: #f4f4f4;
  width: 100%;
  box-sizing: border-box;
`;

/* Responsive card grid */
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  margin-bottom: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
`;

export const InfoCard = styled.div`
  background: white;
  padding: 12px;
  border-radius: 9px;
  border: 0.2px solid #000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 75px;
`;

export const CardTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  font-family: 'Satoshi', sans-serif;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const CardSubtitle = styled.div`
  font-size: 10px;
  color: #666;
  font-family: 'Satoshi', sans-serif;
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

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

/* Department section responsive */
export const DepartmentBox = styled.div`
  background: #F4F4F4;
  border-radius: 9px;
  border: 0.2px solid #000;
  margin-bottom: 24px;
  position: relative;
`;

export const DepartmentTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  background: white;
`;

export const DepartmentTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  background: white;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

export const DepartmentCount = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

export const SubLabel = styled.div`
  font-size: 13px;
  color: #777;
  margin-top: 12px;
  background: white;
`;

export const DepartmentHead = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-top: 4px;
  background: white;
`;

export const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  margin-top: 10px;

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
  padding: 5px;
  align-items: center;
  margin-bottom: 12px;
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
  top: 2px;
  right: 16px;
  background: #2f49d1;
  color: white;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
`;

/* Time log responsive */
export const TimeLogContainer = styled.div`
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

export const ScrollableTableWrapper = styled.div`
  overflow-y: auto;

  /* Small screens - no scroll limit */
  @media (max-width: 1023px) {
    max-height: none;
  }

  /* Laptop screens - show 5 rows */
  @media (min-width: 1024px) and (max-width: 1439px) {
    max-height: calc(5 * 60px); /* Adjust row height */
  }

  /* Laptop L and larger - show 8 rows */
  @media (min-width: 1440px) {
    max-height: calc(7 * 60px); /* Adjust row height */
  }

  /* Optional nice scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
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
  padding: 10px;
  border-radius: 9px;
  font-family: 'Satoshi', sans-serif;
`;
