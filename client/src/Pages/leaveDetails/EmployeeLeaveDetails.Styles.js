import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding: 20px 30px;
  min-height: 100vh;

`;


export const PageCard = styled.div`
  background: #f5f7fa;
  padding: 22px 26px;
  border-radius: 12px;
  border: 1px solid #ebebebff;
  // border:none;
  width: 100%;
`;
export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #2d2d2d;
  margin-bottom: 12px;
`;


export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ columns }) => (columns === "2" ? "1fr 1fr" : "1fr 1fr")};
  gap: 16px;
`;


export const InfoRow = styled.div`
  margin-bottom: 16px;
`;


export const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #555;
  margin-bottom: 4px;
  display: block;
`;


export const ReadonlyInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #d4d7dd;
  background: #ffffffff;
  font-size: 14px;
  color: #444;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #d4d7dd;
  background: #f7f7f7;
  font-size: 14px;
  min-height: 100px;
  resize: none;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 15px;
  gap: 12px;
`;

export const ApproveButton = styled.button`
  background: #003366;
  color: #ffffff;
  padding: 10px 22px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
`;
export const DeclineButton = styled.button`
  background: #d03434;
  color: #ffffff;
  padding: 10px 22px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
`;

export const Divider = styled.hr`
  margin: 20px 0;
  border: none;
  border-top: 1px solid #e5e7ec;
`;
export const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: #f1f3f5;
  border: 1px solid #d8dce1;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 10px;
`;

export const ArrowIcon = styled.span`
  font-size: 14px;
  color: #555;
`;

export const ReasonBox = styled.div`
  background: #fafafa;
  border: 1px solid #e1e4e8;
  padding: 14px;
  border-radius: 8px;
  font-size: 14px;
  color: #444;
  line-height: 1.5;
  white-space: pre-line;
`;
export const CardWrapper = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background:white;
  margin-bottom: 20px;
  overflow: hidden;
  //  background: #E6ECFF;
`;

export const CardHeader = styled.div`
  padding: 16px 20px;
  // background: #E6ECFF;
  // border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

export const CardContent = styled.div`
  padding: 16px 20px;
`;
