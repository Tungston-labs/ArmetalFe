import styled from "styled-components";

export const FilterWrapper = styled.div`
  width: 100%;
  background: white;
  border-radius: 10px;
  padding: 10px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
margin-bottom: 15px;
  @media (max-width:992px){
    flex-direction:column;
    align-items:stretch;
  }
`;

export const LeftSection = styled.div`
  display:flex;
  gap:16px;
  flex-wrap:wrap;
  flex:1;

  @media(max-width:768px){
    flex-direction:column;
  }
`;

export const RightSection = styled.div`
  display:flex;
  justify-content:flex-end;

  @media(max-width:992px){
    justify-content:stretch;
  }
`;

export const SearchWrapper = styled.div`
  position:relative;
  width:280px;

  @media(max-width:768px){
    width:100%;
  }
`;

export const SearchInput = styled.input`
  width:100%;
  height:46px;
  border:1px solid #e5e7eb;
  border-radius:5px;
  padding:0 40px 0 15px;
  font-size:14px;
  outline:none;

  &:focus{
    border-color:#F78926;
  }
`;

export const SearchIcon = styled.div`
  position:absolute;
  right:14px;
  top:50%;
  transform:translateY(-50%);
  color:#666;
`;

export const Select = styled.select`
  width:180px;
  height:46px;
  border:1px solid #e5e7eb;
  border-radius:5px;
  padding:0 15px;
  font-size:14px;
  outline:none;
  background:white;

  &:focus{
    border-color:#F78926;
  }

  @media(max-width:768px){
    width:100%;
  }
`;

export const DateInput = styled.input`
  width:180px;
  height:46px;
  border:1px solid #e5e7eb;
  border-radius:5px;
  padding:0 15px;
  font-size:14px;
  outline:none;
  background:white;

  &:focus{
    border-color:#F78926;
  }

  @media(max-width:768px){
    width:100%;
  }
`;