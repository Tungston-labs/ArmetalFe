import React from "react";
import {
  Wrapper,
  Header,
  Title,
  List,
  ListItem,
  Avatar,
  Info,
  Name,
  Dept,
  IdText,
  DateBox,
  NoData,
  IconButton
} from "./RecentlyAddedEmployees.styles";
import { useNavigate } from "react-router-dom";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
const RecentlyAddedEmployees = ({ employees = [], showCount = 5 }) => {
  const navigate = useNavigate();

  const sorted = [...employees].sort(
    (a, b) => new Date(b.joiningDate) - new Date(a.joiningDate)
  );

  const list = sorted.slice(0, showCount);

  return (
    <Wrapper>
      <Header>
        <Title>Recently Added Employees  </Title>
          <IconButton onClick={() => navigate("/employee")}>
            <BsArrowUpRightCircleFill />
          </IconButton>
      
      </Header>

      <List>
        {list.length === 0 && <NoData>No employees found</NoData>}

        {list.map((emp, idx) => (
          <ListItem key={idx}>
            {/* Use null if no avatar, or a default image */}
            <Avatar
              src={emp.avatar || null} 
              alt={emp.name || "Employee"} 
            />
            <Info>
              <Name>{emp.name}</Name>
              <Dept>{emp.department}</Dept>
              <IdText>ID: {emp.empId}</IdText>
            </Info>
            <DateBox>
              {emp.joiningDate
                ? new Date(emp.joiningDate).toLocaleDateString("en-IN")
                : "-"}
            </DateBox>
          </ListItem>
        ))}
      </List>
    </Wrapper>
  );
};

export default RecentlyAddedEmployees;
