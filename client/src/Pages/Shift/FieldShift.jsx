import {useState} from "react";
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
import FieldShiftIcon from "../../assets/shifttopper.svg";
import TagIcon from "../../assets/downicon.svg";
import Navbar from "../../Components/Navbar";
import { FaPlus } from "react-icons/fa";
const DepartmentPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  const departments = [
    { name: "Sales", employees: 12, tag: "Variant" },
    { name: "Project Name", employees: 12, tag: "On Site" },
    { name: "Project Name", employees: 12, tag: "On Site" },
    { name: "Project Name", employees: 12, tag: "On Site" },
    { name: "Sales", employees: 12, tag: "Variant" },
    { name: "Project Name", employees: 12, tag: "On Site" },
    { name: "Project Name", employees: 12, tag: "On Site" },
    { name: "Project Name", employees: 12, tag: "On Site" },
     { name: "Sales", employees: 12, tag: "Variant" },
    { name: "Project Name", employees: 12, tag: "On Site" },
    { name: "Project Name", employees: 12, tag: "On Site" },
    { name: "Project Name", employees: 12, tag: "On Site" },
     { name: "Sales", employees: 12, tag: "Variant" },
    { name: "Project Name", employees: 12, tag: "On Site" },
    { name: "Project Name", employees: 12, tag: "On Site" },
    { name: "Project Name", employees: 12, tag: "On Site" },
  ];
const handleSaveProject = (data) => {  
    console.log('New Field Added:', data);
  };
  return (<>
    <Navbar/>
    <PageWrapper>
      <HeaderSection>
     <TitleSection>
  <IconWrapper>
    <img src={FieldShiftIcon} alt="FieldShift" />
  </IconWrapper>
  <TextGroup>
    <Title>FieldShift</Title>
    <Subtitle>Manage all departments within the organization.</Subtitle>
  </TextGroup>
</TitleSection>

      <AddFieldButton onClick={() => setIsModalOpen(true)}>
     <FaPlus />  Add Field
        </AddFieldButton>
      </HeaderSection>
<SearchContainer>
  <SearchIcon />
  <SearchBar placeholder="Search by Company name" />
</SearchContainer>

      <CardsGrid>
        {departments.map((dept, index) => (
  <Card key={index} style={{ backgroundImage: `url(${cardBg})` }}>
  <CardHeader>
  <CardTitleSection>
    <CardTitle>{dept.name}</CardTitle>
  </CardTitleSection>
  <HiOutlineDotsHorizontal className="menu-icon" />
</CardHeader>

  <CardText>
  <span>Total employee</span>
  <span className="employee-count">{dept.employees}</span>
</CardText>

    <CardFooter>
  <Tag>
    <img src={TagIcon} alt="Tag icon" />
    {dept.tag}
  </Tag>
</CardFooter>
  </Card>
))}

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
