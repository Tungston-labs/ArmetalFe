import React from "react";
import {
  CompaniesSection,
  SectionHeader,
  SectionTitle,
  ViewAll,
  CompaniesGrid,
  CompanyCard,
  CompanyLogo,
  CompanyInfo,
  CompanyName,
  CompanyUsername,
} from "./RecentCompanies.Styles";

const companies = [
  {
    name: "YFLY",
    username: "yfly",
    // logo: "/images/yfly.png",
  },
  {
    name: "Tungston Labs",
    username: "tungstonlabs",
    // logo: "/images/tungston.png",
  },
  {
    name: "Stampede",
    username: "jim_arm_per_434",
    // logo: "/images/stampede.png",
  },
  {
    name: "Mediora",
    username: "mediora",
    // logo: "/images/mediora.png",
  },
  {
    name: "Tungston Labs",
    username: "tungstonlabs",
    // logo: "/images/tungston.png",
  },
];

const RecentlyAddedCompanies = ({ onViewAll }) => {
  return (
    <CompaniesSection>
      <SectionHeader>
        <SectionTitle>Recently Added Company Details</SectionTitle>

        <ViewAll onClick={onViewAll}>
          View All Companies
        </ViewAll>
      </SectionHeader>

      <CompaniesGrid>
        {companies.map((company, index) => (
          <CompanyCard key={`${company.name}-${index}`}>
            <CompanyLogo
              src={company.logo}
              alt={`${company.name} logo`}
            />

            <CompanyInfo>
              <CompanyName>{company.name}</CompanyName>
              <CompanyUsername>{company.username}</CompanyUsername>
            </CompanyInfo>
          </CompanyCard>
        ))}
      </CompaniesGrid>
    </CompaniesSection>
  );
};

export default RecentlyAddedCompanies;