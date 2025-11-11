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

const ActivityLogModal = ({ data = [], date, onClose, liveLocationData = [] }) => {
  const parsedDate = useMemo(() => {
    if (!date) return null;
    const normalized = date.includes("T") ? date : date.replace(" ", "T");
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? null : d;
  }, [date]);

  // Format historical logs
  const formattedLogs = useMemo(() => {
    return data.map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      location: item.location_name || "Location Unknown",
      isLive: false,
      timestamp: item.timestamp,
    }));
  }, [data]);

  // Format live locations (array)
  const formattedLive = useMemo(() => {
    if (!Array.isArray(liveLocationData)) return [];

    return liveLocationData.map((loc) => ({
      time:
        new Date(loc.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }) + " (LIVE)",
      location:
        loc.location_name ||
        `Lat: ${loc.latitude?.toFixed(5)}, Lon: ${loc.longitude?.toFixed(5)}`,
      isLive: true,
      timestamp: loc.timestamp,
    }));
  }, [liveLocationData]);

  // Merge both — live first
  const allLocations = useMemo(() => [...formattedLive, ...formattedLogs], [
    formattedLive,
    formattedLogs,
  ]);

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
