import React from "react";
import {
  Card,
  Title,
  InfoRow,
  Label,
  Value
} from "./EmployeeInfo.styles";

const EmployeeInfo = ({ data }) => {
    
  return (
    <Card>
      <Title>Employee Details</Title>

      <InfoRow>
        <Label>Department</Label>
        <Value>{data.department}</Value>
      </InfoRow>

      <InfoRow>
        <Label>Project</Label>
        <Value>{data.project}</Value>
      </InfoRow>

      <InfoRow>
        <Label>Employee ID</Label>
        <Value>{data.employeeId}</Value>
      </InfoRow>

      <InfoRow>
        <Label>Employee Type</Label>
        <Value>{data.employeeType}</Value>
      </InfoRow>

      <InfoRow>
        <Label>Passport Number</Label>
        <Value>{data.passportNumber}</Value>
      </InfoRow>

      <InfoRow>
        <Label>Roles</Label>
        <Value>{data.roles}</Value>
      </InfoRow>
    </Card>
  );
};

export default EmployeeInfo;
