import React from "react";
import { TableContainer, StyledTable, Thead, Th, Tbody, Tr, Td } from "./EmployeeTable.Styles";

const EmployeeTable = ({ columns = [], data = [], onRowClick }) => {
  return (
    <TableContainer>
      <StyledTable>
        <Thead>
          <Tr>
            {columns.map((col) => (
              <Th key={col.key}>{col.title}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <Tr
                key={row.id || rowIndex}
                style={{ cursor: onRowClick ? "pointer" : "default" }}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col) => (
                  <Td key={col.key} data-label={col.title}>
                    {row[col.key]}
                  </Td>
                ))}
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={columns.length} style={{ textAlign: "center" }}>
                No data found
              </Td>
            </Tr>
          )}
        </Tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default EmployeeTable;
