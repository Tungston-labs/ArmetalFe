// import React from "react";
// import {
//   Container,
//   SectionTitle,
//   DeptWrapper,
//   DeptCard,
//   PresenceWrapper,
//   ChartCard,
//   ContractCard,
// } from "./ContractExpiryList.Styles";

// const ContractExpiryList = () => {
//   return (
//     <Container>
//       {/* Department Section */}
//       <SectionTitle>Department</SectionTitle>

//       <DeptWrapper>
//         <DeptCard>
//           <div className="bigLetter">D</div>
//           <div className="info">
//             <h3>Developers</h3>
//             <p>Department head</p>
//             <div className="headRow">
//               <img src="https://i.pravatar.cc/40" alt="" />
//               <span>Dummy</span>
//             </div>
//           </div>
//           <span className="count">12</span>
//         </DeptCard>

//         <DeptCard>
//           <div className="bigLetter">G</div>
//           <div className="info">
//             <h3>Graphic designer</h3>
//             <p>Department head</p>
//             <div className="headRow">
//               <img src="https://i.pravatar.cc/41" alt="" />
//               <span>Dummy</span>
//             </div>
//           </div>
//           <span className="count">12</span>
//         </DeptCard>

//         <DeptCard>
//           <div className="bigLetter">U</div>
//           <div className="info">
//             <h3>UI/UX Designer</h3>
//             <p>Department head</p>
//             <div className="headRow">
//               <img src="https://i.pravatar.cc/42" alt="" />
//               <span>Dummy</span>
//             </div>
//           </div>
//           <span className="count">12</span>
//         </DeptCard>

        
//       </DeptWrapper>

//       {/* Employee Presence */}
//       <SectionTitle>Employee Presence & Upcoming Holidays</SectionTitle>

//       <PresenceWrapper>
//         {/* Donut Chart Card */}
//         <ChartCard>
//           <div className="donut">
//             <div className="bluePart"></div>
//             <div className="redPart"></div>
//           </div>

//           <h1 className="total">251</h1>
//           <p className="totalText">Total Employees</p>

//           <div className="legend">
//             <div className="row">
//               <span className="dot blue"></span> Active Employees
//             </div>
//             <div className="row">
//               <span className="dot red"></span> On Leave Today
//             </div>
//           </div>
//         </ChartCard>

//         {/* Contract Expiry List */}
//         <ContractCard>
//           <h3>Employee Contract Expiry</h3>

//           <div className="list">
//             {Array(5)
//               .fill(0)
//               .map((_, i) => (
//                 <div className="item" key={i}>
//                   <img src={`https://i.pravatar.cc/3${i}`} alt="" />
//                   <span className="name">Employee</span>
//                   <span className="id">1254125</span>
//                   <span className="email">dummy@gmail.com</span>
//                 </div>
//               ))}
//           </div>
//         </ContractCard>
//       </PresenceWrapper>
//     </Container>
//   );
// };

// export default ContractExpiryList;
