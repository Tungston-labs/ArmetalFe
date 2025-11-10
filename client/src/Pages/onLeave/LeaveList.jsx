import React, { useState, useEffect } from "react";
import {
    PageContainer,
    DepartmentGrid,
    DepartmentCard,
    DepartmentHeader,
    DepartmentName,
    EmployeeCount,
    DropdownWrapper,
    EmployeeList,
    EmployeeItem,
} from "../attendance/AttendanceList.Styles";
import EmployeeTitle from "../../Components/EmployeeTitle";
import EmployeeIcon from "../../assets/employeeicon.svg";
import { useDispatch, useSelector } from "react-redux";
import { getDepartments, getEmployeesByDepartment } from "../../Redux/departmentSlice";

const LeaveList = () => {
    const dispatch = useDispatch();
    const [selectedDept, setSelectedDept] = useState(null);

    const { list: departmentList, loading, departmentEmployees } = useSelector(
        (state) => state.departments
    );

    useEffect(() => {
        dispatch(getDepartments({ page: 1, search: "" }));
    }, [dispatch]);

    const handleToggle = (deptId) => {
        if (selectedDept === deptId) {
            setSelectedDept(null);
        } else {
            setSelectedDept(deptId);
            dispatch(getEmployeesByDepartment(deptId));
        }
    };

    return (
        <PageContainer>
            <EmployeeTitle
                iconSrc={EmployeeIcon}
                showAddButton={false}
                showDropdown={false}
            />

            {loading ? (
                <p>Loading departments...</p>
            ) : (
                <DepartmentGrid>
                    {departmentList?.length > 0 ? (
                        departmentList.map((dept) => {
                            const isOpen = selectedDept === dept.id;
                            return (
                                <DepartmentCard key={dept.id}>
                                    <DepartmentHeader onClick={() => handleToggle(dept.id)}>
                                        <DepartmentName>{dept.name || "Department"}</DepartmentName>
                                        <EmployeeCount>{dept.todays_leave_employee_count || 0} Employees</EmployeeCount>
                                    </DepartmentHeader>

                                    {isOpen && (
                                        <DropdownWrapper>
                                            <EmployeeList>
                                                {departmentEmployees.length > 0 ? (
                                                    departmentEmployees.map((emp) => (
                                                        <EmployeeItem key={emp.id}>{emp.name}</EmployeeItem>
                                                    ))
                                                ) : (
                                                    <EmployeeItem>No employees found</EmployeeItem>
                                                )}
                                            </EmployeeList>
                                        </DropdownWrapper>
                                    )}
                                </DepartmentCard>
                            );
                        })
                    ) : (
                        <p>No departments found.</p>
                    )}

                </DepartmentGrid>
            )}
        </PageContainer>
    );
};

export default LeaveList;
