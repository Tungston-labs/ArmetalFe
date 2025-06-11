import React, { useState } from 'react';
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
  ModalContent
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
  const departments = [1, 2, 3, 4];
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    head: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // TODO: Add save logic here
    console.log('Saving:', formData);
    setShowModal(false);
    setFormData({ name: '', code: '', head: '' }); // reset form after save
  };

  return (
    <DepartmentContainer>
      {/* Top bar with HR Manager on right */}
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
        {departments.map((_, idx) => (
          <DepartmentCard key={idx}>
            <h3>QA / Testing</h3>
            <HeadInfo>
              <Avatar src="https://i.pravatar.cc/40?img=3" />
              <div>
                <small>Department head</small>
                <p>John Marshal</p>
              </div>
              <CardValue>125</CardValue>
            </HeadInfo>
          </DepartmentCard>
        ))}
      </CardGrid>

      {/* Modal */}
      {showModal && (
        <ModalOverlay>
          <ModalContent>
          <Container style={{ position: 'relative', maxWidth: '600px' }}>
            <CloseButton
              onClick={() => setShowModal(false)}
              title="Close modal"
              aria-label="Close modal"
              style={{ cursor: 'pointer' }}
            >
              <FaTimes />
            </CloseButton>
            <TitleRow>
              <BackArrow
                onClick={() => setShowModal(false)}
                style={{ cursor: 'pointer' }}
                title="Back"
                aria-label="Back"
              >
                <FaArrowLeft />
              </BackArrow>
              <Title>Add Department</Title>
            </TitleRow>

            <Form>
              <FormGroup>
                <Label>Department name</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Department name"
                  value={formData.name}
                  onChange={handleChange}
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
                />
              </FormGroup>

              <FormGroup fullWidth>
                <Label>Department head</Label>
                <Select name="head" value={formData.head} onChange={handleChange}>
                  <option value="">Choose an Employee</option>
                  <option value="john">John Marshal</option>
                  <option value="jane">Jane Doe</option>
                </Select>
              </FormGroup>

              <ButtonRow>
                <CancelButton onClick={() => setShowModal(false)}>Cancel</CancelButton>
                <SaveButton onClick={handleSave}>Save</SaveButton>
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
