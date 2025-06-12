import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartments, createNewDepartment } from '../../Redux/departmentSlice.js';
import {
  DepartmentContainer,
  HeaderSection,
  Icon,
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
} from '../department/DepartmentStyles';
import {
  Container,
  TitleRow,
  Title,
  Form,
  FormGroup,
  Label,
  Input,
  Select,
  ButtonRow,
  CancelButton,
  SaveButton,
  BackArrow,
} from './AddDepartment.Styles';
import { FaPlus, FaSearch, FaSitemap, FaTimes, FaArrowLeft } from 'react-icons/fa';

const Department = () => {
  const dispatch = useDispatch();
  const { list: departments, loading, error } = useSelector((state) => state.departments);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    department_code: '',
    department_head: ''
  });

  useEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const dataToSend = {
        ...formData,
        department_head: formData.department_head || null,
      };
      const result = await dispatch(createNewDepartment(dataToSend));
      if (createNewDepartment.fulfilled.match(result)) {
        setShowModal(false);
        setFormData({ name: '', code: '', head: '' });
        dispatch(getDepartments()); // refresh list
      } else {
        console.error('Department creation failed:', result.payload);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };
  

  return (
    <DepartmentContainer>
      <TopBar>
        <div />
        <HRManager>
          <img src="https://i.pravatar.cc/40?img=5" alt="HR Manager" />
          <span>HR Manager</span>
        </HRManager>
      </TopBar>

      <HeaderSection>
        <TitleGroup>
          <Icon><FaSitemap /></Icon>
          <div>
            <h2>Department</h2>
            <p>Manage all departments within the organization.</p>
          </div>
        </TitleGroup>
        <ActionArea>
          <AddButton onClick={() => setShowModal(true)}><FaPlus /> Add Department</AddButton>
          <SearchInput type="text" placeholder="Search by Department name" />
        </ActionArea>
      </HeaderSection>

      <CardGrid>
  {loading ? (
    <p>Loading...</p>
  ) : error ? (
    <p style={{ color: 'red' }}>Error: {error.toString()}</p>
  ) : Array.isArray(departments) && departments.length > 0 ? (
    departments.map((dept) => (
      <DepartmentCard key={dept.id}>
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
                    name="code"
                    placeholder="Eg HR"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup fullWidth>
                  <Label>Department head</Label>
                  <Select name="head" value={formData.head} onChange={handleChange} required>
                    <option value="">Choose an Employee</option>
                    <option value="1">John Marshal</option>
                    <option value="2">Jane Doe</option>
                  </Select>
                </FormGroup>

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
