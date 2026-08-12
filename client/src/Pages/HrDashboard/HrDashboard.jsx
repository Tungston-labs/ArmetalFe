import React from "react";
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
    dashboardStats,
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


const HrDashboard = () => {
    return (
        <DashboardWrapper>
            <TopBar />
    <WelcomeBanner />
           <DashboardContainer>
  <DashboardContent>


    <StatsSection>
      <StatsGrid data={dashboardStats} />
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