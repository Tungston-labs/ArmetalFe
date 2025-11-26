import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;

  @media (min-width: 1920px) {
    padding: 20px 40px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 20px;

  @media (max-width: 1024px) {
    font-size: 18px;
    margin-bottom: 16px;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 14px;
  }

  @media (min-width: 1920px) {
    font-size: 28px;
    margin-bottom: 30px;
  }
`;

export const GridBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 24px;

  @media (max-width: 1440px) {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (max-width: 600px) {
    gap: 12px;
  }

  @media (min-width: 1920px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
`;

export const CountCard = styled.div`
  background: linear-gradient(135deg, #5c61f8ff, #b5b2ecff);
  padding: 30px 22px;
  border-radius: 18px;
  color: #fff;
  text-align: center;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.28);
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 24px rgba(99, 102, 241, 0.35);
  }

  @media (max-width: 1024px) {
    padding: 24px 16px;
  }

  @media (max-width: 600px) {
    padding: 18px 12px;
  }

  @media (min-width: 1920px) {
    padding: 40px 30px;
  }
     @media (min-width: 2560px) {
    padding: 40px 30px;
  }
     @media (min-width: 3840px) {
    padding: 50px 40px;
  }
`;

export const CountNumber = styled.h1`
  font-size: 48px;
  font-weight: 800;
  margin: 0;

  @media (max-width: 1024px) {
    font-size: 36px;
  }

  @media (max-width: 600px) {
    font-size: 28px;
  }

  @media (min-width: 1920px) {
    font-size: 64px;
  }
      @media (min-width: 2560px) {
    font-size: 64px;
  }
      @media (min-width: 3840px) {
    font-size: 6rem;
  }
`;

export const CountLabel = styled.p`
  font-size: 15px;
  opacity: 0.95;
  margin-top: 10px;

  @media (max-width: 1024px) {
    font-size: 12px;
  }

  @media (max-width: 600px) {
    font-size: 11px;
  }

  @media (min-width: 1920px) {
    font-size: 20px;
  }
      @media (min-width: 2560px) {
    font-size: 20px;
  }
      @media (min-width: 3840px) {
    font-size: 2rem;
  }
`;

export const LatestCard = styled.div`
  background: #ffffffee;
  backdrop-filter: blur(6px);
  padding: 20px 24px;
  border-radius: 18px;
  border: 1px solid rgba(226, 232, 240, 0.7);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 1024px) {
    padding: 16px 18px;
  }

  @media (max-width: 600px) {
    padding: 12px 14px;
  }

  @media (min-width: 1920px) {
    padding: 32px 36px;
  }
      @media (min-width: 2560px) {
     padding: 32px 36px;
  }
      @media (min-width: 3840px) {
     padding: 38px 39px;
  }
`;

export const LatestHeader = styled.h3`
  font-size: 17px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 16px;

  @media (max-width: 1024px) {
    font-size: 16px;
    margin-bottom: 12px;
  }

  @media (max-width: 600px) {
    font-size: 14px;
    margin-bottom: 10px;
  }

  @media (min-width: 1920px) {
    font-size: 24px;
    margin-bottom: 20px;
  }
    @media (min-width: 2560px) {
       font-size: 24px;
  }
      @media (min-width: 3840px) {
       font-size: 28px;
  } 
`;

export const LatestItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-radius: 10px;
  transition: background 0.2s;

  &:hover {
    background: #f1f5f9;
  }

  &:not(:last-child) {
    margin-bottom: 8px;
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  @media (min-width: 1920px) {
    padding: 16px 20px;
    gap: 8px;
  }
    
`;

export const DeptInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DeptName = styled.span`
  font-weight: 600;
  font-size: 15px;
  color: #0f172a;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (min-width: 1920px) {
    font-size: 20px;
  }
     @media (min-width: 2560px) {
    font-size: 22px;
  }
     @media (min-width: 3840px) {
    font-size: 28px;

  }
`;

export const DeptDate = styled.span`
  font-size: 13px;
  color: #64748b;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (min-width: 1920px) {
    font-size: 16px;
  }
     @media (min-width: 2560px) {
    font-size: 18px;

  }
     @media (min-width: 3840px) {
    font-size: 30px;
  }
`;

export const NoData = styled.div`
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
  padding: 12px 0;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 10px 0;
  }

  @media (min-width: 1920px) {
    font-size: 18px;
    padding: 16px 0;
  }
     @media (min-width: 2560px) {
    font-size: 18px;
    padding: 16px 0;
  }
     @media (min-width: 3840px) {
    font-size: 30px;
    padding: 26px 0;
  }
`;
