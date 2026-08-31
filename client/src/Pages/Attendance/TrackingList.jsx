import React, { useState, useEffect } from "react";
import {
  PageWrapper,
  Header,
  CardWrapper,
  Card,
  CardTitle,
  CardValue,
  HistoryTable,
  CalendarWrapper,
} from "../../Components/attendance/AttendanceDetails.Styles";
import { getAccessToken } from "../../hooks/useAccessToken";
import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";

const ACTION_COLORS = {
  "Punch In": "#2F822F",
  "Punch Out": "#ED2B2B",
  "Live Tracking": "#2563EB",
};

const TrackingList = ({
  cardList = [],
  sessions = [],
  selectedDate,
  onDateChange,
  formatTime,
  employeeId,
}) => {
  const [hourlyLocationData, setHourlyLocationData] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

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
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    // ReusableTable keys rows by `id`, so give each event a stable synthetic id
    .map((event, index) => ({ ...event, id: `${event.action}-${event.time}-${index}` }));

  useEffect(() => {
    // Guard: don't attempt to fetch without an employee/date context yet
    if (!employeeId || !selectedDate) return;

    const fetchEmployeeLocations = async () => {
      setLoadingLocations(true);
      try {
        const token = await getAccessToken();

        if (!token) {
          console.log("No token found");
          return;
        }

        const formattedDate = new Date(selectedDate)
          .toISOString()
          .split("T")[0];

        const url = `https://api.rekory.com/api/background-location/${employeeId}/?date=${formattedDate}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const json = await response.json();
        setHourlyLocationData(json?.results || []);
      } catch (err) {
        console.error("Error fetching location:", err);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchEmployeeLocations();
  }, [employeeId, selectedDate]);

  const eventColumns = [
    {
      header: "Time",
      accessor: "time",
      render: (row) => formatTime(row.time),
    },
    {
      header: "Action",
      accessor: "action",
      render: (row) => (
        <span
          style={{
            color: ACTION_COLORS[row.action] || "#333",
            fontWeight: 500,
          }}
        >
          {row.action}
        </span>
      ),
    },
    {
      header: "Location",
      accessor: "location",
      render: (row) => row.location || "---",
    },
  ];

  return (
    <PageWrapper>
     <ReusableHeader
                title="Employees"
                breadcrumbs={["Employees","Live Tracking"]}
               showBack
            />
      <CardWrapper>
        {cardList.map((card, index) => (
          <Card key={index}>
            <CardTitle>{card.title}</CardTitle>
            <CardValue>{card.value}</CardValue>
          </Card>
        ))}
      </CardWrapper>

      <HistoryTable>
        <div style={{ marginBottom: "15px" }}>
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

        <ReusableTable
          columns={eventColumns}
          data={allEvents}
          loading={loadingLocations}
        />
      </HistoryTable>
    </PageWrapper>
  );
};

export default TrackingList;