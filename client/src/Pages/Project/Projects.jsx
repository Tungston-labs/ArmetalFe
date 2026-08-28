import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProjectCard from "../../Components/Project/ProjectCard";

import {
    ProjectsPage,
    ProjectsContainer,
    ProjectsGrid,
} from "./Projects.styles";

import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";
import StatsCards from "../../Components/StatsCards/StatsCards";

import ProjectModal from "../../Components/Project/modal/ProjectModal";
import AddEmployeeModal from "../../Components/Project/modal/Addemployeemodal";

import {
    getProjects,
    createProject,
    updateProject,
    getEmployeesNotInProject,
    assignEmployees,
} from "../../Redux/fieldShiftSlice";

import { projectCards } from "../../utils/projectCards";

const Projects = () => {
    const dispatch = useDispatch();

    // =========================
    // REDUX STATE
    // =========================
    // NOTE: the slice stores isLoading / isError / message,
    // not loading / error - using the wrong keys meant the
    // loading and error UI never showed up.

    const {
        projects = [],
        employeesNotInProject = [],
        isLoading,
        isError,
        message,
    } = useSelector((state) => state.projects);

    // =========================
    // LOCAL STATE
    // =========================

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [month, setMonth] = useState("");

    const [page, setPage] = useState(1);

    // Project modal
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    // Employee modal
    const [showAddEmployee, setShowAddEmployee] = useState(false);
    const [selectedEmployeeProject, setSelectedEmployeeProject] =
        useState(null);
    const [isAssigning, setIsAssigning] = useState(false);

    // =========================
    // GET PROJECTS
    // =========================

    useEffect(() => {
        dispatch(
            getProjects({
                search,
                page,
            })
        );
    }, [dispatch, search, page]);

    // =========================
    // ADD PROJECT
    // =========================

    const handleAddProject = () => {
        setSelectedProject(null);
        setShowProjectModal(true);
    };

    // =========================
    // EDIT PROJECT
    // =========================
    // Wire this to an edit action on ProjectCard if/when you
    // want inline editing from the list view.

    const handleEditProject = (project) => {
        setSelectedProject(project);
        setShowProjectModal(true);
    };

    // =========================
    // CLOSE PROJECT MODAL
    // =========================

    const handleCloseProjectModal = () => {
        setShowProjectModal(false);
        setSelectedProject(null);
    };

    // =========================
    // MODAL FIELDS -> BACKEND FIELDS
    // =========================
    // Same mapping ProjectDetails.jsx uses for update, applied
    // to create as well so both hit the API with matching keys.

    const toProjectPayload = (formData) => ({
        name: formData.projectName,
        punch_type: formData.projectType,
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null,
        priority: formData.priority,
        start_date: formData.startDate || null,
        status: formData.projectStatus,
    });

    // =========================
    // CREATE / UPDATE PROJECT
    // =========================

    const handleProjectSubmit = async (formData, editData) => {
        try {
            const projectData = toProjectPayload(formData);

            if (editData) {
                // =====================================
                // UPDATE PROJECT
                // =====================================

                await dispatch(
                    updateProject({
                        id: editData.id,
                        projectData,
                    })
                ).unwrap();

            } else {
                // =====================================
                // CREATE PROJECT
                // =====================================

                await dispatch(
                    createProject(projectData)
                ).unwrap();
            }

            // Refresh project list either way
            dispatch(
                getProjects({
                    search,
                    page,
                })
            );

            handleCloseProjectModal();

        } catch (error) {
            console.error("Project operation failed:", error);
        }
    };

    // =========================
    // ADD EMPLOYEE
    // =========================
    // Fetch the employees not already on this project first,
    // same as ProjectDetails.jsx, so the modal has data to show.

    const handleAddEmployee = async (project) => {
        if (!project?.id) return;

        setSelectedEmployeeProject(project);

        try {
            await dispatch(
                getEmployeesNotInProject(project.id)
            ).unwrap();

            setShowAddEmployee(true);

        } catch (error) {
            console.error(
                "Failed to get available employees:",
                error
            );
        }
    };

    const handleCloseAddEmployee = () => {
        setShowAddEmployee(false);
        setSelectedEmployeeProject(null);
    };

    const handleAssignEmployees = async (employeeIds) => {
        if (!selectedEmployeeProject?.id || !employeeIds?.length) {
            return;
        }

        try {
            setIsAssigning(true);

            await dispatch(
                assignEmployees({
                    projectId: selectedEmployeeProject.id,
                    employeeIds,
                })
            ).unwrap();

            // Refresh so member avatars/counts update on the card
            dispatch(
                getProjects({
                    search,
                    page,
                })
            );

            handleCloseAddEmployee();

        } catch (error) {
            console.error("Failed to assign employees:", error);
        } finally {
            setIsAssigning(false);
        }
    };

    // =========================
    // FILTER PROJECTS
    // =========================

    const filteredProjects = projects.filter((project) => {
        // Status filter
        if (status && project.status !== status) {
            return false;
        }

        // Month filter (backend field is start_date)
        if (month) {
            const projectDate = project.start_date || project.date;

            if (projectDate) {
                const selectedMonth = new Date(month)
                    .toISOString()
                    .slice(0, 7);

                const projectMonth = new Date(projectDate)
                    .toISOString()
                    .slice(0, 7);

                if (selectedMonth !== projectMonth) {
                    return false;
                }
            }
        }

        return true;
    });

    // =========================
    // RENDER
    // =========================

    return (
        <ProjectsPage>

            {/* ========================= */}
            {/* HEADER */}
            {/* ========================= */}

            <ReusableHeader
                title="Projects"
                breadcrumbs={["Projects"]}
                buttonText="+ ADD NEW PROJECT"
                onButtonClick={handleAddProject}
            />

            {/* ========================= */}
            {/* STATS */}
            {/* ========================= */}

            <StatsCards cards={projectCards} />

            {/* ========================= */}
            {/* FILTERS */}
            {/* ========================= */}

            <ReusableFilter
                search={search}
                onSearch={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
                status={status}
                statuses={[
                    "On Site",
                    "Variant",
                    "Office",
                ]}
                onStatus={(value) => {
                    setStatus(value);
                    setPage(1);
                }}
                date={month}
                onDate={(value) => {
                    setMonth(value);
                    setPage(1);
                }}
                showSearch
                showStatus
                showDate
            />

            {/* ========================= */}
            {/* LOADING */}
            {/* ========================= */}

            {isLoading && (
                <div>
                    Loading projects...
                </div>
            )}

            {/* ========================= */}
            {/* ERROR */}
            {/* ========================= */}

            {isError && (
                <div>
                    {message || "Failed to load projects."}
                </div>
            )}

            {/* ========================= */}
            {/* PROJECT CARDS */}
            {/* ========================= */}

            {!isLoading && (
                <ProjectsContainer>
                    <ProjectsGrid>

                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((project) => (
                                <ProjectCard
                                    key={project.id}

                                    id={project.id}

                                    project={project}

                                    category={project.punch_type}

                                    title={project.name}

                                    date={
                                        project.start_date ||
                                        project.date ||
                                        ""
                                    }

                                    status={project.status}

                                    priority={project.priority || ""}

                                    members={project.employees || []}

                                    memberCount={
                                        project.employees?.length || 0
                                    }

                                    onAddMember={handleAddEmployee}
                                />
                            ))
                        ) : (
                            <div>
                                No projects found.
                            </div>
                        )}

                    </ProjectsGrid>
                </ProjectsContainer>
            )}

            {/* ========================= */}
            {/* ADD / EDIT PROJECT MODAL */}
            {/* ========================= */}

            <ProjectModal
                isOpen={showProjectModal}
                onClose={handleCloseProjectModal}
                editData={selectedProject}
                onSubmit={handleProjectSubmit}
            />

            {/* ========================= */}
            {/* ADD EMPLOYEE MODAL */}
            {/* ========================= */}

            <AddEmployeeModal
                isOpen={showAddEmployee}
                onClose={handleCloseAddEmployee}
                employees={employeesNotInProject}
                onAdd={handleAssignEmployees}
                isLoading={isAssigning}
            />

        </ProjectsPage>
    );
};

export default Projects;