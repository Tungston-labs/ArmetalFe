import React, { useState } from "react";

import ProjectCard from "../../Components/Project/ProjectCard";
import { projectData } from "../../utils/projectData";
import { projectCards } from "../../utils/projectCards";

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

const Projects = () => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [month, setMonth] = useState("");

    // Project modal
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    // Employee modal
    const [showAddEmployee, setShowAddEmployee] = useState(false);
    const [selectedEmployeeProject, setSelectedEmployeeProject] =
        useState(null);

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
    // CREATE / UPDATE PROJECT
    // =========================
    const handleProjectSubmit = (formData, editData) => {
        if (editData) {
            console.log("UPDATE PROJECT");
            console.log("Project ID:", editData.id);
            console.log("Updated Data:", formData);

            // UPDATE API HERE
        } else {
            console.log("CREATE PROJECT");
            console.log("New Project:", formData);

            // CREATE API HERE
        }

        handleCloseProjectModal();
    };

    // =========================
    // ADD EMPLOYEE
    // =========================
    const handleAddEmployee = (project) => {
        setSelectedEmployeeProject(project);
        setShowAddEmployee(true);
    };

    return (
        <ProjectsPage>

            {/* Header */}
            <ReusableHeader
                title="Projects"
                breadcrumbs={["Projects"]}
                buttonText="+ ADD NEW PROJECT"
                onButtonClick={handleAddProject}
            />

            {/* Stats */}
            <StatsCards cards={projectCards} />

            {/* Filters */}
            <ReusableFilter
                search={search}
                onSearch={setSearch}
                status={status}
                statuses={[
                    "On Site",
                    "Variant",
                    "Office",
                ]}
                onStatus={setStatus}
                date={month}
                onDate={setMonth}
                showSearch
                showStatus
                showDate
            />

            {/* Project Cards */}
            <ProjectsContainer>
                <ProjectsGrid>
                    {projectData.map((project) => (
                        <ProjectCard
                            key={project.id}
                            id={project.id}
                            category={project.category}
                            title={project.title}
                            date={project.date}
                            status={project.status}
                            priority={project.priority}
                            members={project.members}
                            memberCount={project.memberCount}
                            onAddMember={handleAddEmployee}

                            // If your ProjectCard has an edit button
                            onEdit={handleEditProject}
                        />
                    ))}
                </ProjectsGrid>
            </ProjectsContainer>

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
                onClose={() => {
                    setShowAddEmployee(false);
                    setSelectedEmployeeProject(null);
                }}
                project={selectedEmployeeProject}
                onCreate={(employeeData) => {
                    console.log("Employee:", employeeData);
                    console.log(
                        "Selected Project:",
                        selectedEmployeeProject
                    );

                    setShowAddEmployee(false);
                    setSelectedEmployeeProject(null);
                }}
            />

        </ProjectsPage>
    );
};

export default Projects;