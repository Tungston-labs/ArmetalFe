import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartments, createNewDepartment } from '../../Redux/departmentSlice.js';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi'; // Make sure this is imported in your file
import EmployeeIcon from "../../assets/employeeicon.svg";

import {
  DepartmentContainer,
  HeaderSection,
  TitleSection,
  Subtitle,
  ActionArea,
  AddButton,
  SearchInput,
  SearchIcon,
  CardGrid,
  DepartmentCard,
  HeadInfo,
  Title,

  CardRight,
  TopBar,
  HRManager,
  ModalOverlay,
  CloseButton,
  ModalContent,
  InitialCircle,
  SearchWrapper,
  DropdownMenu, DropdownWrapper
  
} from '../department/DepartmentStyles';

import {
  Container,
  TitleRow,
  Form,
  FormGroup,
  Label,
  Input,
  ButtonRow,
  CancelButton,
  SaveButton,
  BackArrow,
  
} from './AddDepartment.Styles';
import { Spin } from "antd";

import Employee from "../../assets/employee.svg"; 
import { FaPlus, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { PiUserCirclePlusThin } from "react-icons/pi";
import { GoArrowUpRight } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import Navbar from '../../Components/Navbar.jsx';
const Department = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: departments, loading, error } = useSelector((state) => state.departments);
 const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    department_code: ''
  });

  useEffect(() => {
    dispatch(getDepartments({ page: 1, search }));
  }, [dispatch, search]);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const result = await dispatch(createNewDepartment(formData));
      if (createNewDepartment.fulfilled.match(result)) {
        setShowModal(false);
        setFormData({ name: '', department_code: '' });
        dispatch(getDepartments({ page: 1, search: search.trim() }));
      } else {
        console.error('Department creation failed:', result.payload);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/departments/${id}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          <Spin size="large" tip="Loading departments..." />
        </div>
      </>
    );
  }
  

  return (
    <>
    <Navbar/>
    <DepartmentContainer>
      {/* <TopBar>
        <div />
          <DropdownWrapper>
        <HRManager onClick={() => setMenuOpen(!menuOpen)}>
          <img src="/images/user.jpg" alt="HR Manager" />
          <IoIosArrowDown size={18} style={{ marginLeft: "5px", cursor: "pointer" }} />
        </HRManager>

        {menuOpen && (
          <DropdownMenu>
            <div>Change Password</div>
            <div>Logout</div>
          </DropdownMenu>
        )}
      </DropdownWrapper>
      </TopBar> */}

      <HeaderSection>
<TitleSection>
  <div className="left-content">
    <div className="icon-box">
   <img src={EmployeeIcon} alt="employeeIcon" style={{ height: "60px" }} />
    </div>
    <div>
      <Title>Department</Title>
      <Subtitle>Manage all departments within the organization.</Subtitle>
    </div>
  </div>

  <AddButton onClick={() => setShowModal(true)}>
    <FaPlus /> Add Department
  </AddButton>
</TitleSection>



        <ActionArea>
        <SearchWrapper>
    <SearchIcon />
    <SearchInput
      type="text"
      placeholder="Search by Department name"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </SearchWrapper>
          
        </ActionArea>
      </HeaderSection>

      <CardGrid>
  {loading ? (
    <p>Loading...</p>
  ) : error ? (
    <p style={{ color: 'red' }}>Error: {error?.detail?.toString()}</p>
  ) : Array.isArray(departments) && departments.length > 0 ? (
    departments.map((dept) => {
      const initial = dept.name?.[0]?.toUpperCase() || '?';
      return (
        <DepartmentCard key={dept.id} onClick={() => handleCardClick(dept.id)}>
  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
    <InitialCircle className="initial-circle">{initial}</InitialCircle>
    <div>
      <h3 className="dept-name">{dept.name}</h3>
      <HeadInfo>
        <small className="subtitle">Department Head</small>
        <div className="head-row">
          {typeof dept.department_head === 'object' &&
          dept.department_head?.profile_pic ? (
            <img
              src={dept.department_head.profile_pic}
              alt={dept.department_head.name}
            />
          ) : (
            <PiUserCirclePlusThin size={24} color="#999" />
          )}
          <p className="head-name">
            {typeof dept.department_head === 'object'
              ? dept.department_head?.name
              : dept.department_head || 'Not Assigned'}
          </p>
        </div>
      </HeadInfo>
    </div>
  </div>

  <CardRight>
    <div className="card-value">{dept.employee_count || 0}</div>
    <div className="arrow-icon">
      <GoArrowUpRight size={15} style={{ strokeWidth: 2 }} />
    </div>
  </CardRight>
</DepartmentCard>

      );
    })
  ) : (
    <p>No departments found.</p>
  )}
</CardGrid>


      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <Container style={{ position: 'relative', maxWidth: '600px' }}>
              <CloseButton onClick={() => setShowModal(false)} title="Close modal" aria-label="Close modal">
                <FaTimes />
              </CloseButton>
              <TitleRow>
                <BackArrow onClick={() => setShowModal(false)} title="Back" aria-label="Back">
                  <FaArrowLeft />
                </BackArrow>
                <Title>Add Department</Title>
              </TitleRow>

              <Form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <FormGroup>
                  <Label>Department name</Label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Department name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Department Code Name</Label>
                  <Input
                    type="text"
                    name="department_code"
                    placeholder="Eg HR"
                    value={formData.department_code}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                {error?.detail && <p style={{ color: 'red' }}>{error?.detail}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <ButtonRow>
                  <CancelButton type="button" onClick={() => setShowModal(false)}>Cancel</CancelButton>
                  <SaveButton type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </SaveButton>
                </ButtonRow>
              </Form>
            </Container>
          </ModalContent>
        </ModalOverlay>
      )}
    </DepartmentContainer>
    </>
  );
};

export default Department;