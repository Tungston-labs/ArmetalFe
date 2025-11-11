import styled from "styled-components";
const breakpoints = {
  mobile: "480px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "1440px",
  tv: "2560px",     // 2K / QHD screens
  largeTv: "3840px" // 4K UHD screens
};
export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);  
  gap: 1rem;
  margin: 0.5rem;
  background: #f4f4f4;

  /* 📱 Mobile */
  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }

  /* 📱 Tablets */
  @media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.laptop}) {
    grid-template-columns: repeat(3, 1fr);
  }

  /* 💻 Standard desktops */
  @media (min-width: ${breakpoints.laptop}) and (max-width: ${breakpoints.desktop}) {
    grid-template-columns: repeat(3, 1fr);
  }

  /* 🖥️ 2K / QHD screens */
  @media (min-width: ${breakpoints.tv}) and (max-width: ${breakpoints.largeTv}) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    max-width: 100%;
    margin: 0 auto;
  }

  /* 🖥️ 4K screens */
  @media (min-width: ${breakpoints.largeTv}) {
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
    max-width: 100%;
    padding-bottom: 4rem;
  }
`;



export const Card = styled.div`
  position: relative;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  padding: 1rem;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.12);
  }

  /* 📱 Tablets */
  @media (max-width: ${breakpoints.laptop}) {
    padding: 0.8rem;
  }

  /* 📱 Mobile */
  @media (max-width: ${breakpoints.mobile}) {
    padding: 0.6rem;
    border-radius: 8px;
    font-size: 0.9rem;
  }

  /* 🖥️ 2K and above */
  @media (min-width: ${breakpoints.tv}) {
    padding: 1.5rem;
  }

  /* 🖥️ 4K */
  @media (min-width: ${breakpoints.largeTv}) {
    padding: 2rem;
    border-radius: 16px;
  }
`;


export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: ${breakpoints.desktop}) {
    flex-direction: column;
    align-items: flex-start;
  }
  @media (min-width: ${breakpoints.desktop}) {
    /* flex-direction: row; */
    /* align-items: flex-start; */
  }
`;

export const IconSection = styled.div`
  display: flex;
  min-width: 35px;
  margin-left: 10px;
  margin-top: 10px;
  color: #304EB0;

  @media (max-width: ${breakpoints.mobile}) {
    margin-left: 5px;
    margin-top: 5px;
    min-width: 25px;
  }
  @media (max-width: ${breakpoints.desktop}) {
   padding-bottom:0.5rem;
  }
  @media (min-width: ${breakpoints.tv}) {
    margin: 0px;
  img{
    width:65px;
    height:65px;
  }
  }
  @media (min-width: ${breakpoints.largeTv}) {
    margin: 0px;
  img{
    width:100px;
    height:100px;
  }
  }
`;

export const Divider = styled.div`
  position: absolute;             
  top: 0;
  bottom: 0;
  left: 60px;                    
  width: 3px;
  background: #3352ba;
  border-radius: 4px;

  /* ❌ Hide divider up to 1654px */
  @media (max-width: 1654px) {
    display: none;
  }

  /* ✅ Show and style again from 1655px+ */
  @media (min-width: 1655px) and (max-width: ${breakpoints.largeTv}) {
    display: block;

    width: 4px;
    left: 70px;
  }
@media (min-width: ${breakpoints.tv}) {
    display: block;
    margin-left: 20px;
    width: 4px;
    left: 80px;
  }
  /* 🖥️ 4K screens */
  @media (min-width: ${breakpoints.largeTv}) {
    display: block;
    margin-left: 65px;
    width: 5px;
    left: 80px;
  }
`;


export const CardContent = styled.div`
  flex: 1;
  padding: 1rem;
  width:100%;
  @media (max-width: ${breakpoints.mobile}) {
    padding: 0.5rem;
  }
  @media (max-width: ${breakpoints.desktop}) {
    padding: 0;
  }
  @media (min-width: ${breakpoints.largeTv}) {
    padding-inline: 2rem;
  }
`;

export const CardTitle = styled.h3`
  font-size: clamp(1rem, 1.2vw, 2.5rem);
  font-weight: 700;
  font-family: Satoshi, sans-serif;
  margin-left: 10px;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 0.9rem;
  }

  @media (min-width: ${breakpoints.tv}) {
    font-size: 2rem;
  }
  @media (min-width: ${breakpoints.largeTv}) {
    font-size: 3rem;
  }
`;

export const CardCount = styled.span`
  font-size: clamp(1rem, 1.5vw, 2.5rem);
  font-weight: bold;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.2rem;
  }

  @media (min-width: ${breakpoints.tv}) {
    font-size: 2rem;
  }
  @media (min-width: ${breakpoints.largeTv}) {
    font-size: 4rem;
  }
`;

export const CardList = styled.div`
  margin-top: 0.8rem;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const CardListItem = styled.div`
  display: grid;
  grid-template-columns: 30px 1fr 1fr 1fr;  
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 1rem;
  border-bottom: 1px solid #f0f0f0;
  opacity:0.8;

  &:last-child {
    border-bottom: none;
  }

  img {
    /* width: 28px;
    height: 28px; */
    border-radius: 50%;
    object-fit: cover;
  }

  /* 📱 Mobile */
  @media (min-width: 768px) and (max-width:1024px) {
    /* grid-template-columns: 30px 1fr; */
    padding: 0.3rem 0.5rem;
    gap: 0.3rem;

    /* img {
      width: 25px;
      height: 25px;
    } */
  }
 @media (min-width: 1025px)and (max-width:1440px) {
    grid-template-columns: 30px 1fr 1fr 1fr;
    padding: 0.3rem 1rem;

    img {
      width: 55px;
      height: 55px;
    }
  }
  /* 💻 Large screens */
  @media (min-width: 2560px)and (max-width:3859px) {
    grid-template-columns: 30px 1fr 1fr 1fr;
    padding: 0.8rem 1.5rem;

    img {
      width: 55px;
      height: 55px;
    }
  }
 @media (min-width: 3840px){
    grid-template-columns: 30px 150px 1fr 1fr;
    padding: 0.8rem 1.5rem;

    img {
      width: 55px;
      height: 55px;
    }
  }


`;


export const EmployeeAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ccc;

  @media (max-width: ${breakpoints.mobile}) {
    width: 24px;
    height: 24px;
  }
`;

export const EmployeeName = styled.span`
   font-weight: 600;
  color: #222;
  text-align: left;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;


  @media (min-width: 768px) and (max-width: 1023px) {
    font-size: 0.65rem;
  
  }

  @media (min-width: 1024px) and (max-width:1439px){
    font-size: 0.8rem;

  }
    @media (min-width: 1440px) and (max-width:1599px){
    font-size: 0.9rem;
  
  }

    @media (min-width: 1600px) and (max-width:1919px) {
    font-size: 1rem;

  }


  @media (min-width: 1920px) and (max-width:2559px) {
    font-size: 1.3rem;
    // padding: 0.5rem 1.2rem;
  }

  @media (min-width: 2560px) and (max-width:3839px) {
    font-size: 1.4rem;
    // padding: 0.75rem 1.5rem;
  }
 @media (min-width: 3840px) {
 color: #777;
  text-align: right;
  font-size: 2rem;
  white-space: nowrap;
  text-align: left;
  }
`;

export const EmployeeId = styled.div`
  color: #666;
  font-size: 0.75rem;

  @media (min-width: 768px) and (max-width:1023px) {
    display: none;
  }

  /* Small laptop */
  @media (min-width: 1024px) and (max-width:1439px) {
    font-size: 0.7rem;
    span {
      display: none;
    }

    &::before {
      content: attr(data-from) " ";
    }
  }

  @media (min-width: 1440px) and (max-width:1599px) {
    font-size: 0.7rem;
     span {
      display: none;
    }

    &::before {
      content: attr(data-from) " ";
    }
  }

  @media (min-width: 1600px) and (max-width:1919px) {
    font-size: 0.9rem;
     span {
      display: none;
    }

    &::before {
      content: attr(data-from) " ";
    }
  }

  @media (min-width: 1920px) and (max-width:2560px) {
    font-size: 1.1rem;
     span {
      display: none;
    }

    &::before {
      content: attr(data-from) " ";
    }
  }

  @media (min-width: 2561px) and (max-width:3840px) {
    font-size: 1.5rem;
     span {
      display: none;
    }

    &::before {
      content: attr(data-from) " ";
    }
  }

  @media (min-width: 3841px) {
    font-size: 1.9rem;
     span {
      display: none;
    }

    &::before {
      content: attr(data-from) " ";
    }
  }
`;


export const EmployeeDept = styled.span`
   color: #555;
  text-align: center;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  /* Tablets */
  @media (min-width: 768px) and (max-width:1023px) {
    font-size: 0.65rem;
  }

  /* Small laptop */
  @media (min-width: 1024px) and (max-width:1439px) {
    font-size: 0.7rem;
  }


  @media (min-width: 1440px) and (max-width:1599px) {
    font-size: 0.7rem;
  }

   @media (min-width: 1600px) and (max-width:1919px) {
    font-size: 0.9rem;
  }
  @media (min-width: 1920px) and ( max-width:2560px){
    font-size: 1.1rem;
  }
 @media (min-width: 2561px) and ( max-width:3840px){
    font-size: 1.5rem;
  }
  /* 4K screens (3840×2160) */
  @media (min-width: 3841px) {
    font-size: 1.9rem;
  }
`;

export const IconWrapper = styled.div`
  position: absolute;
  right: 0px;
  bottom: 10px;
  color: #3352BA;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.3);
    color: #3352BA;
  }

  /* 📱 Mobile */
  @media (max-width: ${breakpoints.mobile}) {
    bottom: 5px;
    right: 5px;
    font-size: 0.8rem; 
  }

  /* 📱 Tablet */
  @media (max-width: ${breakpoints.tablet}) {
    bottom: 8px;
    right: 9px;
    font-size: 1rem;
  }
  @media (max-width: 1430px) {
    bottom:0px;
    right: 8px;
    font-size: 1rem;
  }

  /* 🖥️ 2K */
  @media (min-width: ${breakpoints.tv}) {
    right: 0px;
    bottom: 0px;
    font-size: 1.5rem; /* bigger icon */
    svg{
      height: 30px;
      width: 30px;
    }
  }

  /* 🖥️ 4K */
  @media (min-width: ${breakpoints.largeTv}) {
    /* right: 20px;
    bottom: 20px; */
    font-size: 2rem;
    svg{
      height: 40px;
      width: 40px;
    }
    bottom:0;
  }
`;
