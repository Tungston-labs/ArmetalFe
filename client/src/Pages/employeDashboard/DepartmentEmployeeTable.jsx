import React from "react";
import {
  Card,
  Title,
  Item,
  Left,
  Right,
  Divider,
  Section,
} from "./DepartmentEmployeeTable.styles";
const DepartmentEmployeeTable = ({ employee }) => {
  if (!employee) return null;
  const fields = [
    { label: "Department Name", value: employee.department || "—" },
    { label: "Employee ID", value: employee.employeeId || "—" },
    { label: "Employee Type", value: employee.employeeType || "—" },
    { label: "Role", value: employee.role || "—" },
  ];
  return (
    <Card>
      <Title>Department Information</Title>
      <Section>
        {fields.map((item, index) => (
          <React.Fragment key={index}>
            <Item>
              <Left>{item.label}</Left>
              <Right>{item.value}</Right>
            </Item>
            {index !== fields.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Section>
    </Card>
  );
};
export default DepartmentEmployeeTable;
