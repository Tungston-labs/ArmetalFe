import React, { useMemo, useState } from "react";
import {
  Container,
  TableContainer,
  StyledTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  EmptyState,
} from "./ReusableTable.styles";

const ReusableTable = ({ columns = [], data = [], loading = false, onRowClick }) => {
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (key) => {
    if (!key) return;
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const first = a[sortKey];
      const second = b[sortKey];
      if (typeof first === "number") {
        return sortDirection === "asc" ? first - second : second - first;
      }
      return sortDirection === "asc"
        ? String(first).localeCompare(String(second))
        : String(second).localeCompare(String(first));
    });
  }, [data, sortKey, sortDirection]);

  return (
    <Container>
      <TableContainer>
        <StyledTable>
          <Thead>
            <Tr>
              {columns.map((column) => (
                <Th
                  key={column.accessor}
                  onClick={() => column.sortable !== false && handleSort(column.accessor)}
                >
                  {column.header}
                  {column.sortable !== false &&
                    sortKey === column.accessor &&
                    (sortDirection === "asc" ? " ▲" : " ▼")}
                </Th>
              ))}
            </Tr>
          </Thead>

          <Tbody>
            {loading && (
              <Tr>
                <Td colSpan={columns.length}>
                  <EmptyState>Loading...</EmptyState>
                </Td>
              </Tr>
            )}

            {!loading && sortedData.length === 0 && (
              <Tr>
                <Td colSpan={columns.length}>
                  <EmptyState>No Records Found</EmptyState>
                </Td>
              </Tr>
            )}

            {!loading &&
              sortedData.map((row, index) => (
                <Tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  style={onRowClick ? { cursor: "pointer" } : undefined}
                >
                  {columns.map((column) => (
                    <Td key={column.accessor}>
                      {column.render ? column.render(row, index) : row[column.accessor]}
                    </Td>
                  ))}
                </Tr>
              ))}
          </Tbody>
        </StyledTable>
      </TableContainer>
    </Container>
  );
};

export default ReusableTable;