

import React from 'react';
import {
  DashboardContainer,
  SectionTitle,
  CardGrid,
  StatCard,
  CardTitle,
  CardValue,
  DepartmentSection,
  DepartmentCard,
  HeadInfo,
  Avatar,
  ViewMoreButton
} from '../dashboard/Dashboard.styles';

const Dashboard = () => {
  return (
    <DashboardContainer>
      <SectionTitle>Dashboard</SectionTitle>
      <CardGrid>
        <StatCard>
          <CardTitle>Total employees</CardTitle>
          <CardValue>255</CardValue>
        </StatCard>
        <StatCard>
          <CardTitle>Employee Attendance</CardTitle>
          <CardValue>255</CardValue>
        </StatCard>
        <StatCard>
          <CardTitle>Employee leave Request</CardTitle>
          <CardValue>255</CardValue>
        </StatCard>
        <StatCard>
          <CardTitle>Employee visa Expiry</CardTitle>
          <CardValue>32</CardValue>
        </StatCard>
      </CardGrid>

      <DepartmentSection>
        <SectionTitle>Departments</SectionTitle>
        <CardGrid>
          {[1, 2, 3].map((_, idx) => (
            <DepartmentCard key={idx}>
              <h3>QA / Testing</h3>
              <HeadInfo>
                <div>
                  <small>Department head</small>
                  <p>John Marshal</p>
                </div>
                <Avatar src="https://i.pravatar.cc/40?img=3" alt="head" />
                <CardValue>125</CardValue>
              </HeadInfo>
            </DepartmentCard>
          ))}
          <ViewMoreButton>
            <span>➜</span> View more
          </ViewMoreButton>
        </CardGrid>
      </DepartmentSection>
    </DashboardContainer>
  );
};

export default Dashboard;
