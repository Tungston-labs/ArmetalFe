import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    PiCalendarBlank,
    PiCheckCircle,
    PiFlag,
    PiPencilSimple,
    PiTrash,
    PiUsersThree,
} from "react-icons/pi";

import {
    projectData,
} from "../../utils/projectData";

import {
    projectEmployeeColumns,
    projectEmployeeData,
} from "../../utils/projectEmployees";

import {
    HeaderButton,
} from "../../Components/ReusableTable/ReusableHeader.styles";

import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";
import StatsCards from "../../Components/StatsCards/StatsCards";
import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";

import {
    DetailsPage,
    DetailsContainer,
    Title,
} from "./ProjectDetails.styles";

import ReusableConfirmModal from "../../Components/modals/ReusableConfirmModal";
import AddEmployeeModal from "../../Components/Project/modal/Addemployeemodal";

import {
    getEmployeesNotInProject,
    assignEmployees,
} from "../../Redux/fieldShiftSlice";


const ProjectDetails = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const dispatch = useDispatch();


    // =====================================================
    // REDUX: employees available to add to this project
    // =====================================================

    const {
        employeesNotInProject,
        isLoading: isAssigning,
    } = useSelector((state) => state.projects);


    // =====================================================
    // PAGINATION
    // =====================================================

    const [currentPage, setCurrentPage] = useState(1);

    const [rowsPerPage, setRowsPerPage] = useState(10);


    // =====================================================
    // DELETE PROJECT MODAL
    // =====================================================

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [isDeleting, setIsDeleting] = useState(false);


    // =====================================================
    // ADD EMPLOYEE MODAL
    // =====================================================

    const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);


    // =====================================================
    // EMPLOYEES (still dummy — the table itself hasn't been
    // wired to the API yet, only the "add employee" flow has)
    // =====================================================

    const [employees, setEmployees] = useState(
        projectEmployeeData
    );


    // =====================================================
    // FILTERS
    // =====================================================

    const [search, setSearch] = useState("");

    const [department, setDepartment] = useState("");

    const [status, setStatus] = useState("");

    const [month, setMonth] = useState("");


    // =====================================================
    // FIND PROJECT
    // =====================================================

    const project = projectData.find(
        (item) => item.id === Number(id)
    );


    // =====================================================
    // OPEN ADD EMPLOYEE MODAL
    // =====================================================

    const handleOpenAddEmployee = () => {

        if (!project) return;

        // Real project IDs come from the API, not the dummy
        // projectData array — swap `project.id` below once
        // ProjectDetails itself is wired to getProjectById.
        dispatch(getEmployeesNotInProject(project.id));

        setShowAddEmployeeModal(true);

    };


    // =====================================================
    // ADD SELECTED EMPLOYEES
    // =====================================================

    const handleAddEmployees = async (employeeIds) => {

        if (!project) return;

        const result = await dispatch(
            assignEmployees({
                projectId: project.id,
                employeeIds,
            })
        );

        if (assignEmployees.fulfilled.match(result)) {

            // If the API returns the updated project with its
            // employee list, sync the table with it. Otherwise,
            // fall back to optimistically merging the selected
            // rows from employeesNotInProject into local state.
            const updatedProject = result.payload;

            if (updatedProject?.employees) {

                setEmployees(updatedProject.employees);

            } else {

                const addedEmployees = employeesNotInProject.filter(
                    (employee) => employeeIds.includes(employee.id)
                );

                setEmployees((prev) => [
                    ...prev,
                    ...addedEmployees,
                ]);

            }

            setShowAddEmployeeModal(false);

        }

    };


    // =====================================================
    // DELETE PROJECT
    // =====================================================

    const handleDeleteProject = async () => {

        try {

            setIsDeleting(true);

            console.log(
                "Deleting project:",
                project.id
            );

            /*
             * Currently using dummy projectData.
             *
             * When your Redux API is ready, replace this
             * section with:
             *
             * await dispatch(
             *     deleteProject(Number(id))
             * ).unwrap();
             */

            await new Promise((resolve) =>
                setTimeout(resolve, 500)
            );

            setShowDeleteModal(false);

            navigate("/projects");

        } catch (error) {

            console.error(
                "Failed to delete project:",
                error
            );

        } finally {

            setIsDeleting(false);

        }
    };


    // =====================================================
    // DELETE EMPLOYEE
    // =====================================================

    const handleDeleteEmployee = (employeeId) => {

        console.log(
            "Delete employee:",
            employeeId
        );

        setEmployees((prevEmployees) =>
            prevEmployees.filter(
                (employee) =>
                    employee.id !== employeeId
            )
        );

    };


    // =====================================================
    // PAGINATED DATA
    // =====================================================

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


    // =====================================================
    // PROJECT NOT FOUND
    // =====================================================

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


    // =====================================================
    // EMPLOYEE TABLE COLUMNS
    // =====================================================

    const employeeColumns = [

        ...projectEmployeeColumns.filter(
            (column) =>
                column.accessor !== "action"
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

                        handleDeleteEmployee(
                            row.id
                        );

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


    // =====================================================
    // PROJECT STATS
    // =====================================================

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


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <DetailsPage>

            {/* =================================================
                HEADER
            ================================================= */}

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

                {/* EDIT */}

                <HeaderButton
                    type="button"
                >

                    <PiPencilSimple />

                    Edit

                </HeaderButton>


                {/* DELETE */}

                <HeaderButton

                    type="button"

                    $variant="danger"

                    onClick={() => {

                        console.log(
                            "DELETE PROJECT BUTTON CLICKED"
                        );

                        setShowDeleteModal(true);

                    }}

                >

                    <PiTrash />

                    Delete

                </HeaderButton>

            </ReusableHeader>


            {/* =================================================
                PROJECT STATS
            ================================================= */}

            <StatsCards
                cards={projectStats}
            />


            {/* =================================================
                FILTER
            ================================================= */}

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
                        type="button"
                        $variant="blue"
                        onClick={handleOpenAddEmployee}
                    >

                        + ADD EMPLOYEE

                    </HeaderButton>

                }

            />


            {/* =================================================
                EMPLOYEE TABLE
            ================================================= */}

            <ReusableTable

                columns={employeeColumns}

                data={paginatedData}

            />


            {/* =================================================
                DELETE PROJECT MODAL
            ================================================= */}

            <ReusableConfirmModal

                show={showDeleteModal}

                title="Delete Project"

                message={
                    `Are you sure you want to delete "${project.title}"? This action cannot be undone.`
                }

                confirmText="Delete"

                cancelText="Cancel"

                confirmVariant="danger"

                cancelVariant="cancel"

                loadingText="Deleting..."

                loading={isDeleting}

                onConfirm={
                    handleDeleteProject
                }

                onClose={() => {

                    if (!isDeleting) {
                        setShowDeleteModal(false);
                    }

                }}

            />


            {/* =================================================
                ADD EMPLOYEE MODAL
            ================================================= */}

            <AddEmployeeModal

                isOpen={showAddEmployeeModal}

                onClose={() => setShowAddEmployeeModal(false)}

                employees={employeesNotInProject}

                departments={[
                    "HR",
                    "Finance",
                    "Development",
                    "Marketing",
                ]}

                onAdd={handleAddEmployees}

                isLoading={isAssigning}

            />

        </DetailsPage>
    );
};


export default ProjectDetails;