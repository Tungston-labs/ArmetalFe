import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartments, createNewDepartment } from '../../Redux/departmentSlice.js';
import { useNavigate } from 'react-router-dom';
import EmployeeIcon from "../../assets/employeeicon.svg";

import {
  DepartmentContainer,
  HeaderSection,
  TitleSection,
  Subtitle,
  ActionArea,
  AddButton,
  SearchInput,
  CardGrid,
  DepartmentCard,
  HeadInfo,
  Title,
  CardRight,
  ModalOverlay,
  CloseButton,
  ModalContent,
  InitialCircle,
  SearchWrapper,
  EmployeeImage,
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

import { FaPlus, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { PiUserCirclePlusThin } from "react-icons/pi";
import { GoArrowUpRight } from "react-icons/go";
import Navbar from '../../Components/Navbar.jsx';
import Loader from "../../Components/Loader.jsx";

const Department = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: departments, loading, error } = useSelector((state) => state.departments);

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    department_code: ''
  });
  const [formError, setFormError] = useState("");

  // Fetch all departments once on mount
  useEffect(() => {
    dispatch(getDepartments({ page: 1, search: '' }));
  }, [dispatch]);

  // Client-side search (filter)
  const filteredDepartments = useMemo(() => {
    if (!search.trim()) return departments;
    return departments.filter((dept) =>
      dept.name.toLowerCase().includes(search.toLowerCase()) ||
      dept.department_code.toLowerCase().includes(search.toLowerCase())
    );
  }, [departments, search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // Force uppercase for name and code
    if (name === "name" || name === "department_code") {
      updatedValue = value.toUpperCase();
    }

    setFormData({ ...formData, [name]: updatedValue });
  };

  const handleSave = async () => {
    if (formData.department_code.length > 10) {
      setFormError("Department code cannot be more than 10 characters.");
      return;
    }
    try {
      const result = await dispatch(createNewDepartment(formData));

      if (createNewDepartment.fulfilled.match(result)) {
        setShowModal(false);
        setFormData({ name: '', department_code: '' });
        setFormError("");
        dispatch(getDepartments({ page: 1, search: '' })); // refresh list once
      } else {
        const errorMessage =
          result?.payload?.detail ||
          result?.payload?.message ||
          "Department with same code exist. Please try again.";
        setFormError(errorMessage);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setFormError("Something went wrong. Please try again later.");
    }
  };

  const handleCardClick = (id) => {
    navigate(`/departments/${id}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
        }}>
          <Loader />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <DepartmentContainer>
        <HeaderSection>
          <TitleSection>
            <div className="left-content">
              <div className="icon-box">
                <EmployeeImage src={EmployeeIcon} alt="employeeIcon" />
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
              <SearchInput
                type="text"
                placeholder="Search department name.."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchWrapper>
          </ActionArea>
        </HeaderSection>

        <CardGrid>
          {error ? (
            <p style={{ color: 'red' }}>Error: {error?.detail?.toString()}</p>
          ) : filteredDepartments?.length > 0 ? (
            filteredDepartments.map((dept) => {
              const initial = dept.name?.[0]?.toUpperCase() || '?';
              return (
                <DepartmentCard key={dept.id} onClick={() => handleCardClick(dept.id)}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <InitialCircle className="initial-circle">{initial}</InitialCircle>
                    <div>
                      <h3 className="dept-name" title={dept.name}>
                        {dept.name?.length > 10 ? dept.name.slice(0, 10) + "..." : dept.name}
                      </h3>

                      <HeadInfo>
                        <small className="subtitle">Department Head</small>
                        <div className="head-row">
                          {typeof dept.department_head === 'object' && dept.department_head?.profile_pic ? (
                            <img src={dept.department_head.profile_pic} alt={dept.department_head.name} />
                          ) : (
                            <PiUserCirclePlusThin size={24} color="#999" />
                          )}
                          <p className="head-name" title={
                            typeof dept.department_head === 'object'
                              ? dept.department_head?.name
                              : dept.department_head || 'Not Assigned'
                          }>
                            {(() => {
                              const headName = typeof dept.department_head === 'object'
                                ? dept.department_head?.name
                                : dept.department_head || 'Not Assigned';
                              return headName?.length > 10 ? headName.slice(0, 10) + "..." : headName;
                            })()}
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
            <p>No departments found</p>
          )}
        </CardGrid>

        {showModal && (
          <ModalOverlay>
            <ModalContent>
              <Container style={{ position: 'relative' }}>
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

                  {formError && <p style={{ color: 'red' }}>{formError}</p>}

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
