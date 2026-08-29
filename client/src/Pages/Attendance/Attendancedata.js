
export const attendanceColumns = [
   {
    header: "Sl No",
    accessor: "slNo",
  },
  {
    header: "Employee Name",
    accessor: "name",
  },
  {
    header: "Department",
    accessor: "employeeId",
  },

  {
    header: "Check In",
    accessor: "firstSwipeIn",
  },
  {
    header: "Check Out",
    accessor: "lastSwipeOut",
  },
  {
    header: "Working Hours",
    accessor: "totalHours",
  },
  {
    header: "Status",
    accessor: "attendanceToday",
  },
];


// export const attendanceDummyData = [
//   {
//     id: 18,
//     name: "test emp",
//     employeeId: "test12@gmail.com",
//     date: "2026-08-29",
//     firstSwipeIn: "03:20 PM",
//     lastSwipeOut: "03:25 PM",
//     totalHours: "00:05",
//     attendanceToday: true,
//   },
//   {
//     id: 2,
//     name: "DUMMY002",
//     employeeId: "abc2002@yopmail.com",
//     date: null,
//     firstSwipeIn: "--",
//     lastSwipeOut: "--",
//     totalHours: "00:00",
//     attendanceToday: false,
//   },
// ];