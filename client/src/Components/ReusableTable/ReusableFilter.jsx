import React from "react";
import {
  FilterWrapper,
  LeftSection,
  RightSection,
  SearchWrapper,
  SearchInput,
  SearchIcon,
  Select,
  DateInput,
} from "./ReusableFilter.styles";

import { FiSearch } from "react-icons/fi";

const ReusableFilter = ({
  search = "",
  onSearch,

  department = "",
  departments = [],
  onDepartment,

  status = "",
  statuses = [],
  onStatus,

  date = "",
  onDate,

  showSearch = true,
  showDepartment = false,
  showStatus = false,
  showDate = false,
}) => {
  return (
    <FilterWrapper>

      <LeftSection>

        {showSearch && (
          <SearchWrapper>

            <SearchInput
              placeholder="Search Employee ID"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
            />

            <SearchIcon>
              <FiSearch />
            </SearchIcon>

          </SearchWrapper>
        )}

        {showDepartment && (
          <Select
            value={department}
            onChange={(e) => onDepartment(e.target.value)}
          >
            <option value="">All Departments</option>

            {departments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}

          </Select>
        )}

        {showStatus && (
          <Select
            value={status}
            onChange={(e) => onStatus(e.target.value)}
          >
            <option value="">All Status</option>

            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}

          </Select>
        )}

      </LeftSection>

      <RightSection>

        {showDate && (
          <DateInput
            type="month"
            value={date}
            onChange={(e) => onDate(e.target.value)}
          />
        )}

      </RightSection>

    </FilterWrapper>
  );
};

export default ReusableFilter;