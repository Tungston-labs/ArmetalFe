import styled from 'styled-components';

export const DepartmentContainer = styled.div`
  padding: 2rem;
  background-color: #f9faf4;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const HRManager = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #fff;
  font-size: 0.95rem;
  color: #333;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

  span {
    font-weight: 500;
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

   h2 {
    font-family: 'Satoshi';
    font-weight: 700;
    font-size: 22px;
    margin: 0;
  }

  p {
    margin: 0;
    font-size: 16px;
      font-family: 'Raleway';
  
  }
`;

export const Icon = styled.div`
  font-size: 2rem;
  color: #2a2a86;
`;

export const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 1rem;
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(to right, #2a2a86, #3e64ff);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
`;

export const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 0.9rem;
  width: 220px;
`;

export const CardGrid = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

export const DepartmentCard = styled.div`
  background: #e5eaf0;
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h3 {
    margin: 0;
    font-size: 1.1rem;
  }
`;

export const HeadInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  small {
    font-size: 0.7rem;
    color: #888;
  }

  p {
    margin: 0;
    font-weight: 500;
  }
`;

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

export const CardValue = styled.div`
  margin-left: auto;
  font-weight: bold;
  color: #2a2a86;
  font-size: 1rem;
`;

// ✅ Modal Components
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 600px;
  width: 100%;
  position: relative;
  z-index: 1000;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
`;
