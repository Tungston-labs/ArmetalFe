import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  PageWrapper,
  CardsGrid,
  Card,
  CardHeader,
  CardTitle,
  CardText,
  CardFooter,
  Tag,
  CardTitleSection,
  StatusTag,
} from "./FieldShift.Styles";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import cardBg from "../../assets/shift.svg";
import AddProjectModal from "../../Components/AddProjectModal";
import FieldShiftIcon from "../../assets/projecticon.svg";
import TagIcon from "../../assets/downicon.svg";
import { getProjects } from "../../Redux/fieldShiftSlice";
import Loader from "../../Components/Loader";
import EmployeeTitle from "../../Components/EmployeeTitle";
import NoEmployeeFound from "../../Components/No found/Noemployeefound";

const DepartmentPage = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(0);
const { projects = [], isLoading = false } = useSelector(
  (state) => state.projects || {}
);
  const statusColors = {
    "In Progress": "#fac25b",
    Completed: "#5abe7f",
    Pending: "#e07777",
  };

  useEffect(() => {
    dispatch(getProjects({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  const handleSaveProject = (data) => {
    console.log("New Project Added:", data);
    setIsModalOpen(false);
    dispatch(getProjects());
  };

  return (
    <>
      <PageWrapper>
        <EmployeeTitle
          iconSrc={FieldShiftIcon}
          title="Project"
          subtitle="Manage all projects within the organization"
          buttonText="Add Project"
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onAddClick={() => setIsModalOpen(true)}
          showDropdown={false}
          showBackArrow={false}
          showTabs={false}
          searchPlaceholder="Search Project Name"
        />
<CardsGrid>
  {isLoading ? (
    <Loader />
  ) : projects.length > 0 ? (
    projects.map((project) => (
      <Card
        key={project.id}
        style={{ backgroundImage: `url(${cardBg})`, cursor: "pointer" }}
        onClick={() =>
          navigate(`/project-department/${project.id}`, {
            state: { projectName: project.name },
          })
        }
      >
        <CardHeader>
          <CardTitleSection>
            <CardTitle>{project.name}</CardTitle>
          </CardTitleSection>
          <HiOutlineDotsHorizontal className="menu-icon" />
        </CardHeader>

        <CardText>
          <span>Total employees</span>
          <span className="employee-count">
            {project.employees?.length || 0}
          </span>
        </CardText>

        <CardFooter>
          <Tag>
            <img src={TagIcon} alt="Tag icon" />
            {project.punch_type || "N/A"}
          </Tag>
          <StatusTag bgcolor={statusColors[project.status]}>
            {project.status || "i"}
          </StatusTag>
        </CardFooter>
      </Card>
    ))
  ) : null}
</CardsGrid>

{/* ✅ Outside the grid so it spans full width */}
{!isLoading && projects.length === 0 && (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <NoEmployeeFound searchTerm={searchTerm} label="No Projects Found" />
  </div>
)}

        <AddProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProject}
        />
      </PageWrapper>
    </>
  );
};

export default DepartmentPage;
