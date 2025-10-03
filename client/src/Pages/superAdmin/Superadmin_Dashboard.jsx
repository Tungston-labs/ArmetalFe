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
  CardContent,
  CompanyLogo,
  CardSlider,
} from "./Superadmin_Dashboard.Styles";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const navigate = useNavigate();

  const companies = [
  { name: "Wayne Corporation", id: "12232231", logo: "/images/sample.png" },
  { name: "Acme Corporation", id: "12232231", logo: "/images/images.jpeg" },
  { name: "LexCorp", id: "12232231", logo: "/images/sample.png" },
  { name: "Stark Industries", id: "12232231", logo: "/images/sample.png" },
  { name: "Oscorp", id: "12232231", logo: "/images/sample.png" },
  { name: "Umbrella Corp", id: "12232231", logo: "/images/sample.png" },
  { name: "Wonka Industries", id: "12232231", logo: "/images/sample.png" },
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
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>Unifying Teams. Simplifying Operations</Subtitle>
      </Header>
      <BlueBanner>
        <BannerHeader>
          <div>
            <h2>No of Companys</h2>
            <p>Recently added Company Details</p>
          </div>
          <span>{companies.length}</span>
        </BannerHeader>
 <CardContainer>
  <CardSlider>
    
    {companies.concat(companies).map((c, i) => (
       <Link 
      key={i} 
      to={`/company/${c.id}`} 
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <CompanyCard key={i}>
        <CardContent>
          <CompanyLogo src={c.logo || "/default-logo.png"} alt={c.name} />
          <div>
            <CardTitle>Company Name</CardTitle>
            <CardSubtitle>{c.name}</CardSubtitle>
             <CardTitle>Company ID </CardTitle>
                  <CardSubtitle>{c.id}</CardSubtitle>
       
          </div>
        </CardContent>
      </CompanyCard>
      </Link>
    ))}
  </CardSlider>
</CardContainer>

      </BlueBanner>


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
              <tr
                key={i}
                onClick={() => navigate(`/company/${row.companyId}`)}
                style={{ cursor: "pointer" }}
              >
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
