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

const ActivityLogModal = ({ data = [], date, onClose, liveLocation }) => {
  
  // --- Existing Date Parsing ---
  const parsedDate = useMemo(() => {
    if (!date) return null;
    const normalized = date.includes("T") ? date : date.replace(" ", "T");
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? null : d;
  }, [date]);

  // --- 1. Format Existing Log Data ---
  const existingFormattedLocations = useMemo(() => {
    return data.map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      // Assuming 'item.location' holds the location name from the punch-in
      location: item.location || "No location info",
      isLive: false, // Flag to differentiate the row
    }));
  }, [data]);

  // --- 2. Combine Live Location with Log Data ---
  const finalFormattedData = useMemo(() => {
    if (!liveLocation || !liveLocation.timestamp) {
      // If no live data, return only the historical logs
      return existingFormattedLocations;
    }

    // Create the live entry object
    const liveEntry = {
      time: new Date(liveLocation.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }) + " (LIVE)", // Clearly mark the time as live
      
      // Use the resolved location name provided by the server
      location: liveLocation.location_name || // Assuming the backend sends location_name
                `Lat: ${liveLocation.latitude?.toFixed(6)}, Lon: ${liveLocation.longitude?.toFixed(6)}`,
      
      isLive: true,
      coordinates: `Lat: ${liveLocation.latitude?.toFixed(6)}, Lon: ${liveLocation.longitude?.toFixed(6)}`
    };

    // Prepend the live entry to the array for the table
    return [liveEntry, ...existingFormattedLocations];
  }, [liveLocation, existingFormattedLocations]); // Depend on liveLocation updates

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
        
        {/* ❌ REMOVED THE SEPARATE LIVE LOCATION DIV */}
        
        {parsedDate ? (
          <ModalDate>
            {/* ... Date details remain the same ... */}
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

          {finalFormattedData.length > 0 ? (
            finalFormattedData.map((item, index) => (
              // 3. Render the combined data, highlighting the live row
              <TableRow 
                key={item.time + index} // Use a unique key
                even={!item.isLive && index % 2 === 0} // Only apply striping to non-live rows
                style={item.isLive ? { backgroundColor: '#e6ffe6', fontWeight: 'bold' } : {}} // Highlight live row
              >
                <TableCell>{item.time}</TableCell>
                <TableCell 
                    // Show coordinates as a tooltip for live data
                    title={item.isLive ? item.coordinates : null} 
                    style={item.isLive ? { color: 'green' } : {}}
                >
                  {item.location}
                </TableCell>
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