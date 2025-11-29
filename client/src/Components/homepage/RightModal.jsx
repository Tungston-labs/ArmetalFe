import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Panel, CloseIcon, Columns } from "./RightModal.Styles";
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

      {/* NOTIFICATIONS SECTION */}
      <Columns>
        {loading.notifications ? (
          <p>Loading notifications...</p>
        ) : (
          <Notifications items={notifications?.notifications || []} />
        )}
      </Columns>

      {/* TODAY STATS SECTION */}
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

      {/* HOLIDAY SUMMARY SECTION */}
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
    </Panel>
  );
};

export default RightModal;
