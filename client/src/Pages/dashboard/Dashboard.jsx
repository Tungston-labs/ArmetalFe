import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartments } from '../../Redux/departmentSlice';
import { getDashboardSummary } from '../../Redux/dashboardSlice';
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
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const dispatch = useDispatch();
const navigate = useNavigate();
  const {
    list: departments,
    loading: deptLoading,
    error: deptError,
  } = useSelector(state => state.departments);

  const {
    summary,
    loading: dashLoading,
    error: dashError,
  } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(getDepartments());
    dispatch(getDashboardSummary());
  }, [dispatch]);

  return (
    <DashboardContainer>
      <SectionTitle>Dashboard</SectionTitle>

      <CardGrid>
        <StatCard>
          <CardTitle>Total Employees</CardTitle>
          <CardValue>
            {dashLoading ? '...' : dashError ? '-' : summary.total_employees}
          </CardValue>
        </StatCard>
        <StatCard>
          <CardTitle>Today's Attendance</CardTitle>
          <CardValue>
            {dashLoading ? '...' : dashError ? '-' : summary.today_attendance}
          </CardValue>
        </StatCard>
        <StatCard>
          <CardTitle>Today's Leave</CardTitle>
          <CardValue>
            {dashLoading ? '...' : dashError ? '-' : summary.today_leave}
          </CardValue>
        </StatCard>
        <StatCard>
          <CardTitle>Upcoming Visa Expiry</CardTitle>
          <CardValue>
            {dashLoading ? '...' : dashError ? '-' : summary.visa_expiring_soon}
          </CardValue>
        </StatCard>
      </CardGrid>

      <DepartmentSection>
        <SectionTitle>Departments</SectionTitle>
        <CardGrid>
          {deptLoading ? (
            <p>Loading...</p>
          ) : deptError ? (
            <p style={{ color: 'red' }}>{deptError.toString()}</p>
          ) : departments.length === 0 ? (
            <p>No departments found.</p>
          ) : (
            departments.slice(0, 3).map((dept) => (
              <DepartmentCard key={dept.id}>
                <h3>{dept.name}</h3>
                <HeadInfo>
                  <div>
                    <small>Department Head</small>
                    <p>
                      {typeof dept.department_head === 'object'
                        ? dept.department_head?.name
                        : dept.department_head || 'Not Assigned'}
                    </p>
                  </div>
                  <Avatar src="https://i.pravatar.cc/40?img=3" alt="head" />
                  <CardValue>{dept.employee_count || 0}</CardValue>
                </HeadInfo>
              </DepartmentCard>
            ))
          )}

<ViewMoreButton onClick={() => navigate('/department')}>
  <span>➜</span> View more
</ViewMoreButton>

        </CardGrid>
      </DepartmentSection>
    </DashboardContainer>
  );
};

export default Dashboard;
