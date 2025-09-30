import React from "react";
import {
  DashboardWrapper,
  Header,
  Title,
  Subtitle,
  BlueBanner,
  BannerHeader,
  CardContainer,
  CompanyCard,
  CardTitle,
  CardSubtitle,
  TableSection,
  TableHeader,
  TableWrapper,
  StyledTable,
} from "./Superadmin_Dashboard.Styles";

const Dashboard = () => {
  const companies = [
    { name: "Wayne Corporation", id: "12232231" },
    { name: "Acme Corporation", id: "12232231" },
    { name: "Wayne Corporation", id: "12232231" },
  ];

  const payments = [
    {
      name: "Wayne Corporation",
      address: "Lorem ipsum dolor sit amet consectetur.",
      companyId: "1455221",
      contact: "7561025114",
      employees: 12,
      paidDate: "-----",
    },
    {
      name: "Wayne Corporation",
      address: "Lorem ipsum dolor sit amet consectetur.",
      companyId: "1455221",
      contact: "7561025114",
      employees: 12,
      paidDate: "-----",
    },
    {
      name: "Wayne Corporation",
      address: "Lorem ipsum dolor sit amet consectetur.",
      companyId: "1455221",
      contact: "7561025114",
      employees: 12,
      paidDate: "-----",
    },
  ];

  return (
    <DashboardWrapper>
      {/* Header */}
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>Unifying Teams. Simplifying Operations</Subtitle>
      </Header>

      {/* Blue Banner with Companies */}
      <BlueBanner>
        <BannerHeader>
          <div>
            <h2>No of Companys</h2>
            <p>Recently added Company Details</p>
          </div>
          <span>{companies.length}</span>
        </BannerHeader>
        <CardContainer>
          {companies.map((c, i) => (
            <CompanyCard key={i}>
              <CardTitle>Company Name</CardTitle>
              <CardSubtitle>{c.name}</CardSubtitle>
              <p>Company ID {c.id}</p>
            </CompanyCard>
          ))}
        </CardContainer>
      </BlueBanner>

      {/* Pending Payments */}
      <TableSection>
        <TableHeader>
          <div>
            <h2>Pending payment details</h2>
            <p>Pending payment details List</p>
          </div>
          <span>{payments.length}</span>
        </TableHeader>

        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>Company name</th>
                <th>Address</th>
                <th>Company ID</th>
                <th>Contact details</th>
                <th>No of Employees</th>
                <th>Paid date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((row, i) => (
                <tr key={i}>
                  <td>{row.name}</td>
                  <td>{row.address}</td>
                  <td>{row.companyId}</td>
                  <td>{row.contact}</td>
                  <td>{row.employees}</td>
                  <td>{row.paidDate}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </TableSection>
    </DashboardWrapper>
  );
};

export default Dashboard;
