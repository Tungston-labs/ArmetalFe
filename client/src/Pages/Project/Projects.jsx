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
import AddProjectModal from "../../Components/Project/AddProjectModal";

const Projects = () => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [month, setMonth] = useState("");
    const [showAddProject, setShowAddProject] = useState(false);
    return (
        <ProjectsPage>

            <ReusableHeader
                title="Projects"
                breadcrumbs={["Projects"]}
                buttonText="+ ADD NEW PROJECT"
                onButtonClick={() => setShowAddProject(true)}
            />

            <StatsCards cards={projectCards} />

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
                        />
                    ))}
                </ProjectsGrid>
            </ProjectsContainer>
            <AddProjectModal
                isOpen={showAddProject}
                onClose={() => setShowAddProject(false)}
                onCreate={(data) => {
                    console.log("Project Data:", data);

                    setShowAddProject(false);
                }}
            />
        </ProjectsPage>

    );
};

export default Projects;