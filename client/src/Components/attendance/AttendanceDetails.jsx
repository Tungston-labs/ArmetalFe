import React, { useState } from "react";
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
import { useEffect } from "react";
import { getAccessToken } from "../../hooks/useAccessToken";

const AttendanceDetails = ({
  cardList,
  sessions,
  selectedDate,
  onDateChange,
  formatTime,
  employeeId,
}) => {
  const [hourlyLocationData, setHourlyLocationData] = useState([]);

  const sessionEvents = sessions
    .flatMap((s) => {
      const events = [];

      if (s?.time_in) {
        events.push({
          time: s.time_in,
          action: "Punch In",
          location: s?.punch_in_location,
        });
      }

      if (s?.time_out) {
        events.push({
          time: s.time_out,
          action: "Punch Out",
          location: s?.punch_out_location,
        });
      }

      return events;
    })
    .sort((a, b) => new Date(b.time) - new Date(a.time));

  const backgroundEvents = (hourlyLocationData || []).map((item) => ({
    time: item?.logged_at,
    action: "Live Tracking",
    location: item?.location_name,
  }));
  const allEvents = [...sessionEvents, ...backgroundEvents]
    .filter((event) => event.time)
    .sort((a, b) => new Date(b.time) - new Date(a.time));

  useEffect(() => {



  const fetchEmployeeLocations = async () => {
  try {
    const token = await getAccessToken();

    console.log("Token:", token);

    if (!token) {
      console.log("No token found");
      return;
    }

    const formattedDate = new Date(selectedDate)
      .toISOString()
      .split("T")[0];

    const url = `https://api.rekory.com/api/background-location/${employeeId}/?date=${formattedDate}`;

    console.log("API URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", response.status);

    const json = await response.json();
    console.log("Response Data:", json);

    setHourlyLocationData(json?.results || []);
  } catch (err) {
    console.error("Error fetching location:", err);
  }
};

    fetchEmployeeLocations();
  }, [employeeId, selectedDate]);
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
              <Th>Time</Th>
              <Th>Action</Th>
              <Th>Location</Th>
            </tr>
          </thead>
          <tbody>
            {allEvents.length === 0 ? (
              <Tr>
                <Td colSpan={3} style={{ textAlign: "center", color: "#777" }}>
                  No sessions found
                </Td>
              </Tr>
            ) : (
              allEvents.map((event, index) => (
                <Tr key={index}>
                  <Td>{formatTime(event.time)}</Td>

                  <Td>
                    <span
                      style={{
                        color:
                          event.action === "Punch In"
                            ? "#2F822F"
                            : event.action === "Punch Out"
                              ? "#ED2B2B"
                              : "#2563EB",
                        fontWeight: 600,
                      }}
                    >
                      {event.action}
                    </span>
                  </Td>

                  <Td>{event.location || "---"}</Td>
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
