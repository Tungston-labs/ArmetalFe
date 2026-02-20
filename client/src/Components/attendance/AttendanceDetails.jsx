import React from "react";
import {
  PageWrapper,
  Header,
  CardWrapper,
  Card,
  CardTitle,
  CardValue,
  HistoryTable,
  Table,
  Th,
  Td,
  Tr,
  CalendarWrapper,
} from "./AttendanceDetails.Styles";

const AttendanceDetails = ({
  cardList,
  sessions,
  selectedDate,
  onDateChange,
  formatTime,
}) => {
  return (
    <PageWrapper>
      <Header>Attendance Details</Header>
      <CardWrapper>
        {cardList.map((card, index) => (
          <Card key={index}>
            <CardTitle>{card.title}</CardTitle>
            <CardValue>{card.value}</CardValue>
          </Card>
        ))}
      </CardWrapper>
      <HistoryTable>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <Header>Sessions</Header>
          <CalendarWrapper>
            <input
              type="date"
              value={selectedDate}
              onChange={onDateChange}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </CalendarWrapper>
        </div>
        <Table>
          <thead>
            <tr>
              <Th>Punch In</Th>
              <Th>Punch Out</Th>
              <Th>Location</Th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <Tr>
                <Td colSpan={3} style={{ textAlign: "center", color: "#777" }}>
                  No sessions found
                </Td>
              </Tr>
            ) : (
              sessions.map((s, index) => (
                <Tr key={index}>
                  <Td>{formatTime(s?.time_in)}</Td>
                  <Td>{formatTime(s?.time_out)}</Td>
                  <Td>{s?.punch_in_location || "---"}</Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
      </HistoryTable>
    </PageWrapper>
  );
};

export default AttendanceDetails;