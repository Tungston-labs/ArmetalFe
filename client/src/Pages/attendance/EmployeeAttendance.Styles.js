import styled from 'styled-components';

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 40px;
`;

export const CardContainer = styled.div`
//   display: flex;
  align-items: center;
  gap: 1rem;
//   width: 300px;
  position: relative;
  // background:red;
`;

export const Initial = styled.div`
  font-size: 6rem;
  font-weight: 700;
  color: #B5E2FF;
  transition: all 0.3s ease;

  &:hover {
    color:rgb(103, 148, 214); /* example hover color */
    transform: scale(1.1); /* optional: slightly enlarges on hover */
  }
`;

export const InfoSection = styled.div`
  flex-grow: 1;
`;

export const Title = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
`;

export const SubTitle = styled.div`
  font-size: 0.9rem;
  color: #555;
`;

export const HeadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
`;

export const Avatar = styled.img`
  height: 24px;
  width: 24px;
  border-radius: 50%;
`;

export const HeadName = styled.div`
  font-size: 0.95rem;
`;

export const Count = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
`;

export const Icon = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
`;
export const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 7px;
  background-color: #fff;
  width: 120px;
`;
export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;
export const Tabs = styled.div`
  display: flex;
  gap: 2rem;
  margin: 1.7rem 0;
  // border-bottom: 2px solid #ddd;
  
`;
export const Tab = styled.div`
  padding:5px  20px;
  cursor: pointer;
  background:#304EB0;
  font-weight: 500;
  background: ${({ active }) => (active ? "3px solid #1e3a8a" : "none")};
  color: ${({ active }) => (active ? "white" : "#555")};
`;
export const SearchWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
`;

export const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  min-width: 250px;
`;
export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const HRManager = styled.div`
  display: flex;
  height: 30px;
  align-items: center;
  padding: 0.3rem;
  border: 1px solid black;
  border-radius: 8px;
  background-color:rgb(178, 196, 243);
  font-size: 0.95rem;
  color: #333;

  span {
    font-weight: 500;
  }

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
`;
export const Subtitle = styled.p`
  font-size: 14px;
  color: #555;
  margin-left: 10px;
  margin-top: -1px;
  color: #1e3a8a;


`;

export const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.6rem;

  .card-value {
    font-weight: 600;
    font-size: 1.5rem;
    color: #000;
  }

  .arrow-icon {
  background: rgb(255, 255, 255);
  color: rgb(52, 52, 124);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

`;

// export const CardContainer = styled.div`
//   padding: 2rem;
// `;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 1rem;
// background:black;
`;
export const DeptTitle = styled.div`
  font-weight: bold;
  font-size: 1.2rem;
`;
export const DeptSub = styled.div`
  font-size: 0.9rem;
  color: #666;
`;
export const DeptHead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;

  span {
    font-size: 0.95rem;
  }
`;
export const Card = styled.div`
  // background: yellow;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  cursor: pointer;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    // background-color: rgba(213, 210, 210, 1);

    ${DeptTitle},
    ${DeptSub},
    ${DeptHead} span,
    ${CardRight} .card-value {
      color: rgb(62, 101, 200);
    }

    ${CardRight} .arrow-icon {
      background-color: rgb(51, 51, 192);
      color: white;
    }

    ${Initial} {
      color: #1a73e8;
      transform: scale(1.1);
    }
  }

  h3 {
    font-size: 1.05rem;
    font-weight: 600;
    margin: 0;
    color: #000;
    font-family: 'Satoshi';
  }

  .head-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;

    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
    }

    .head-name {
      font-size: 0.85rem;
      margin: 0;
      font-weight: 500;
      color: #000;
    }
  }
`;


// export const Initial = styled.div`
//   font-size: 64px;
//   font-weight: bold;
//   color: #e3f0fc;
// `;

export const DeptInfo = styled.div`
  flex: 1;
  margin: 0 1rem;
`;


export const HeadImg = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
`;

// export const Count = styled.div`


//   font-size: 1.25rem;
//   font-weight: bold;
// `;