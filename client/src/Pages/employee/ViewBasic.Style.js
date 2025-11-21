import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
  background: white;
  font-family: Satoshi;
`;


export const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.8rem;
  font-size: 1rem;
  color: black;
  border-radius: 7px;
  border: 1px solid #052db4;
  background: #fff;
  box-sizing: border-box;
  margin-bottom: 5px;
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.5rem 0.7rem;
  }

  /* Medium screens */
  @media (min-width: 1020px) {
    font-size: 1.1rem;
    padding: 0.6rem 0.9rem;
  }

  @media (min-width: 1440px) {
    font-size: 1rem;
    padding: 0.7rem 0.9rem;
  }

  @media (min-width: 1920px) {
    font-size: 1.2rem;
    padding: 0.9rem 1.2rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.5rem;
    padding: 1.2rem 1.5rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 3840px) {
    font-size: 2rem;
    padding: 1.5rem 2rem;
    margin-bottom: 1rem;
  }
`;


export const ResponsiveH3 = styled.h3`
  font-family: Satoshi, sans-serif;
  font-weight: 700;
  color: #030303;

  /* Responsive font size */
  font-size: clamp(
    1rem,
    2vw,
    1.2rem
  ); /* min 1rem, max 2rem, scales with viewport */

  /* Optional: adjust margin for responsiveness */
  margin-top: clamp(0.5rem, 1vw, 1rem);
  margin-bottom: clamp(0.5rem, 1vw, 1rem);

  /* Ultra-large screens */
  @media (min-width: 3840px) {
    /* 4K */
    font-size: 3rem;
  }

  @media (min-width: 7680px) {
    /* 8K */
    font-size: 4rem;
  }
`;


export const Section = styled.div`
  //   padding: 2rem;
  background: white;
  font-family: sans-serif;
`;

export const Tabs = styled.div`
  display: flex;
  justify-content: center;
  gap: clamp(0.5rem, 2vw, 3rem); /* responsive gap between tabs */
  margin-bottom: clamp(1rem, 2vw, 2rem);
  flex-wrap: wrap; /* allows tabs to wrap on small screens */
  padding: clamp(0.5rem, 1vw, 1rem);
`;

export const Tab = styled.button`
  background: ${({ active }) => (active ? "#002ea3" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  border: ${({ active }) => (active ? "none" : "1px solid #ccc")};
  border-radius: 6px;
  padding: clamp(0.4rem, 1vw, 0.8rem) clamp(0.8rem, 2vw, 1.5rem); /* responsive padding */
  font-size: clamp(0.8rem, 1vw, 1.2rem); /* responsive font size */
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ active }) => (active ? "#002ea3" : "#f0f0f0")};
  }

  /* Large screens adjustments */
  @media (min-width: 1440px) {
    font-size: 1rem;
    padding: 0.8rem 1.6rem;
  }

  @media (min-width: 1960px) {
    font-size: 1.2rem;
    padding: 0.9rem 1.8rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.6rem;
    padding: 1rem 2rem;
  }

  @media (min-width: 3840px) {
    /* 4K */
    font-size: 2rem;
    padding: 1.2rem 2.2rem;
  }

  @media (min-width: 7680px) {
    /* 8K */
    font-size: 2.5rem;
    padding: 1.5rem 3rem;
  }
`;
export const GroupLabel = styled.h4`
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #000;
  font-family: Satoshi;
  font-style: normal;
  font-weight: 700;
  line-height: 1.3;

  /* Responsive font sizing */
  font-size: clamp(1rem, 1.2vw, 2rem);

  /* Adjust for ultra-wide screens */
  @media (min-width: 3840px) {
    font-size: 2.5rem;
  }

  @media (min-width: 7680px) {
    font-size: 3rem;
  }
`;

export const Rows = styled.div`
  display: flex;
  flex-wrap: wrap; /* wrap items on smaller screens */
  gap: 1rem; /* default gap */
  margin-bottom: 1rem;
  align-items: flex-start;
  background-color: #fff;

  /* Small phones */
  @media (max-width: 480px) {
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  /* Tablets */
  @media (min-width: 481px) and (max-width: 768px) {
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  /* Laptops & Desktops */
  @media (min-width: 769px) and (max-width: 1020px) {
    gap: 1rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 1021px) and (max-width: 1440px) {
    gap: 1.2rem;
    margin-bottom: 1.2rem;
  }

  @media (min-width: 1441px) and (max-width: 1920px) {
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  /* 2K screens */
  @media (min-width: 1921px) and (max-width: 2560px) {
    gap: 1.8rem;
    margin-top: 1.2rem;
  }

  /* 4K screens */
  @media (min-width: 2561px) and (max-width: 3839px) {
    gap: 2rem;
    margin-top: 1.2rem;
  }

  /* 8K screens */
  @media (min-width: 3840px) {
    gap: 2.5rem;
    margin-top: 1.2rem;
  }
`;


export const Select = styled.select`
  width: 100%;
  padding: clamp(0.6rem, 0.8vw, 1rem) clamp(0.8rem, 1vw, 1.2rem);
  border-radius: 7px;
  border: 1px solid #052db4;
  background: #fff;
  color: black;
  margin-top: 5px;
  /* Fluid responsive font size */
  font-size: clamp(0.75rem, 0.9vw, 1rem);

  /* Native dropdown reset + custom arrow */
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;

  &:focus {
    outline: none;
    border-color: #3352ba;
    box-shadow: 0 0 4px rgba(5, 45, 180, 0.3);
  }

  /* Responsive refinements */
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.6rem 0.8rem;
  }

  @media (min-width: 1920px) {
    font-size: 1.5rem;
    padding: 1.2rem 1rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 3840px) {
    font-size: 2rem;
    padding: 1.5rem 2rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 7680px) {
    font-size: 1.3rem;
    padding: 1.4rem 2rem;
    margin-bottom: 1rem;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem; /* adds vertical spacing */
`;


export const Rowes = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;

  > input,
  > select {
    flex: 1;
    padding: 0.6rem 1rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    min-width: 0;
    border-radius: 7px;
    border: 1px solid #052db4;
    background: #fff;
  }
`;

export const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ccc;
`;

export const FullPageLoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;


export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
