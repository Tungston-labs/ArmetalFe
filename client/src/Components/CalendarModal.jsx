// import React, { useEffect, useRef } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";

// const CalendarModal = ({ onClose, selectedDate, setSelectedDate }) => {
//   const modalRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         onClose(); 
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [onClose]);

//   return (
//     <div
//       ref={modalRef}
//       style={{
//         background: "#fff",
//         padding: "16px",
//         borderRadius: "12px",
//         boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
//         zIndex: 1000,
//       }}
//     >
//       <Calendar
//         onChange={(date) => {
//           const formatted = date.toLocaleDateString("en-CA");
//           setSelectedDate(formatted);
//           onClose();
//         }}
//         value={new Date(selectedDate)}
//       />
//     </div>
//   );
// };

// export default CalendarModal;
