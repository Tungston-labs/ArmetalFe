import styled from 'styled-components';

export const Container = styled.div`
  // padding: 2rem;
  background: white;
  font-family: 'Segoe UI', sans-serif;
`;

export const Header = styled.div`
  margin-bottom: clamp(1rem, 2vw, 3rem); /* responsive bottom margin */

  h2 {
    margin: 0;
    color: #222;
    font-family: Satoshi, sans-serif;
    font-weight: 700;
    line-height: 1.2;

    /* responsive font size */
    font-size: clamp(1.2rem, 2vw, 2.5rem);

    /* Extra-large screen adjustments */
    @media (min-width: 3840px) { /* 4K */
      font-size: 3rem;
    }

    @media (min-width: 7680px) { /* 8K */
      font-size: 4rem;
    }
  }
`;

export const SectionTitle = styled.h4`
  margin-top: clamp(1rem, 2vw, 3rem);
  margin-bottom: clamp(0.5rem, 1.5vw, 2rem);
  color: #333;
  font-family: Satoshi, sans-serif;
  font-weight: 700;
  line-height: 1.2;

  /* Responsive font size: min 1rem, grows with viewport, max 3rem */
  font-size: clamp(1rem, 1.5vw, 3rem);

  /* Extra scaling for ultra-wide screens */
  @media (min-width: 3840px) { /* 4K */
    font-size: 3.2rem;
    margin-top: 3.5rem;
    margin-bottom: 2.5rem;
  }

  @media (min-width: 7680px) { /* 8K */
    font-size: 4rem;
    margin-top: 4rem;
    margin-bottom: 3rem;
  }
`;

export const FormSection = styled.div`
  border-radius: 12px;

`;

export const Row = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap:wrap;
`;

export const FormGroup = styled.div`
  flex: 1 ;
  min-width: 250px;
`;


export const Input = styled.input`
  width: 100%;
  padding: clamp(0.6rem, 0.8vw, 1rem) clamp(0.8rem, 1vw, 1.2rem);
  font-size: clamp(0.8rem, 0.9vw, 1.1rem);
  color: black;
  border-radius: 7px;
  border: 1px solid #052DB4;
  background: #FFF;
  box-sizing: border-box;
margin-top:5px;
  /* Responsive refinements */
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.6rem 0.8rem;
  }

  @media (min-width: 1920px) {
    font-size: 1.5rem;
    padding: 1rem 1rem;
    margin-bottom:1rem;
  }

  @media (min-width: 3840px) {
    font-size: 2rem;
    padding: 1.5rem 2rem;
    margin-bottom:1rem;
  }

  @media (min-width: 7680px) {
    font-size: 1.3rem;
    padding: 1.4rem 2rem;
    margin-bottom:1rem;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: clamp(0.6rem, 0.8vw, 1rem) clamp(0.8rem, 1vw, 1.2rem);
  border-radius: 7px;
  border: 1px solid #052DB4;
  background: #FFF;
  color: black;
margin-top:5px;
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
    border-color: #3352BA;
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
    margin-bottom:1rem;
  }

  @media (min-width: 3840px) {
    font-size: 2rem;
    padding: 1.5rem 2rem;
    margin-bottom:1rem;
  }

  @media (min-width: 7680px) {
    font-size: 1.3rem;
    padding: 1.4rem 2rem;
    margin-bottom:1rem;
  }
`;
export const ImageUpload = styled.div`
  width: 60px;
  height: 60px;
  background: #eee;
  border: 1px dashed #999;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 1.5rem;
`;


export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: clamp(0.5rem, 1vw, 3rem); /* scales from small to ultra-wide */
  margin-top: clamp(1rem, 2vw, 4rem);
  flex-wrap: wrap; /* wraps buttons on small screens */
`;

export const Button = styled.button`
  background: ${({ secondary }) => (secondary ? '#9EABD8' : '#172554')};
  color: ${({ secondary }) => (secondary ? '#000' : '#fff')};
  padding: clamp(0.5rem, 1vw, 1.2rem) clamp(1rem, 2vw, 2.5rem);
  border: none;
  border-radius: clamp(6px, 1vw, 12px);
  font-size: clamp(0.8rem, 1vw, 1.8rem);
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ secondary }) => (secondary ? '#aab3d0' : '#002244')};
  }

  /* Extra scaling for very large screens (4K+) */
  @media (min-width: 3840px) {
    padding: 1.5rem 3rem;
    font-size: 2rem;
    border-radius: 14px;
  }

  /* Ultra-large screens (8K) */
  @media (min-width: 7680px) {
    padding: 2rem 4rem;
    font-size: 2.2rem;
    border-radius: 16px;
  }
`;


export const TwoColumnRows= styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  width:100%;
  margin-top:10px;
  
`;

export const ImagePreview = styled.img`
  margin-top: clamp(0.5rem, 1vw, 1rem);   /* scales margin */
  width: clamp(100px, 15vw, 400px);       /* min 100px, grows with screen, max 400px */
  height: auto;                            /* maintain aspect ratio */
  border-radius: clamp(4px, 1vw, 12px);   /* radius scales */
  border: 1px solid #ccc;
  display: block;
`;

export const FileInput = styled.input`
  margin-top: clamp(0.5rem, 1vw, 1rem);   /* scales margin */
  width: 100%;                             /* full width of parent */
  max-width: clamp(200px, 50vw, 600px);   /* min 200px, max 600px */
  padding: clamp(0.3rem, 0.8vw, 0.8rem);  /* responsive padding */
  display: block;
  font-size: clamp(0.8rem, 1vw, 1.2rem);  /* text inside input scales */
  border-radius: clamp(6px, 1vw, 10px);
  border: 1px solid #052DB4;
  background: #fff;
  color: #000;
  cursor: pointer;
`;
export const FormGroups = styled.div`
  margin-bottom: 1rem;
  width: 100%;
`;