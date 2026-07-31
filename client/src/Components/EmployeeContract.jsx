// import React from "react";
// import {
//   Container,
//   Card,
//   Title,
//   DonutWrapper,
//   DonutText,
//   Legend,
//   LegendItem,
//   Table,
//   TableRow,
//   TableHeader,
//   TableCell,
//   HolidaysList,
//   HolidayItem,
//   HolidayIcon,
//   HolidayInfo,
//   HolidayDate
// } from "./EmployeeContract.Styles";

// const DashboardNew = () => {
//   const employees = [
//     { name: "Desirae Westervelt", id: "1254125", email: "Ajaykumar@gmail.com" },
//     { name: "Desirae Westervelt", id: "1254125", email: "Ajaykumar@gmail.com" },
//     { name: "Desirae Westervelt", id: "1254125", email: "Ajaykumar@gmail.com" },
//     { name: "Desirae Westervelt", id: "1254125", email: "Ajaykumar@gmail.com" },
//   ];

//   const holidays = [
//     { title: "Dummy holiday", subtitle: "Dummy holiday", date: "24 October" },
//     { title: "Dummy holiday", subtitle: "Dummy holiday", date: "24 October" },
//     { title: "Dummy holiday", subtitle: "Dummy holiday", date: "24 October" },
//     { title: "Dummy holiday", subtitle: "Dummy holiday", date: "24 October" },
//   ];

//   return (
//     <Container>
//       {/* Employee Stats */}
//       <Card>
//         <DonutWrapper>
//           <svg width="150" height="150" viewBox="0 0 36 36">
//             <path
//               d="M18 2.0845
//                  a 15.9155 15.9155 0 0 1 0 31.831
//                  a 15.9155 15.9155 0 0 1 0 -31.831"
//               fill="none"
//               stroke="#3352BA"
//               strokeWidth="3"
//               strokeDasharray="75, 100"
//             />
//             <path
//               d="M18 2.0845
//                  a 15.9155 15.9155 0 0 1 0 31.831
//                  a 15.9155 15.9155 0 0 1 0 -31.831"
//               fill="none"
//               stroke="#FF6B6B"
//               strokeWidth="3"
//               strokeDasharray="25, 100"
//               strokeDashoffset="-75"
//             />
//           </svg>
//           <DonutText>
//             <h2>251</h2>
//             <p>Total Employees</p>
//           </DonutText>
//         </DonutWrapper>
//         <Legend>
//           <LegendItem color="#3352BA">Active Employees</LegendItem>
//           <LegendItem color="#FF6B6B">On Leave Today</LegendItem>
//         </Legend>
//       </Card>

//       {/* Employee Contract Expiry */}
//       <Card>
//         <Title>
//           Employee Contract Expiry <span>↗</span>
//         </Title>
//         <Table>
//           <thead>
//             <TableRow>
//               <TableHeader>Name</TableHeader>
//               <TableHeader>ID</TableHeader>
//               <TableHeader>Email</TableHeader>
//             </TableRow>
//           </thead>
//           <tbody>
//             {employees.map((emp, index) => (
//               <TableRow key={index}>
//                 <TableCell>{emp.name}</TableCell>
//                 <TableCell>{emp.id}</TableCell>
//                 <TableCell>{emp.email}</TableCell>
//               </TableRow>
//             ))}
//           </tbody>
//         </Table>
//       </Card>

//       {/* Upcoming Holidays */}
//       <Card>
//         <Title>
//           Upcoming Holidays <span>↗</span>
//         </Title>
//         <HolidaysList>
//           {holidays.map((holiday, index) => (
//             <HolidayItem key={index}>
//               <HolidayIcon>📅</HolidayIcon>
//               <HolidayInfo>
//                 <h4>{holiday.title}</h4>
//                 <p>{holiday.subtitle}</p>
//               </HolidayInfo>
//               <HolidayDate>{holiday.date}</HolidayDate>
//             </HolidayItem>
//           ))}
//         </HolidaysList>
//       </Card>
//     </Container>
//   );
// };

// export default DashboardNew;
