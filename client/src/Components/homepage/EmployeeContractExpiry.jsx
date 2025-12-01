import React from "react";
import {
  Wrapper,
  Header,
  List,
  ListItem,
  ExpiryBox,
  Info,
  NoData
} from "./EmployeeContractExpiry.styles";
import { useNavigate } from "react-router-dom";
import { IdText, Name, Title } from "./RecentlyAddedEmployees.styles";
import { IconButton } from "./ProjectChart.Styles";
import { BsArrowUpRightCircleFill } from "react-icons/bs";

function daysLeft(dateStr) {
  const today = new Date();
  const expiry = new Date(dateStr);
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const diff = expiry - today;
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

const EmployeeContractExpiry = ({ employees = [], showCount = 5 }) => {
  const navigate = useNavigate();
  const sorted = [...employees].sort(
    (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
  );

  const list = sorted.slice(0, showCount);

  return (
    <Wrapper>
      <Header>
        <Title>Contract Expiry</Title>

        {/* 🔥 Icon on Right side */}
               <IconButton onClick={() => navigate("/employee")}>
          <BsArrowUpRightCircleFill />
        </IconButton>
      </Header>

      <List>
        {list.length === 0 && <NoData>No expiring contracts</NoData>}

        {list.map((emp, idx) => {
          const days = daysLeft(emp.expiryDate);
          const isSoon = days >= 0 && days <= 5;

          return (
            <ListItem key={idx} $highlight={isSoon}>
              
              <ExpiryBox $highlight={isSoon}>
                <span className="day">{new Date(emp.expiryDate).getDate()}</span>
                <span className="month">
                  {new Date(emp.expiryDate).toLocaleString("en-IN", { month: "short" })}
                </span>
              </ExpiryBox>

              <Info>
                <Name>{emp.name}</Name>
                <IdText>Emp ID: {emp.empId}</IdText>
                <IdText>
                  {days === 0
                    ? "Expires Today"
                    : days > 0
                    ? `${days} day${days > 1 ? "s" : ""} left`
                    : `${Math.abs(days)} day${Math.abs(days) > 1 ? "s" : ""} ago`}
                </IdText>
              </Info>
            </ListItem>
          );
        })}
      </List>
    </Wrapper>
  );
};

export default EmployeeContractExpiry;
