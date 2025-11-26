// Dashboard.jsx
import React, { useState } from "react";
import { Container, ContentWrapper, TwoColumn, LeftBox, RightBox, ThreeBox, ThreeColumnRow } from "./HomeDashboard.Styles";

import HeaderBar from "../../Components/homepage/HeaderBar";
import StatsGrid from "../../Components/homepage/StatsGrid";
import RightModal from "../../Components/homepage/RightModal";
import ProjectChart from "../../Components/homepage/ProjectChart";
import ReimbursementSummary from "../../Components/homepage/ReimbursementSummary";
import DepartmentSummary from "../../Components/homepage/DepartmentSummary";
import UpcomingHolidays from "../../Components/homepage/UpcomingHolidays";
import EmployeeContractExpiry from "../../Components/homepage/EmployeeContractExpiry";
import RecentlyAddedEmployees from "../../Components/homepage/RecentlyAddedEmployees";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
const departmentList = [
  { name: "HR", createdAt: "2025-01-10" },
  { name: "Finance", createdAt: "2025-01-08" },
 
];
const holidays = [
  { name: "testing", date: "2025-12-2", type: "National" },
  { name: "X-mas", date: "2025-12-25", type: "National" },
];

const contractEmployees = [
  { name: "John Doe", empId: "EMP001", expiryDate: "2025-12-15" },
  { name: "Aisha Khan", empId: "EMP002", expiryDate: "2025-12-30" },
  { name: "Ravi Kumar", empId: "EMP003", expiryDate: "2026-01-05" },
];
const recentEmployees = [
  { name: "Megha Roy", department: "HR", empId: "EMP101", joiningDate: "2025-01-02" },
  { name: "Kavin Kumar", department: "Finance", empId: "EMP102", joiningDate: "2025-01-06" },
  { name: "Aarav Patel", department: "IT", empId: "EMP103", joiningDate: "2025-01-10" },
];

<DepartmentSummary departments={departmentList} />;

  return (
    <Container>
      <ContentWrapper className={open ? "shrink" : ""}>
        <HeaderBar onOpen={() => setOpen(true)} />

        <StatsGrid />


        <TwoColumn>
          <LeftBox>
              <ReimbursementSummary
/>

          </LeftBox>

          <RightBox>
              <ProjectChart site={100} variant={80} bench={20} />
          </RightBox>
        </TwoColumn>

       <ThreeColumnRow>

  <ThreeBox>
    <DepartmentSummary departments={departmentList} />
  </ThreeBox>
<ThreeBox>
  <RecentlyAddedEmployees employees={recentEmployees} showCount={4} />
</ThreeBox>
 
  <ThreeBox>
  <EmployeeContractExpiry employees={contractEmployees} showCount={4} />
</ThreeBox>

<ThreeBox>
  <UpcomingHolidays
    holidays={holidays}
    showCount={4}
    onViewAll={() => console.log("open holidays page")}
  />
</ThreeBox>

</ThreeColumnRow>
      </ContentWrapper>

      <RightModal open={open} onClose={() => setOpen(false)} />
    </Container>
  );
};

export default Dashboard;
