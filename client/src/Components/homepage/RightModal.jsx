
import React from "react";
import { Panel, CloseIcon, Columns } from "./RightModal.Styles";
import AttendanceCircle from "./AttendanceCircle";
import SingleHolidayCalendar from "./SingleHolidayCalendar.jsx";
import Notifications from "./Notifications.jsx";


const RightModal = ({ open, onClose }) => {
  const holidays = [
    { name: "Republic Day", date: "2025-01-26" },
    { name: "Holi", date: "2025-03-14" },
    { name: "Independence Day", date: "2025-08-15" },
    { name: "Diwali", date: "2025-10-20" },
    { name: "Christmas", date: "2025-12-25" }
  ];

  return (
    <Panel className={open ? "open" : ""}>
      <CloseIcon onClick={onClose}>×</CloseIcon>
       <Columns>
        <Notifications />
            </Columns>
          <Columns>
           <AttendanceCircle present={70} leave={30} />
             </Columns>
 
     <Columns>
      <SingleHolidayCalendar holidays={holidays} />
  </Columns>
    
    </Panel>
  );
};

export default RightModal;
