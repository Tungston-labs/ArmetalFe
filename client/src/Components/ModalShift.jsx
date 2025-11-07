import React, { useEffect, useMemo, useRef, useState } from "react";
import Calendar from "react-calendar";
import { FaCalendarAlt } from "react-icons/fa"; // calendar icon
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
  CalendarIconWrapper,
} from "./ModalShift.styled.js";

const ActivityLogModal = ({
  data = [],
  date,
  onClose,
  hourlyLocationData = [],
  liveLocationData = [],
  onDateChange, 
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef(null);

  const parsedDate = useMemo(() => {
    if (!date) return null;
    const normalized = date.includes("T") ? date : date.replace(" ", "T");
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? null : d;
  }, [date]);

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

  const allLocations = useMemo(() => {
    const merged = [...formattedLive, ...formattedLogs];
    return merged.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    ); // sort latest → oldest
  }, [formattedLive, formattedLogs]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setCalendarOpen(false);
      }
    };

    if (calendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarOpen]);
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

        {parsedDate && (
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


            <CalendarIconWrapper onClick={() => setCalendarOpen(!calendarOpen)}>
              <FaCalendarAlt size={18} />
            </CalendarIconWrapper>

            {calendarOpen && (
              <div ref={calendarRef} style={{ position: "absolute", zIndex: 100, marginTop: 96 }}>
                <Calendar
                  onChange={(newDate) => {
                    setCalendarOpen(false);
                    onDateChange(newDate.toLocaleDateString("en-CA"));
                  }}
                  value={parsedDate}
                />
              </div>
            )}
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
