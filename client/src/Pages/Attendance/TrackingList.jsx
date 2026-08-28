import React, { useMemo, useState } from "react";
import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../Components/Pagination/ReusablePagination";
import {
    employeeColumns,
    employeeData,
} from "../../Components/ReusableTable/dummydata";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";

const TrackingList = () => {
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");
    const [month, setMonth] = useState("");
    const rowsPerPage = 10;

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(
        employeeData.length / rowsPerPage
    );

    const paginatedData = useMemo(() => {

        const start =
            (currentPage - 1) * rowsPerPage;

        return employeeData.slice(
            start,
            start + rowsPerPage
        );

    }, [currentPage]);

    return (

        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Employees" Location Timeline
                breadcrumbs={["Employees","Employee Attendance"]}             
                showBack
            />           <ReusableFilter
                date={month}
                onDate={setMonth}
                showDate
                  showSearch={false}
            />

            <ReusableTable
                columns={employeeColumns}
                data={paginatedData}
            />

            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

        </div>

    );
};

export default TrackingList;