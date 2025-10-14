import React from "react";
import {
  TableContainer,
  TableHeader,
  TableRow,
  TableCell,
  LocationBox,
  LocationText,
  TableBoarder,
  TimeBoxWrapper,
  TimeIn,
  TimeOut,
  TimeSeparator,
} from "./TimeTable.Styles";
import { ImLocation2 } from "react-icons/im";
const TimeTable = ({ data = [] }) => {
  if (!data.length) {
    return (
      <p style={{ textAlign: "center", padding: "20px" }}>
        No field sessions found.
      </p>
    );
  }

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
              <TimeSeparator>to</TimeSeparator>
              <TimeOut>{item.timeOut}</TimeOut>
            </TimeBoxWrapper>
          </TableBoarder>

          <TableCell>
            <TableBoarder>
              <LocationBox>
                <ImLocation2 />
                <LocationText>{item.location}</LocationText>
                {item.note && (
                  <p style={{ marginTop: "4px", color: "#555" }}>{item.note}</p>
                )}
              </LocationBox>
            </TableBoarder>
          </TableCell>
        </TableRow>
      ))}
    </TableContainer>
  );
};

export default TimeTable;
