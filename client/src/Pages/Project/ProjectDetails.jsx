import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    PiCalendarBlank,
    PiCheckCircle,
    PiFlag,
    PiPencilSimple,
    PiTrash,
    PiUsersThree,
} from "react-icons/pi";
import ReusableConfirmModal from "../../Components/modals/ReusableConfirmModal";
import {
    projectData,
} from "../../utils/projectData";

import {
    projectEmployeeColumns,
    projectEmployeeData,
} from "../../utils/projectEmployees";

import { HeaderButton } from "../../Components/ReusableTable/ReusableHeader.styles";

import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";
import StatsCards from "../../Components/StatsCards/StatsCards";
import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";

import {
    DetailsPage,
    DetailsContainer,
    Title,
} from "./ProjectDetails.styles";


const ProjectDetails = () => {

    const { id } = useParams();

    const navigate = useNavigate();


    // =========================
    // PAGINATION
    // =========================

    const [currentPage, setCurrentPage] = useState(1);

    const [rowsPerPage, setRowsPerPage] = useState(10);
const [showDeleteModal, setShowDeleteModal] = useState(false);

    // =========================
    // EMPLOYEES
    // =========================

    const [employees, setEmployees] = useState(
        projectEmployeeData
    );


    // =========================
    // FILTERS
    // =========================

    const [search, setSearch] = useState("");

    const [department, setDepartment] = useState("");

    const [status, setStatus] = useState("");

    const [month, setMonth] = useState("");


    // =========================
    // FIND PROJECT
    // =========================

    const project = projectData.find(
        (item) => item.id === Number(id)
    );


    // =========================
    // DELETE EMPLOYEE
    // =========================

  const handleDeleteProject = async () => {
  try {
    await dispatch(deleteProject(id)).unwrap();

    // Close modal
    setShowDeleteModal(false);

    // Go back to projects page
    navigate("/projects");
  } catch (error) {
    console.error("Failed to delete project:", error);
  }
};


    // =========================
    // PAGINATED DATA
    // =========================

    const paginatedData = useMemo(() => {

        const start =
            (currentPage - 1) * rowsPerPage;

        return employees.slice(
            start,
            start + rowsPerPage
        );

    }, [
        employees,
        currentPage,
        rowsPerPage,
    ]);


    // =========================
    // PROJECT NOT FOUND
    // =========================

    if (!project) {

        return (
            <DetailsPage>

                <DetailsContainer>

                    <Title>
                        Project Not Found
                    </Title>

                </DetailsContainer>

            </DetailsPage>
        );
    }


    // =========================
    // EMPLOYEE COLUMNS
    // =========================

    const employeeColumns = [
        ...projectEmployeeColumns.filter(
            (column) => column.accessor !== "action"
        ),
        {
            accessor: "action",
            header: "Delete",
            sortable: false,

            render: (row) => (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();

                        handleDeleteEmployee(row.id);
                    }}
                    style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#DB0F12",
                        padding: "5px",
                    }}
                    title="Remove Employee"
                >
                    <PiTrash size={20} />
                </button>
            ),
        },
    ];


    const projectStats = [

        {
            title: "Project Status",

            count: project.status,

            icon: <PiCheckCircle />,

            iconColor: "#15AA60",

            backgroundColor: "#E3F7ED",
        },

        {
            title: "Priority",

            count: project.priority,

            icon: <PiFlag />,

            iconColor: "#FF8B2C",

            backgroundColor: "#FFF1E5",
        },

        {
            title: "Project Date",

            count: project.date,

            icon: <PiCalendarBlank />,

            iconColor: "#3858C8",

            backgroundColor: "#E8EDFF",
        },

        {
            title: "Total Members",

            count: employees.length,

            icon: <PiUsersThree />,

            iconColor: "#8E44AD",

            backgroundColor: "#F3E8FF",
        },

    ];


    // =========================
    // RENDER
    // =========================

    return (

        <DetailsPage>

            {/* =========================
                HEADER
            ========================= */}

            <ReusableHeader
                title={project.title}

                breadcrumbs={[
                    "Projects",
                    project.title,
                ]}

                showBack

                onBack={() =>
                    navigate("/projects")
                }
            >

                <HeaderButton>

                    <PiPencilSimple />

                    Edit

                </HeaderButton>


                <HeaderButton
                    $variant="danger"
                >

                    <PiTrash />

                    Delete

                </HeaderButton>

            </ReusableHeader>


            {/* =========================
                PROJECT STATS
            ========================= */}

            <StatsCards
                cards={projectStats}
            />


            {/* =========================
                FILTER
            ========================= */}

            <ReusableFilter

                search={search}

                onSearch={setSearch}


                department={department}

                departments={[
                    "HR",
                    "Finance",
                    "Development",
                    "Marketing",
                ]}

                onDepartment={
                    setDepartment
                }


                status={status}

                statuses={[
                    "Present",
                    "Absent",
                    "On Leave",
                ]}

                onStatus={setStatus}


                date={month}

                onDate={setMonth}


                showSearch

                showDepartment

                showStatus


                rightAction={

                    <HeaderButton
                        $variant="blue"
                    >

                        + ADD EMPLOYEE

                    </HeaderButton>

                }

            />


            {/* =========================
                EMPLOYEE TABLE
            ========================= */}

            <ReusableTable

                columns={employeeColumns}

                data={paginatedData}

            />

        </DetailsPage>
    );
};


export default ProjectDetails;