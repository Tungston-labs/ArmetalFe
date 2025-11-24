import React from "react";
import {
  Wrapper,
  SectionTitle,
  GridBox,
  CountCard,
  CountNumber,
  CountLabel,
  LatestCard,
  LatestHeader,
  LatestItem,
  DeptName,
  DeptDate,
  NoData
} from "./DepartmentSummary.Styles";

const DepartmentSummary = ({ departments }) => {
  const totalDepartments = departments?.length || 0;
  const latestDepartments = [...(departments || [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <Wrapper>
      <SectionTitle>Department Overview</SectionTitle>
      <GridBox>
        <CountCard>
          <CountNumber>{totalDepartments}</CountNumber>
          <CountLabel>Total Active Departments</CountLabel>
        </CountCard>
        <LatestCard>
          <LatestHeader>Recently Added</LatestHeader>

          {latestDepartments.length > 0 ? (
            latestDepartments.map((dept, idx) => (
              <LatestItem key={idx}>
                <DeptName>{dept.name}</DeptName>
                <DeptDate>
                  {new Date(dept.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </DeptDate>
              </LatestItem>
            ))
          ) : (
            <NoData>No recent departments found</NoData>
          )}
        </LatestCard>
      </GridBox>
    </Wrapper>
  );
};

export default DepartmentSummary;
