
// ======================= AttendanceDetails.jsx =======================
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

const formatTime = (datetimeStr) => {
  if (!datetimeStr) return "---";
  const date = new Date(datetimeStr.replace(" ", "T"));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const AttendanceDetails = ({ attendanceDetail, selectedDate, setSelectedDate }) => {
  const sessions = attendanceDetail?.sessions || [];

  // ✅ Today punch in/out from sessions
  const todayPunchIn = sessions.length ? formatTime(sessions[0]?.time_in) : "---";

  const todayPunchOut = sessions.length
    ? formatTime(sessions[sessions.length - 1]?.time_out)
    : "---";

  const weeklyHours = attendanceDetail?.weekly_hours_formatted || "00:00";
  const monthlyHours = attendanceDetail?.monthly_hours_formatted || "00:00";

  const cardList = [
    { title: "Today Punch In", value: todayPunchIn },
    { title: "Today Punch Out", value: todayPunchOut },
    { title: "Weekly Hours", value: weeklyHours },
    { title: "Monthly Hours", value: monthlyHours },
  ];

  return (
    <PageWrapper>
      <Header>Attendance Details</Header>

      {/* ✅ Summary cards */}
      <CardWrapper>
        {cardList.map((card, index) => (
          <Card key={index}>
            <CardTitle>{card.title}</CardTitle>
            <CardValue>{card.value}</CardValue>
          </Card>
        ))}
      </CardWrapper>

      {/* ✅ Previous attendance table */}
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
              onChange={(e) => setSelectedDate(e.target.value)}
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