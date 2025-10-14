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

const ActivityLogModal = ({ data = [], date, onClose }) => {
  const parsedDate = useMemo(() => {
    if (!date) return null;
    const normalized = date.includes("T") ? date : date.replace(" ", "T");
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? null : d;
  }, [date]);

  const formattedLocations = useMemo(() => {
    return data.map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      location: item.location || "No location info",
    }));
  }, [data]);

  // ✅ Handle outside clicks
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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

          {formattedLocations.length > 0 ? (
            formattedLocations.map((item, index) => (
              <TableRow key={index} even={index % 2 === 0}>
                <TableCell>{item.time}</TableCell>
                <TableCell>{item.location}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={2}
                style={{ textAlign: "center", color: "#777" }}
              >
                No hourly locations found.
              </TableCell>
            </TableRow>
          )}
        </Table>
      </ModalWrapper>
    </Overlay>
  );
};

export default ActivityLogModal;
