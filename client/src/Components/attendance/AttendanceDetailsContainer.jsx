import React from "react";
import AttendanceDetails from "./AttendanceDetails";

const formatTime = (datetimeStr) => {
  if (!datetimeStr) return "---";

  const date = new Date(datetimeStr.replace(" ", "T"));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const AttendanceDetailsContainer = ({
  attendanceDetail,
  selectedDate,
  setSelectedDate,
}) => {
  const sessions = attendanceDetail?.sessions || [];


  const weeklyHours =
    attendanceDetail?.weekly_hours_formatted || "00:00";

  const monthlyHours =
    attendanceDetail?.monthly_hours_formatted || "00:00";

  const cardList = [
    
    { title: "Weekly Hours", value: weeklyHours },
    { title: "Monthly Hours", value: monthlyHours },
  ];

  return (
    <AttendanceDetails
      cardList={cardList}
      sessions={sessions}
      selectedDate={selectedDate}
      onDateChange={(e) => setSelectedDate(e.target.value)}
      formatTime={formatTime}
    />
  );
};

export default AttendanceDetailsContainer;