import styled from "styled-components";

export const PageWrapper = styled.div`
  padding: 20px 30px;
  min-height: 100vh;
`;

export const Card = styled.div`
background: #f5f7fa;
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.4);
  margin-bottom: 25px;
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px; 
`;

export const ProfileRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

export const ProfileImage = styled.img`
  width: 85px;
  height: 85px;
  border-radius: 10%;
  object-fit: cover;
  border: 3px solid #eee;
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;
`;

export const Label = styled.div`
  width: 130px;        /* FIXED WIDTH FOR PERFECT ALIGNMENT */
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

export const Value = styled.div`
  flex: 1;             /* TAKES REMAINING SPACE */
  text-align: left;    /* OR right IF YOU WANT RIGHT ALIGN */
  font-size: 15px;
  font-weight: 600;
  color: #222;
`;


export const StatusSelect = styled.select`
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  color: white;
  font-weight: 600;
  cursor: pointer;
  background: ${(props) => props.statusColor};
  outline: none;
`;

export const Divider = styled.div`
  height: 1px;
  background: #e5e5e5;
  margin: 20px 0;
`;

export const NoteBox = styled.div`
  background: #f8f9fc;
  border: 1px solid #e3e6ee;
  padding: 14px;
  border-radius: 10px;
  font-size: 14px;
  color: #444;
  line-height: 1.5;
  margin-top:10px;
`;

export const BillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 15px;
  margin-top: 10px;
`;
export const BillImageWrapper = styled.div`
  background: #fafafa;
  border-radius: 10px;
  overflow: hidden;
  height: 180px;           /* increased from 140px */
  box-shadow: 0 2px 6px rgba(0,0,0,0.09);
`;


export const BillImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;  
  background: #fff;     
  padding: 8px;          
`;


export const NoteCard = styled.div`
  background: #fdfdff;
  border: 1px solid #e6e9f1;
  border-radius: 10px;
  padding: 12px 16px;
  margin-top: 10px;
`;

export const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #333;

  &:hover {
    opacity: 0.7;
  }
`;

export const Arrow = styled.span`
  font-size: 18px;
  transition: 0.3s;
`;
