import React from "react";
import { ImLocation2 } from "react-icons/im";
import {
  TableContainer,
  TableHeader,
  TableRow,
  TimeSection,
  LocationSection,
} from "./TimeTable.Styles";

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
       <TimeSection>
  <div className="time-in">{item.timeIn}</div>
  <div className="time-separator">
    <span></span>
    <span className="to-text">To</span>
    <span></span>
  </div>
  <div className="time-out">{item.timeOut}</div>
</TimeSection>




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
