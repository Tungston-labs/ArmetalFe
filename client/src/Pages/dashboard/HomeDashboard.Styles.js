import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding:20px;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  transition: all 0.3s ease;

  &.shrink {
    margin-right: 300px;
    transform: scale(0.97);
  }
`;

export const TwoColumn = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  margin-top: 20px;
`;

export const LeftBox = styled.div`
  flex: 2;
`;

export const RightBox = styled.div`
  flex: 1;
`;

/* THREE COLUMNS */
export const ThreeColumnRow = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

export const ThreeBox = styled.div`
  flex: 1;
  background: white;
  padding: 16px;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);

  overflow: hidden;
`;
