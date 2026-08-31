import React from "react";
import { useSelector } from "react-redux";

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

const RecentlyAddedCompanies = ({ onViewAll }) => {
  const { overview } = useSelector(
    (state) => state.superAdmin
  );

  const companies = overview?.companies || [];

  return (
    <CompaniesSection>
      <SectionHeader>
        <SectionTitle>Recently Added Company Details</SectionTitle>

        <ViewAll onClick={onViewAll}>
          View All Companies
        </ViewAll>
      </SectionHeader>

      <CompaniesGrid>
        {companies.length === 0 ? (
          <p>No companies found.</p>
        ) : (
          companies.map((company) => (
            <CompanyCard key={company.id}>
              <CompanyLogo
                src={company.logo_url}
                alt={`${company.name} logo`}
              />

              <CompanyInfo>
                <CompanyName>{company.name}</CompanyName>
                <CompanyUsername>{company.company_id}</CompanyUsername>
              </CompanyInfo>
            </CompanyCard>
          ))
        )}
      </CompaniesGrid>
    </CompaniesSection>
  );
};

export default RecentlyAddedCompanies;
