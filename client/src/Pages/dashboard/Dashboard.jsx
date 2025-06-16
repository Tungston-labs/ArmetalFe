import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartments } from '../../Redux/departmentSlice';
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
  const dispatch = useDispatch();
  const { list: departments, loading, error } = useSelector(state => state.departments);

  useEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);

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
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error.toString()}</p>
          ) : departments.length === 0 ? (
            <p>No departments found.</p>
          ) : (
            departments.slice(0, 3).map((dept) => (
              <DepartmentCard key={dept.id}>
                <h3>{dept.name}</h3>
                <HeadInfo>
                  <div>
                    <small>Department head</small>
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

          <ViewMoreButton onClick={() => window.location.href = "/department"}>
            <span>➜</span> View more
          </ViewMoreButton>
        </CardGrid>
      </DepartmentSection>
    </DashboardContainer>
  );
};

export default Dashboard;
