import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  PageWrapper,
  HeaderSection,
  TitleSection,
  Title,
  Subtitle,
  SearchBar,
  AddFieldButton,
  CardsGrid,
  Card,
  CardHeader,
  CardTitle,
  CardText,
  CardFooter,
  Tag,
  CardTitleSection,
  IconWrapper,
  TextGroup,
  SearchContainer,
  SearchIcon,
} from "./FieldShift.Styles";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import cardBg from "../../assets/shift.svg";
import AddProjectModal from "../../Components/AddProjectModal";
import FieldShiftIcon from "../../assets/projecticon.svg";
import TagIcon from "../../assets/downicon.svg";
// import Navbar from "../../Components/Navbar";
import { FaPlus } from "react-icons/fa";
import { getProjects } from "../../Redux/fieldShiftSlice";
import Loader from "../../Components/Loader";
import EmployeeTitle from "../../Components/EmployeeTitle";

const DepartmentPage = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();  
  const [searchTerm, setSearchTerm] = useState("");

  const { projects, isLoading } = useSelector((state) => state.projects);

  // Fetch projects from API
  useEffect(() => {
    dispatch(getProjects({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  const handleSaveProject = (data) => {
    console.log("New Project Added:", data);
    setIsModalOpen(false);
    dispatch(getProjects()); // refresh project list
  };

  return (
    <>
      {/* <Navbar /> */}
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
/>
       

        

        <CardsGrid>
  {isLoading ? (
<Loader/>
  ) : projects.length === 0 ? (
    <p>No projects found.</p>
  ) : (
    projects.map((project) => (
      <Card
        key={project.id}
        style={{ backgroundImage: `url(${cardBg})`, cursor: "pointer" }}
        onClick={() => navigate(`/project-department/${project.id}`, { state: { projectName: project.name } })}
      >
        <CardHeader>
          <CardTitleSection>
            <CardTitle>{project.name}</CardTitle>
          </CardTitleSection>
          <HiOutlineDotsHorizontal className="menu-icon" />
        </CardHeader>

        <CardText>
          <span>Total employees</span>
          <span className="employee-count">{project.employees?.length || 0}</span>
        </CardText>

        <CardFooter>
          <Tag>
            <img src={TagIcon} alt="Tag icon" />
            {project.punch_type || "N/A"}
          </Tag>
        </CardFooter>
      </Card>
    ))
  )}
</CardsGrid>


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
