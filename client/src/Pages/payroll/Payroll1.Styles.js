import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background-color: #f9fbf2;
  font-family: Arial, sans-serif;
`;
export const SearchInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-bottom:0.9rem;
`;

export const Section = styled.div`
  margin-bottom: 2rem;
`;
export const FormWrapper = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
`;
export const ImageColumn = styled.div`
  flex: 0 0 auto;

  img {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    object-fit: cover;
  }
`;
export const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ccc;

`;
export const Rowes = styled.div`
  display: flex;
  gap: 2.5rem;
  width:100%;
  flex-wrap: wrap;
  align-items: flex-start;
`;
export const Rows = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: flex-start; /* ensures top alignment */
`;

export const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  min-width: 250px;
`;

export const RightSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: rem;
  min-width: 300px;
`;


export const Input = styled.input`
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;

`;
export const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 50px;
    height: 60px;
  }

  @media (max-width: 480px) {
    width: 20px;
    height: 30px;
  }
`;
export const SectionTitle = styled.h3`
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
`;

export const Table = styled.div`
  width: 100%;
  border-collapse: collapse;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  padding: 0.5rem 0;
`;

export const Label = styled.div`
  width: 50%;
  font-weight: 500;
  color: #333;
`;

export const Value = styled.div`
  width: 50%;
  text-align: right;
  color: #444;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;

  span {
    padding: 0.4rem 0.8rem;
    border: 1px solid #ccc;
    cursor: pointer;
    border-radius: 4px;

    &.active {
      background-color: #2f4cac;
      color: white;
    }
  }
`;
export const Textarea = styled.textarea`
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;
  resize: none;
  height: 70px;
`;
