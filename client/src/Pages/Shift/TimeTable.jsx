import React from "react";
import {
  TableContainer,
  TableHeader,
  TableRow,
  TableCell,
  TimeBox,
//   TimeText,
  LocationBox,
  LocationText,
  TableBoarder,
  TimeBoxWrapper,
  Line,
  TimeIn,
  TimeOut
} from "./TimeTable.Styles";


const data = [
  {
    timeIn: "08:30 AM",
    timeOut: "11:30 AM",
    location: "Lorem ipsum dolor sit amet consectetur. Nisi sodales sedfgghvfghfh tgfuygvyuhguykbfj ............",
  },
  {
    timeIn: "08:30 AM",
    timeOut: "11:30 AM",
location: "Lorem ipsum dolor sit amet consectetur. Nisi sodales sedfgghvfghfh tgfuygvyuhguykbfj ............",
  },
  {
    timeIn: "08:30 AM",
    timeOut: "11:30 AM",
location: "Lorem ipsum dolor sit amet consectetur. Nisi sodales sedfgghvfghfh tgfuygvyuhguykbfj ............",
  },
  {
    timeIn: "08:30 AM",
    timeOut: "11:30 AM",
location: "Lorem ipsum dolor sit amet consectetur. Nisi sodales sedfgghvfghfh tgfuygvyuhguykbfj ............",
  },
  {
    timeIn: "08:30 AM",
    timeOut: "11:30 AM",
location: "Lorem ipsum dolor sit amet consectetur. Nisi sodales sedfgghvfghfh tgfuygvyuhguykbfj ............",
  },
];

const TimeTable = () => {
  return (
    <TableContainer>
      <TableHeader>
        <div>Time In</div>
        <div>Time Out</div>
        <div>Location</div>
      </TableHeader>

      {data.map((item, index) => (
     <TableRow key={index}>
  <TableBoarder>
    <TimeBoxWrapper>
      <TimeIn>{item.timeIn}</TimeIn>
      ------------------------------To------------------------------
      {/* <Line /> */}
      <TimeOut>{item.timeOut}</TimeOut>
    </TimeBoxWrapper>
  </TableBoarder>

  <TableCell>
      <TableBoarder>
    <LocationBox>
      <span role="img" aria-label="location">📍</span>
      <LocationText>{item.location}</LocationText>
    </LocationBox>
    </TableBoarder>
  </TableCell>
</TableRow>

      ))}
    </TableContainer>
  );
};

export default TimeTable;
