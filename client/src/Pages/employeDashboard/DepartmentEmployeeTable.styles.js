import styled from "styled-components";

export const Card = styled.div`
  width: 100%;
  background: #ffffff;
  padding: 28px 32px;
  border-radius: 20px;
  border: 1px solid #e6e8ec;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0px 8px 28px rgba(0, 0, 0, 0.1);
  }
`;

export const Title = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1f1f1f;
  margin-bottom: 22px;
  position: relative;
  padding-left: 18px;

`;

export const Section = styled.div`
  background: #f8f9fc;
  padding: 18px 20px;
  border-radius: 14px;
  border: 1px solid #edf0f7;
`;

export const Item = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 2px;
`;

export const Left = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #666;
`;

export const Right = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #222;
  text-align: right;
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #e1e4eb;
  margin: 8px 0;
`;
