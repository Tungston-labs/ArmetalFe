import React from "react";
import {
  NotificationWrapper,
  NotificationTitle,
  NotificationItem,
  NotificationText,
  NotificationTime,
  NoNotification
} from "./Notifications.styles";

const notifications = [
  { id: 1, text: "Leave request pending approval", time: "2h ago", type: "warning" },
  { id: 2, text: "New employee added: Jane Doe", time: "1d ago", type: "success" },
  { id: 3, text: "Payroll processing failed", time: "3h ago", type: "error" },
  { id: 4, text: "Payroll processing failed", time: "3h ago", type: "success" },
  { id: 5, text: "Payroll processing failed", time: "3h ago", type: "warning" },
];

const Notifications = () => {
  return (
    <NotificationWrapper>
      <NotificationTitle>Notifications</NotificationTitle>

      {notifications.length === 0 ? (
        <NoNotification>No notifications available</NoNotification>
      ) : (
        notifications.map((note) => (
          <NotificationItem key={note.id} type={note.type}>
            <NotificationText>{note.text}</NotificationText>
            <NotificationTime>{note.time}</NotificationTime>
          </NotificationItem>
        ))
      )}
    </NotificationWrapper>
  );
};

export default Notifications;
