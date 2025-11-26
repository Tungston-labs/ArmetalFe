import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: auto;
`;

export const Section = styled.div`
  margin-top: 0px;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
  display: block;
`;






export const Hr = styled.hr`
  margin: 10px 0;
  border: 0.5px solid #ccc;
`;

export const Rowes = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 15px;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Input = styled.input`
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

export const Select = styled.select`
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

export const FullPageLoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

export const ResponsiveH3 = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 20px;
`;

/* ---------------- Cards ---------------- */
export const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

export const CardHeader = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #304EB0;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
