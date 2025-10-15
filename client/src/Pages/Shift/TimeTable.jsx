import React from "react";
import {
  TableContainer,
  TableHeader,
  TableRow,
  TimeSection,
  LocationSection,
} from "./TimeTable.Styles";
import { ImLocation2 } from "react-icons/im";

const formatTo12Hour = (timeString) => {
  if (!timeString || timeString === "null" || timeString === "undefined") return "---";

  // Try to parse safely
  const date = new Date(`1970-01-01T${timeString}`);
  if (isNaN(date.getTime())) return "---"; // invalid date
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  // ensure two digits for hour and minute
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};


const TimeTable = ({ data = [] }) => {
  if (!data.length) {
    return <p style={{ textAlign: "center", padding: "20px" }}>No field sessions found.</p>;
  }

  return (
    <TableContainer>
      <TableHeader>
        <div className="time-section">
          <div className="time-box">
            <span>Time In</span>
            <span>Time Out</span>
          </div>
        </div>
        <div className="location-section">
          <div>
            Location <ImLocation2 style={{ marginLeft: "5px" }} />
          </div>
        </div>
      </TableHeader>

      {data.map((item, index) => (
        <TableRow key={index}>
          <TableBoarder>
            <TimeBoxWrapper>
              <TimeIn>{formatTo12Hour(item.timeIn)}</TimeIn>
              <TimeSeparator>to</TimeSeparator>
              <TimeOut>{formatTo12Hour(item.timeOut)}</TimeOut>
            </TimeBoxWrapper>
          </TableBoarder>




          <LocationSection>
            <ImLocation2 />
            <div>
              <p>{item.location}</p>
              {item.note && <p className="note">{item.note}</p>}
            </div>
          </LocationSection>
        </TableRow>
      ))}
    </TableContainer>
  );
};

export default TimeTable;
