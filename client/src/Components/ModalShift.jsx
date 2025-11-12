import React, { useMemo } from "react";
import {
  Overlay,
  ModalWrapper,
  ModalHeader,
  CloseBtn,
  ModalDate,
  Table,
  TableHeader,
  TableRow,
  TableCell,
} from "./ModalShift.styled.js";

const ActivityLogModal = ({ data = [], date, onClose,  hourlyLocationData = [],
 liveLocationData = [] }) => {
  const parsedDate = useMemo(() => {
    if (!date) return null;
    const normalized = date.includes("T") ? date : date.replace(" ", "T");
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? null : d;
  }, [date]);

  // Format historical logs
// Format periodic (HTTP) logs
const formattedLogs = useMemo(() => {
  if (!Array.isArray(hourlyLocationData)) return [];
  return hourlyLocationData.map((item) => ({
    time: new Date(item.logged_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    location:
      item.location_name ||
      `Lat: ${item.latitude?.toFixed(5)}, Lon: ${item.longitude?.toFixed(5)}`,
    isLive: false,
    timestamp: item.logged_at,
  }));
}, [hourlyLocationData]);


  // Format live locations (array)
const formattedLive = useMemo(() => {
  if (!Array.isArray(liveLocationData)) return [];
  return liveLocationData.map((loc) => ({
    time:
      new Date(loc.timestamp || loc.logged_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }) + " (LIVE)",
    location:
      loc.location_name ||
      `Lat: ${loc.latitude?.toFixed(5)}, Lon: ${loc.longitude?.toFixed(5)}`,
    isLive: true,
    timestamp: loc.timestamp || loc.logged_at,
  }));
}, [liveLocationData]);

const filteredLive = formattedLive.filter(
  (loc, index, self) =>
    index === self.findIndex((l) => l.timestamp === loc.timestamp)
);
  // Merge both — live first
 const allLocations = useMemo(() => {
  const merged = [...formattedLive, ...formattedLogs];
  return merged.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  ); // sort latest → oldest
}, [formattedLive, formattedLogs]);


  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>Hourly Activity Log</h3>
          <CloseBtn onClick={onClose}>Close</CloseBtn>
        </ModalHeader>

        {parsedDate ? (
          <ModalDate>
            <div className="day">{parsedDate.getDate()}</div>
            <div className="month-week">
              <div className="month">
                {parsedDate.toLocaleString("default", { month: "long" })}
              </div>
              <div className="weekday">
                {parsedDate.toLocaleDateString("default", { weekday: "long" })}
              </div>
            </div>
          </ModalDate>
        ) : (
          <ModalDate>
            <div>--</div>
            <div>Invalid Date</div>
          </ModalDate>
        )}

        <Table>
          <TableHeader>
            <TableCell>Time</TableCell>
            <TableCell>Location</TableCell>
          </TableHeader>

          {allLocations.length > 0 ? (
            allLocations.map((item, index) => (
              <TableRow
                key={item.timestamp || index}
                even={index % 2 === 0}
                style={
                  item.isLive
                    ? { backgroundColor: "#e6ffe6", fontWeight: "bold" }
                    : {}
                }
              >
                <TableCell>{item.time}</TableCell>
                <TableCell>{item.location}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} style={{ textAlign: "center", color: "#777" }}>
                No location data available.
              </TableCell>
            </TableRow>
          )}
        </Table>
      </ModalWrapper>
    </Overlay>
  );
};

export default ActivityLogModal;
