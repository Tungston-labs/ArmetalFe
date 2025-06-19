import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartments, createNewDepartment } from '../../Redux/departmentSlice.js';
import { useNavigate } from 'react-router-dom';
import {
  DepartmentContainer,
  HeaderSection,
  TitleGroup,
  ActionArea,
  AddButton,
  SearchInput,
  CardGrid,
  DepartmentCard,
  HeadInfo,
  Avatar,
  CardValue,
  TopBar,
  HRManager,
  ModalOverlay,
  CloseButton,
  ModalContent,
  TitleSection,
  Subtitle
} from '../department/DepartmentStyles';
import {
  Container,
  TitleRow,
  Title,
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

const Department = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: departments, loading, error } = useSelector((state) => state.departments);
console.log(error)
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    department_code: ''
  });

  useEffect(() => {
    dispatch(getDepartments(search));
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
        dispatch(getDepartments(search.trim()));
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

  return (
    <DepartmentContainer>
      <TopBar>
        <div />
        <HRManager>
          <img src="/images/user.jpg" alt="HR Manager" />
          <span>HR Manager</span>
        </HRManager>
      </TopBar>

      <HeaderSection>
        <TitleSection>
          <img src="/images/department.png" alt="Icon" style={{ height: "74px" }} />
          <div>
            <Title>Department</Title>
            <Subtitle>Manage all departments within the organization.</Subtitle>
          </div>
        </TitleSection>
        <ActionArea>
          <AddButton onClick={() => setShowModal(true)}><FaPlus /> Add Department</AddButton>
          <SearchInput
            type="text"
            placeholder="Search by Department name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </ActionArea>
      </HeaderSection>

      <CardGrid>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>Error: {error?.detail?.toString()}</p>
        ) : Array.isArray(departments) && departments.length > 0 ? (
          departments.map((dept) => (
            <DepartmentCard key={dept.id} onClick={() => handleCardClick(dept.id)}>
              <h3>{dept.name}</h3>
              <HeadInfo>
                <Avatar src="https://i.pravatar.cc/40?img=3" />
                <div>
                  <small>Department head</small>
                  <p>
                    {typeof dept.department_head === 'object'
                      ? dept.department_head?.name
                      : dept.department_head || 'Not Assigned'}
                  </p>
                </div>
                <CardValue>{dept.employee_count || 0}</CardValue>
              </HeadInfo>
            </DepartmentCard>
          ))
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

                {/* <FormGroup fullWidth>
                  <Label>Department head</Label>
                  <Select name="head" value={formData.department_head} onChange={handleChange} required>
                    <option value="">Choose an Employee</option>
                    <option value="1">John Marshal</option>
                    <option value="2">Jane Doe</option>
                  </Select>
                </FormGroup> */}

                {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
                {error?.detail && <p style={{ color: 'red' }}>{error?.detail||"wageges"}</p>}
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
  );
};

export default Department;
