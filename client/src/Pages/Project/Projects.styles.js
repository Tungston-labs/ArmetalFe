import styled from "styled-components";

export const ProjectsPage = styled.main`
  width: 100%;
  min-height: 100vh;

  background: #f7f8fc;

  padding: 20px;

  box-sizing: border-box;

  @media (max-width: 1200px) {
    padding: 25px;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

export const ProjectsContainer = styled.div`
  width: 100%;
  max-width: 1800px;

  margin: 0 auto;
`;

export const ProjectsGrid = styled.div`
  width: 100%;

  display: grid;

  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 36px 30px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    gap: 28px 24px;
  }
 @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    gap: 28px 24px;
  }
  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    gap: 24px 20px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;

    gap: 18px;
  }
`;