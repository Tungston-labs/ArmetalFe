import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopBar from "../../Components/HrDashboard/TopBar/TopBar";
import WelcomeBanner from "../../Components/HrDashboard/WelcomeBanner/WelcomeBanner";
import StatsGrid from "../../Components/HrDashboard/StatCard/StatsGrid";

import {
  DashboardWrapper,
  DashboardContainer,
  DashboardContent,
  StatsSection,
  BottomGrid,
  TopGrid,
} from "./HrDashboard.styles";

import {
  getDashboardStats,
  payrollData,
  getReimbursementData,
  getResourceAllocationData,
  gosiData,
  engagementData,
} from "./HrDashboardData";

import PayrollChart from "../../Components/HrDashboard/PayrollChart/PayrollChart";
import ReimbursementChart from "../../Components/HrDashboard/ReimbursementChart/ReimbursementChart";
import ResourceAllocation from "../../Components/HrDashboard/ResourceAllocation/ResourceAllocation";
import GosiCard from "../../Components/HrDashboard/GosiCard/GosiCard";
import EngagementCard from "../../Components/HrDashboard/EngagementCard/EngagementCard";
import AttendanceTrend from "../../Components/HrDashboard/AttendanceTrend/AttendanceTrend";

import {
  getDashboardCounts,
  getTodayEmployeeStats,
  getProjectEmployeeCount,
  getWeeklyAttendanceStats,
    getReimbursementCounts,
} from "../../Redux/dashboardSlice";

const HrDashboard = () => {
  const dispatch = useDispatch();

  // =========================
  // Dashboard Counts
  // =========================

  const dashboardCounts = useSelector(
    (state) => state.dashboard.dashboardCounts
  );

  // =========================
  // Today's Employee Stats
  // =========================

  const todayStats = useSelector(
    (state) => state.dashboard.todayStats
  );

  // =========================
  // Project Employee Count
  // =========================

  const projectEmployeeCount = useSelector(
    (state) => state.dashboard.projectEmployeeCount
  );

  // =========================
  // Weekly Attendance
  // =========================

  const weeklyAttendanceStats = useSelector(
    (state) => state.dashboard.weeklyAttendanceStats
  );

 // =========================
  // reimbursement Counts
  // =========================
  const reimbursementCounts = useSelector(
  (state) => state.dashboard.reimbursements
);

const reimbursementLoading = useSelector(
  (state) => state.dashboard.loading.reimbursements
);
  // =========================
  // Loading
  // =========================

  const loading = useSelector(
    (state) => state.dashboard.loading.dashboardCounts
  );

  const projectLoading = useSelector(
    (state) => state.dashboard.loading.projectEmployeeCount
  );

  const attendanceLoading = useSelector(
    (state) => state.dashboard.loading.weeklyAttendanceStats
  );

const reimbursementData =
  getReimbursementData(reimbursementCounts);
  // =========================
  // Error
  // =========================

  const error = useSelector(
    (state) => state.dashboard.error
  );

  // =========================
  // API Calls
  // =========================

  useEffect(() => {
    dispatch(getDashboardCounts());
    dispatch(getTodayEmployeeStats());
    dispatch(getProjectEmployeeCount());
    dispatch(getWeeklyAttendanceStats());
      dispatch(getReimbursementCounts());
  }, [dispatch]);

  // =========================
  // Dashboard Stats
  // =========================

  const dashboardStats = getDashboardStats(
    dashboardCounts
  );

  // =========================
  // Resource Allocation
  // =========================

  const resourceAllocationData =
    getResourceAllocationData(
      projectEmployeeCount
    );

  // =========================
  // Weekly Attendance Data
  // =========================

  const attendanceData =
    weeklyAttendanceStats?.data || [];

  return (
    <DashboardWrapper>

      <TopBar />

      <WelcomeBanner data={todayStats} />

      <DashboardContainer>
        <DashboardContent>

          {/* Dashboard Statistics */}

          <StatsSection>
            {loading ? (
              <div>Loading dashboard...</div>
            ) : error ? (
              <div>
                Failed to load dashboard data.
              </div>
            ) : (
              <StatsGrid data={dashboardStats} />
            )}
          </StatsSection>

          {/* First Row */}

          <TopGrid>

            {/* Static for now */}
            <PayrollChart data={payrollData} />

            {/* Static for now */}
           {reimbursementLoading ? (
  <div>
    Loading reimbursement...
  </div>
) : (
  <ReimbursementChart
    data={reimbursementData}
  />
)}

            {/* API Integrated */}
            {projectLoading ? (
              <div>
                Loading resource allocation...
              </div>
            ) : (
              <ResourceAllocation
                data={resourceAllocationData}
              />
            )}

          </TopGrid>

          {/* Second Row */}

          <BottomGrid>

            <GosiCard data={gosiData} />

            {/* API Integrated */}
            {attendanceLoading ? (
              <div>
                Loading attendance...
              </div>
            ) : (
              <AttendanceTrend
                data={attendanceData}
              />
            )}

            <EngagementCard
              data={engagementData}
            />

          </BottomGrid>

        </DashboardContent>
      </DashboardContainer>

    </DashboardWrapper>
  );
};

export default HrDashboard;