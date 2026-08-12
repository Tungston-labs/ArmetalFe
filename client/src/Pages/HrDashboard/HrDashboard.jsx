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
  reimbursementData,
  resourceAllocationData,
  attendanceData,
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
} from "../../Redux/dashboardSlice";

const HrDashboard = () => {
  const dispatch = useDispatch();

  // Dashboard counts API
  const dashboardCounts = useSelector(
    (state) => state.dashboard.dashboardCounts
  );

  // Today's employee stats API
  const todayStats = useSelector(
    (state) => state.dashboard.todayStats
  );

  const loading = useSelector(
    (state) => state.dashboard.loading.dashboardCounts
  );

  const error = useSelector(
    (state) => state.dashboard.error
  );

  // Fetch dashboard APIs
  useEffect(() => {
    dispatch(getDashboardCounts());
    dispatch(getTodayEmployeeStats());
  }, [dispatch]);

  // Convert API response into StatsGrid data
  const dashboardStats = getDashboardStats(dashboardCounts);

  return (
    <DashboardWrapper>

      <TopBar />

      {/* Pass today's API data */}
      <WelcomeBanner data={todayStats} />

      <DashboardContainer>
        <DashboardContent>

          {/* Dashboard Statistics */}
          <StatsSection>
            {loading ? (
              <div>Loading dashboard...</div>
            ) : error ? (
              <div>Failed to load dashboard data.</div>
            ) : (
              <StatsGrid data={dashboardStats} />
            )}
          </StatsSection>

          {/* First Row */}
          <TopGrid>

            <PayrollChart data={payrollData} />

            <ReimbursementChart data={reimbursementData} />

            <ResourceAllocation data={resourceAllocationData} />

          </TopGrid>

          {/* Second Row */}
          <BottomGrid>

            <GosiCard data={gosiData} />

            <AttendanceTrend data={attendanceData} />

            <EngagementCard data={engagementData} />

          </BottomGrid>

        </DashboardContent>
      </DashboardContainer>

    </DashboardWrapper>
  );
};

export default HrDashboard;