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

const Dashboard = () => {
  const [open, setOpen] = useState(false);
const departmentList = [
  { name: "HR", createdAt: "2025-01-10" },
  { name: "Finance", createdAt: "2025-01-08" },
 
];
const holidays = [
  { name: "sample", date: "2025-11-25", type: "National" },
  { name: "testing", date: "2025-12-2", type: "National" },
  { name: "X-mas", date: "2025-12-25", type: "National" },
  { name: "New Year", date: "2026-01-01", type: "National" },
  { name: "Republic Day", date: "2026-01-26", type: "National" }
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
              <ProjectChart site={120} variant={80} bench={20} />
          </RightBox>
        </TwoColumn>

       <ThreeColumnRow>

  <ThreeBox>
    <DepartmentSummary departments={departmentList} />
  </ThreeBox>

 <ThreeBox>
  <UpcomingHolidays
    holidays={holidays}
    showCount={4}
    onViewAll={() => console.log("open holidays page")}
  />
</ThreeBox>

  <ThreeBox>

  </ThreeBox>

</ThreeColumnRow>
      </ContentWrapper>

      <RightModal open={open} onClose={() => setOpen(false)} />
    </Container>
  );
};

export default Dashboard;
