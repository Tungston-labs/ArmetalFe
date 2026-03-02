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

//   const todayPunchIn = attendanceDetail?.today_first_punch_in
//   ? formatTime(attendanceDetail.today_first_punch_in)
//   : "---";

// const todayPunchOut = attendanceDetail?.today_last_punch_out
//   ? formatTime(attendanceDetail.today_last_punch_out)
//   : "---";
  const weeklyHours =
    attendanceDetail?.weekly_hours_formatted || "00:00";

  const monthlyHours =
    attendanceDetail?.monthly_hours_formatted || "00:00";

  const cardList = [
    // { title: "Today Punch In", value: todayPunchIn },
    // { title: "Today Punch Out", value: todayPunchOut },
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