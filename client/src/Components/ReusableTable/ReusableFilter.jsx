import React, { useState, useRef, useEffect } from "react";
import {
  FilterWrapper,
  LeftSection,
  RightSection,
  SearchWrapper,
  SearchInput,
  SearchIcon,
  Select,
  DateInput,
  MoreOptionsWrapper,
  MoreOptionsButton,
  MoreOptionsMenu,
  MenuItem,
  MenuHeader,
  MenuStatusItem,
} from "./ReusableFilter.styles";

import { FiSearch, FiMinus, FiChevronDown } from "react-icons/fi";

const ReusableFilter = ({
  search = "",
  onSearch,
  searchPlaceholder = "Search Employee ID",

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

  showMoreOptions = false,
  moreOptions = [],
  selectedMoreOptions = [],
  onMoreOptionsChange,

  // Bulk action mode — active when 1+ rows are selected
  selectedCount = 0,
  bulkStatusOptions = [],   // e.g. [{ label: "Paid", value: "Paid" }, ...]
  onBulkStatusChange,       // (value) => void
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value) => {
    if (!onMoreOptionsChange) return;
    const next = selectedMoreOptions.includes(value)
      ? selectedMoreOptions.filter((v) => v !== value)
      : [...selectedMoreOptions, value];
    onMoreOptionsChange(next);
  };

  const isBulkMode = selectedCount > 0;

  const handleBulkPick = (value) => {
    onBulkStatusChange?.(value);
    setMenuOpen(false);
  };

  return (
    <FilterWrapper>

      <LeftSection>

        {showSearch && (
          <SearchWrapper>

            <SearchInput
              placeholder={searchPlaceholder}
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

        {showMoreOptions && (
          <MoreOptionsWrapper ref={wrapperRef}>
            <MoreOptionsButton
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              $active={isBulkMode}
            >
              <FiMinus />
              <FiChevronDown />
            </MoreOptionsButton>

            {menuOpen && (
              <MoreOptionsMenu>
                {isBulkMode ? (
                  <>
                    <MenuHeader>
                      {selectedCount} selected — set status
                    </MenuHeader>

                    {bulkStatusOptions.map((opt) => (
                      <MenuStatusItem
                        key={opt.value}
                        type="button"
                        onClick={() => handleBulkPick(opt.value)}
                      >
                        {opt.label}
                      </MenuStatusItem>
                    ))}
                  </>
                ) : (
                  moreOptions.map((opt) => (
                    <MenuItem key={opt.value}>
                      <input
                        type="checkbox"
                        checked={selectedMoreOptions.includes(opt.value)}
                        onChange={() => toggleOption(opt.value)}
                      />
                      {opt.label}
                    </MenuItem>
                  ))
                )}
              </MoreOptionsMenu>
            )}
          </MoreOptionsWrapper>
        )}

      </RightSection>

    </FilterWrapper>
  );
};

export default ReusableFilter;