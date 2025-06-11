// src/Components/EmployeeTable.jsx
import React from 'react';
import { FaInfoCircle, FaTrash } from 'react-icons/fa';
import {
    TableWrapper,
    StyledTable,
    Avatar,
    IconButton,
} from './Table.Styles';

const EmployeeTable = ({ bodyData = [], headData = [] }) => {
    return (
        <TableWrapper>
            <StyledTable>
                <thead>
                    <tr>

                        {headData?.map(i => <th>{i?.header}</th>)}
                        {/* <th>Employee name</th>
            <th>Employee ID</th>
            <th>Email ID</th>
            <th>Job Position</th>
            <th>Department</th>
            <th>Info</th>
            <th>Delete</th> */}
                    </tr>
                </thead>
                <tbody>
                    {bodyData.map((emp, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                <Avatar src={emp.avatar} alt="profile" />
                                {emp.name}
                            </td>
                            <td>{emp.employeeId}</td>
                            <td>{emp.email}</td>
                            <td>{emp.position}</td>
                            <td>{emp.department}</td>
                            <td>
                                <IconButton><FaInfoCircle /></IconButton>
                            </td>
                            <td>
                                <IconButton danger={"danger"}><FaTrash /></IconButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </StyledTable>
        </TableWrapper>
    );
};

export default EmployeeTable;
