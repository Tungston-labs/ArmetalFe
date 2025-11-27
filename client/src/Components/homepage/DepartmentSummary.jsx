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
  DeptInfo,
  DeptName,
  DeptDate,
  NoData,
  Container
} from "./DepartmentSummary.Styles";
import { FiChevronRight } from "react-icons/fi";


const DepartmentSummary = ({ departments = [] }) => {
  const totalDepartments = departments.length;
  const latestDepartments = [...departments]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <Wrapper>
      <SectionTitle>Department Overview</SectionTitle>

<Container>
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
                <DeptInfo>
                  <DeptName>{dept.name}</DeptName>
                  <DeptDate>
                    {new Date(dept.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </DeptDate>
                </DeptInfo>
                <div className="right-icon">
                  <FiChevronRight/>
                </div>
              </LatestItem>
            ))
          ) : (
            <NoData>No recent departments found</NoData>
          )}
        </LatestCard>
      </GridBox>
      </Container>
    </Wrapper>
  );
};

export default DepartmentSummary;
