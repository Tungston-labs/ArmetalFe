import React from "react";
import styled from "styled-components";
import ContractExpiryList from "../../Components/ContractExpiryList";
import CalendarSection from "../../Components/CalendarSection";
import TopCard from "../../Components/TopCard";

const employeesMock = [
  { name: "Employee", empId: "1254125", department: "Department" },
  { name: "Employee", empId: "1254125", department: "Department" },
  { name: "Employee", empId: "1254125", department: "Department" },
  { name: "Employee", empId: "1254125", department: "Department" }
];

const TopCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;

`;


/* Two-column layout:
   - left column: flexible (1fr)
   - right column: fixed width (360px)
   On small screens it becomes a single column (stacked) — no horizontal scroll.
*/
const TwoColumn = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 1.5rem;
  align-items: flex-start;


  /* allow children to shrink to avoid forcing horizontal scroll */
  > * {
    min-width: 0;
  }

  /* breakpoint: stack columns vertically on small screens */
  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }
`;

export default function HomeDashboard() {
  return (
    <>

      <TopCardsGrid>
        <TopCard icon="👨‍💼" title="Total Employees" count={12} employees={employeesMock} />
        <TopCard icon="🧾" title="Employee Leave Request" count={12} employees={employeesMock} />
        <TopCard icon="🛂" title="Employee Visa Expiry" count={12} employees={employeesMock} />
      </TopCardsGrid>

      <TwoColumn>
        {/* LEFT SIDE */}
        <ContractExpiryList />

        {/* RIGHT SIDE */}
        <CalendarSection />
      </TwoColumn>
    
    </>
  );
}
