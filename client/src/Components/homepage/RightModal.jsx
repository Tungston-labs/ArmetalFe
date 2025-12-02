import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Panel, CloseIcon, Columns, BottomActions, ActionButton, LogoutButton } from "./RightModal.Styles";
import AttendanceCircle from "./AttendanceCircle";
import SingleHolidayCalendar from "./SingleHolidayCalendar.jsx";
import Notifications from "./Notifications";
import {
  getHolidaySummary,
  getTodayEmployeeStats,
  getSimpleNotifications,
} from "../../Redux/dashboardSlice";

const RightModal = ({ open, onClose }) => {
  const dispatch = useDispatch();

  const { notifications, todayStats, holidaySummary, loading } = useSelector(
    (state) => state.dashboard
  );

  // Load APIs only when modal opens
  useEffect(() => {
    if (open) {
      dispatch(getSimpleNotifications());
      dispatch(getTodayEmployeeStats());
      dispatch(getHolidaySummary());
    }
  }, [open, dispatch]);

  return (
    <Panel className={open ? "open" : ""}>
      <CloseIcon onClick={onClose}>×</CloseIcon>
      <Columns>
        {loading.notifications ? (
          <p>Loading notifications...</p>
        ) : (
          <Notifications items={notifications?.notifications || []} />
        )}
      </Columns>
      <Columns>
        {loading.todayStats ? (
          <p>Loading attendance...</p>
        ) : todayStats ? (
          <AttendanceCircle
          present={todayStats?.present_percentage}
          leave={todayStats?.leave_percentage}
        />
        
        ) : (
          <p>No stats found</p>
        )}
      </Columns>
      <Columns>
        {loading.holidaySummary ? (
          <p>Loading holidays...</p>
        ) : holidaySummary ? (
          <SingleHolidayCalendar
            holidays={holidaySummary?.upcoming_holidays || []}
          />
        ) : (
          <p>No holidays found</p>
        )}
      </Columns>
      <BottomActions>
  <ActionButton onClick={() => console.log("Change password clicked")}>
    Change Password
  </ActionButton>
  <LogoutButton onClick={() => console.log("Logout clicked")}>
    Logout
  </LogoutButton>
</BottomActions>

    </Panel>
  );
};

export default RightModal;
