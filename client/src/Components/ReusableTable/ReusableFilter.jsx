import React, { useEffect, useRef, useState } from "react";

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

import {
  FiSearch,
  FiMinus,
  FiChevronDown,
} from "react-icons/fi";

const ReusableFilter = ({
  // ================= SEARCH =================
  search = "",
  onSearch,
  searchPlaceholder = "Search Employee ID",

  // ================= DEPARTMENT =================
  department = "",
  departments = [],
  onDepartment,

  // ================= STATUS =================
  status = "",
  statuses = [],
  onStatus,

  // ================= DATE =================
  date = "",
  onDate,

  // ================= VISIBILITY =================
  showSearch = true,
  showDepartment = false,
  showStatus = false,
  showDate = false,

  // ================= MORE OPTIONS =================
  showMoreOptions = false,
  moreOptions = [],
  selectedMoreOptions = [],
  onMoreOptionsChange,

  // ================= BULK ACTION =================
  selectedCount = 0,
  bulkStatusOptions = [],
  onBulkStatusChange,

  // ================= RIGHT ACTION =================
  // Example:
  // rightAction={
  //   <button onClick={handleAdd}>+ ADD EMPLOYEE</button>
  // }
  rightAction = null,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const wrapperRef = useRef(null);

  // =========================================================
  // CLOSE MORE OPTIONS WHEN CLICKING OUTSIDE
  // =========================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =========================================================
  // MORE OPTION CHECKBOX
  // =========================================================

  const toggleOption = (value) => {
    if (!onMoreOptionsChange) return;

    const next = selectedMoreOptions.includes(value)
      ? selectedMoreOptions.filter(
          (item) => item !== value
        )
      : [
          ...selectedMoreOptions,
          value,
        ];

    onMoreOptionsChange(next);
  };

  // =========================================================
  // BULK MODE
  // =========================================================

  const isBulkMode = selectedCount > 0;

  // =========================================================
  // BULK STATUS
  // =========================================================

  const handleBulkPick = (value) => {
    onBulkStatusChange?.(value);

    setMenuOpen(false);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <FilterWrapper>

      {/* =====================================================
          LEFT SECTION
      ===================================================== */}

      <LeftSection>

        {/* ================= SEARCH ================= */}

        {showSearch && (
          <SearchWrapper>

            <SearchInput
              placeholder={searchPlaceholder}
              value={search}
              onChange={(event) =>
                onSearch?.(event.target.value)
              }
            />

            <SearchIcon>
              <FiSearch />
            </SearchIcon>

          </SearchWrapper>
        )}

        {/* ================= DEPARTMENT ================= */}

        {showDepartment && (
          <Select
            value={department}
            onChange={(event) =>
              onDepartment?.(event.target.value)
            }
          >
            <option value="">
              All Departments
            </option>

            {departments.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}

          </Select>
        )}

        {/* ================= STATUS ================= */}

        {showStatus && (
          <Select
            value={status}
            onChange={(event) =>
              onStatus?.(event.target.value)
            }
          >
            <option value="">
              All Status
            </option>

            {statuses.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}

          </Select>
        )}

      </LeftSection>


      {/* =====================================================
          RIGHT SECTION
      ===================================================== */}

      <RightSection>

        {/* ===================================================
            DATE

            If rightAction exists, the date is hidden.
        =================================================== */}

        {showDate && !rightAction && (
          <DateInput
            type="month"
            value={date}
            onChange={(event) =>
              onDate?.(event.target.value)
            }
          />
        )}


        {/* ===================================================
            CUSTOM RIGHT ACTION

            Example:

            rightAction={
              <HeaderButton>
                + ADD EMPLOYEE
              </HeaderButton>
            }
        =================================================== */}

        {rightAction}


        {/* ===================================================
            MORE OPTIONS
        =================================================== */}

        {showMoreOptions && (
          <MoreOptionsWrapper ref={wrapperRef}>

            {/* ================= BUTTON ================= */}

            <MoreOptionsButton
              type="button"
              onClick={() =>
                setMenuOpen(
                  (previous) => !previous
                )
              }
              $active={isBulkMode}
            >
              <FiMinus />

              <FiChevronDown />
            </MoreOptionsButton>


            {/* ================= MENU ================= */}

            {menuOpen && (
              <MoreOptionsMenu>

                {/* =================================================
                    BULK MODE
                ================================================= */}

                {isBulkMode ? (
                  <>
                    <MenuHeader>
                      {selectedCount} selected —
                      set status
                    </MenuHeader>

                    {bulkStatusOptions.map(
                      (option) => (
                        <MenuStatusItem
                          key={option.value}
                          type="button"
                          onClick={() =>
                            handleBulkPick(
                              option.value
                            )
                          }
                        >
                          {option.label}
                        </MenuStatusItem>
                      )
                    )}
                  </>
                ) : (

                  /* =================================================
                     NORMAL MORE OPTIONS
                  ================================================= */

                  moreOptions.map(
                    (option) => (
                      <MenuItem
                        key={option.value}
                      >

                        <input
                          type="checkbox"
                          checked={selectedMoreOptions.includes(
                            option.value
                          )}
                          onChange={() =>
                            toggleOption(
                              option.value
                            )
                          }
                        />

                        {option.label}

                      </MenuItem>
                    )
                  )

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