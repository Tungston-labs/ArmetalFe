import styled from 'styled-components';


export const MainWrapper = styled.div`
  display: flex;
  // justify-content: flex-end;
  // width: 100vw;
  // padding: 40px;
  box-sizing: border-box;
`;

export const Container = styled.div`
  padding: 10px;
  background-color: #f4f4f4;
  font-family: 'Arial', sans-serif;
  // width:50%;
`;

export const CardGrid = styled.div`
  display: grid;
  
  grid-template-columns: repeat(4,1fr);
  gap: 10px;
  margin-bottom: 12px;
`;

export const InfoCard = styled.div`
  background: white;
  padding: 12px;
  border-radius: 9px;
  border: 0.2px solid #000;
  background: #FFF;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 75px; /* Set fixed height or min-height if needed */
`;


export const CardTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
   font-family: 'Satoshi', sans-serif;
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
`;

// Department box styles
export const DepartmentBox = styled.div`
  background: #F4F4F4;
  // width:50%;
  border-radius: 10px;
  // padding: 20px;
  position: relative;
  margin-bottom: 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  border-radius: 9px;
border: 0.2px solid #000;
`;

export const DepartmentTitleRow = styled.div`
  display: flex;
  justify-content:flex-start;
  align-items: center;
  background:white;
  gap:2rem;
`;

export const DepartmentTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  background:white;

`;

export const DepartmentCount = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

export const SubLabel = styled.div`
  font-size: 13px;
  color: #777;
  margin-top: 12px;
  background:white;

`;

export const DepartmentHead = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-top: 4px;
  background:white;

`;

export const MemberList = styled.div`
  margin-top: 16px;
  max-height: 140px;
  overflow-y: auto;
   font-family: 'Satoshi', sans-serif;
`;

export const Member = styled.div`
  display: flex;
  padding:5px;
  align-items: center;
  margin-bottom: 12px;
  background:white;
  
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
  top:2px;
  right: 16px;
  background: #2f49d1;
  color: white;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
`;

// Time log
export const TimeLogContainer = styled.div`
  background: #fff;
  // border-radius: 10px;
  // padding: 20px;
  // max-width: 800px;
  // width:50%;
  // margin: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    
    
`;
export const ScrollableTableWrapper = styled.div`
  max-height: 280px; /* Adjust depending on your row height */
  overflow-y: auto;
`;

export const DateHeading = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #2f49d1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  margin-top:-15px;
   font-family: 'Satoshi', sans-serif;
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
`;

export const TableCell = styled.td`
  padding: 10px;
  font-size: 14px;
  color: #333;
  // display: flex;
  align-items: center;
  gap: 6px;
   font-family: 'Satoshi', sans-serif;
  justify-content: ${(props) =>
    props.align === 'right' ? 'flex-end' :
    props.align === 'center' ? 'center' :
    'flex-start'};
`;

export const Icon = styled.span`
  color: #999;
  font-size: 16px;
`;
export const SvgIcon = styled.img`
  width: 14px;
  height: 14px;
  
`;
export const Department =styled.div
  `background:white;
  padding:10px;
  border-radius:9px;
   font-family: 'Satoshi', sans-serif;
  `;

